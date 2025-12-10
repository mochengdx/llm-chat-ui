import type { Attachment, Message, StreamCallbacks, StreamRequest, TriggerItem } from "@llm/core";
import { StreamClient } from "@llm/core";
import { useLLMStore } from "@llm/store";
import {
  AtSign,
  BookOpen,
  Check,
  ChevronDown,
  Code,
  FileCode,
  FileText,
  Globe,
  Hammer,
  HardDrive,
  Hash,
  Image as ImageIcon,
  Layout,
  Maximize2,
  Menu,
  Mic,
  Minimize2,
  PenTool,
  Play,
  Plus,
  Send,
  Sparkles,
  Video,
  Wrench,
  X,
  Zap
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import MessageItem from "./MessageItem";
import SettingsModal from "./SettingsModal";
import SidebarMain from "./SidebarMain";

const MENTIONS_LIST: TriggerItem[] = [
  {
    id: "gemini",
    label: "Gemini",
    icon: <Sparkles size={14} className="text-blue-500 dark:text-blue-400" />,
    description: "Default Model"
  },
  {
    id: "docs",
    label: "Google Docs",
    icon: <FileText size={14} className="text-blue-600 dark:text-blue-500" />,
    description: "Search documents"
  },
  {
    id: "python",
    label: "Python",
    icon: <Code size={14} className="text-yellow-600 dark:text-yellow-500" />,
    description: "Run code"
  },
  {
    id: "drive",
    label: "Drive",
    icon: <HardDrive size={14} className="text-green-600 dark:text-green-500" />,
    description: "Access files"
  }
];

const TAGS_LIST: TriggerItem[] = [
  {
    id: "react",
    label: "React",
    icon: <Zap size={14} className="text-cyan-500 dark:text-cyan-400" />,
    description: "Framework"
  },
  {
    id: "summary",
    label: "Summary",
    icon: <FileCode size={14} className="text-orange-500 dark:text-orange-400" />,
    description: "Summarize"
  },
  {
    id: "bugfix",
    label: "BugFix",
    icon: <Wrench size={14} className="text-red-500 dark:text-red-400" />,
    description: "Debug"
  }
];

const SUGGESTION_CHIPS = [
  { label: "Create Image", icon: <ImageIcon size={16} className="text-yellow-500" />, action: "image" },
  { label: "Write", icon: <PenTool size={16} className="text-purple-500" />, action: "write" },
  { label: "Build", icon: <Hammer size={16} className="text-blue-500" />, action: "code" },
  { label: "Deep Research", icon: <Globe size={16} className="text-green-500" />, action: "research" },
  { label: "Create Video", icon: <Video size={16} className="text-red-500" />, action: "video" },
  { label: "Learn", icon: <BookOpen size={16} className="text-orange-500" />, action: "learn" }
];

const ChatMain: React.FC = () => {
  const {
    messages: rawMessages,
    setMessages,
    settings,
    setSettings,
    sessions: rawSessions,
    setSessions,
    currentSessionId,
    setCurrentSessionId
  } = useLLMStore();

  const messages = useMemo(() => (Array.isArray(rawMessages) ? rawMessages : []), [rawMessages]);
  const sessions = useMemo(() => (Array.isArray(rawSessions) ? rawSessions : []), [rawSessions]);

  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [isInputExpanded, setIsInputExpanded] = useState(false);
  const [triggerType, setTriggerType] = useState<"@" | "#" | null>(null);
  const [triggerQuery, setTriggerQuery] = useState("");
  const [isModelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [isPlusMenuOpen, setPlusMenuOpen] = useState(false);
  const [isToolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [showCanvasBadge, setShowCanvasBadge] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [artifactOpen, setArtifactOpen] = useState(false);
  const [artifactContent, setArtifactContent] = useState<string>("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const streamClientRef = useRef<StreamClient | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const plusMenuRef = useRef<HTMLDivElement>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  const isHome = messages.length === 0;

  const availableModels = useMemo(() => {
    const base = [
      {
        id: "fast",
        name: "Fast",
        description: "Answers quickly",
        icon: <Zap size={16} className="text-yellow-500 dark:text-yellow-400" />
      }
    ];
    if (settings.enableThinking) {
      base.push({
        id: "thinking",
        name: "Thinking with 3 Pro",
        description: "Deep reasoning capabilities",
        icon: <Sparkles size={16} className="text-blue-500 dark:text-blue-400" />
      });
    }
    return base;
  }, [settings.enableThinking]);

  const [selectedModel, setSelectedModel] = useState(availableModels[0]);

  useEffect(() => {
    if (!settings.enableThinking && selectedModel.id === "thinking") {
      setSelectedModel(availableModels[0]);
    }
  }, [settings.enableThinking, availableModels, selectedModel.id]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
  }, [settings.theme]);

  useEffect(() => {
    if (messages.length > 0) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isGenerating]);

  // Handle outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setModelDropdownOpen(false);
      if (plusMenuRef.current && !plusMenuRef.current.contains(event.target as Node)) setPlusMenuOpen(false);
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) setToolsMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setInput(newVal);
    const cursorIndex = e.target.selectionStart;
    const textBeforeCursor = newVal.slice(0, cursorIndex);
    const match = textBeforeCursor.match(/([@#])([\w\u4e00-\u9fa5]*)$/);
    if (match) {
      setTriggerType(match[1] as "@" | "#");
      setTriggerQuery(match[2]);
    } else {
      setTriggerType(null);
      setTriggerQuery("");
    }
  };

  const handleTriggerSelect = (item: TriggerItem) => {
    if (!triggerType) return;
    const cursorIndex = inputRef.current?.selectionStart || 0;
    const textBeforeCursor = input.slice(0, cursorIndex);
    const triggerIndex = textBeforeCursor.lastIndexOf(triggerType);
    const beforeTrigger = input.slice(0, triggerIndex);
    const afterTrigger = input.slice(cursorIndex);
    const newText = `${beforeTrigger}${triggerType}${item.label} ${afterTrigger}`;
    setInput(newText);
    setTriggerType(null);
    setTriggerQuery("");
    inputRef.current?.focus();
  };

  const getFilteredTriggers = () => {
    const list = triggerType === "@" ? MENTIONS_LIST : TAGS_LIST;
    return list.filter((item) => item.label.toLowerCase().includes(triggerQuery.toLowerCase()));
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setInput("");
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const type = file.type.startsWith("image/") ? "image" : "file";
      const previewUrl = URL.createObjectURL(file);
      setAttachments((prev) => [...prev, { id: Date.now().toString(), file, previewUrl, type }]);
      setPlusMenuOpen(false);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleEditMessage = (msgId: string, newContent: string) => {
    const msgIndex = messages.findIndex((m) => m.id === msgId);
    if (msgIndex === -1) return;
    const updatedMessages = messages.slice(0, msgIndex);
    setMessages(updatedMessages);
    setInput(newContent);
    handleSend(newContent);
  };

  const handleSend = async (txt?: string) => {
    const textToSend = txt || input;
    if ((!textToSend.trim() && attachments.length === 0) || isGenerating) return;

    if (!streamClientRef.current) streamClientRef.current = new StreamClient(settings.protocol);

    setTriggerType(null);
    setIsInputExpanded(false);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: Date.now(),
      attachments: [...attachments]
    };
    setAttachments([]);
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsGenerating(true);

    // Update sessions
    if (!currentSessionId) {
      const newSessionId = Date.now().toString();
      setCurrentSessionId(newSessionId);
      setSessions([
        { id: newSessionId, title: textToSend.slice(0, 30) || "New Chat", messages: newMessages, date: "Today" },
        ...sessions
      ]);
    } else {
      setSessions(sessions.map((s) => (s.id === currentSessionId ? { ...s, messages: newMessages } : s)));
    }

    const aiMsgId = (Date.now() + 1).toString();
    const isThinkingModel = selectedModel.id === "thinking";

    const aiMsg: Message = {
      id: aiMsgId,
      role: "model",
      content: "",
      timestamp: Date.now(),
      isStreaming: true,
      isThinking: isThinkingModel,
      modelUsed: selectedModel.name
    };

    setMessages([...newMessages, aiMsg]);

    const request: StreamRequest = {
      modelId: selectedModel.name,
      messages: [...newMessages, userMsg],
      config: { useThinking: isThinkingModel }
    };

    const callbacks: StreamCallbacks = {
      onThinking: (token: string) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, thoughtProcess: (m.thoughtProcess || "") + token } : m))
        );
      },
      onContent: (token: string) => {
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, content: m.content + token, isThinking: false } : m))
        );
      },
      onEnd: () => {
        setMessages((prev) => prev.map((m) => (m.id === aiMsgId ? { ...m, isStreaming: false } : m)));
        setIsGenerating(false);
      },
      onError: (err: Error) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId ? { ...m, content: m.content + `\n[Error: ${err.message}]`, isStreaming: false } : m
          )
        );
        setIsGenerating(false);
      }
    };

    streamClientRef.current.stream(request, callbacks);
  };

  return (
    <div
      className={`flex h-screen w-full font-sans overflow-hidden bg-white dark:bg-[#131314] text-gray-900 dark:text-gray-100 selection:bg-blue-500/30 ${settings.denseMode ? "text-sm" : ""}`}
    >
      <SidebarMain
        isOpen={isSidebarOpen}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={handleNewChat}
        onSelect={(id) => {
          setCurrentSessionId(id);
          const session = sessions.find((s) => s.id === id);
          if (session) setMessages(session.messages);
          if (window.innerWidth < 768) setSidebarOpen(false);
        }}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div className="flex-1 flex h-full relative overflow-hidden transition-all duration-300">
        <main
          className={`flex-1 flex flex-col h-full relative transition-all duration-300 ${artifactOpen ? "mr-[400px] md:mr-[500px]" : ""} bg-white dark:bg-[#131314]`}
        >
          <header className="absolute top-0 left-0 w-full p-4 z-20 flex justify-between items-center bg-gradient-to-b from-white dark:from-[#131314] to-transparent pointer-events-none">
            <div className="pointer-events-auto flex items-center">
              {!isSidebarOpen && (
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#28292a] text-gray-500 dark:text-gray-400 transition-colors"
                >
                  <Menu size={20} />
                </button>
              )}
              <span
                className={`text-lg font-medium text-gray-700 dark:text-gray-200 ml-2 ${isSidebarOpen ? "opacity-0" : "opacity-100 transition-opacity"}`}
              >
                Gemini
              </span>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto custom-scrollbar relative">
            {isHome ? (
              <div className="flex flex-col items-center justify-center h-full px-4 pb-32 animate-fade-in">
                <div className="mb-10 text-center">
                  <h1 className="text-5xl md:text-6xl font-medium text-transparent bg-clip-text bg-gradient-to-br from-blue-500 via-purple-500 to-red-500 mb-4 tracking-tight">
                    Hello, Human
                  </h1>
                  <h2 className="text-4xl md:text-5xl font-medium text-[#444746] dark:text-[#5e5f61]">
                    How can I help you today?
                  </h2>
                </div>
                <div className="w-full h-32 md:h-40 pointer-events-none"></div>
                <div className="flex flex-wrap justify-center gap-3 mt-8 max-w-4xl">
                  {SUGGESTION_CHIPS.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => setInput(chip.label)}
                      className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-[#1e1f20] hover:bg-gray-200 dark:hover:bg-[#2d2e30] rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 transition-all border border-transparent hover:border-gray-300 dark:hover:border-gray-600"
                    >
                      <span className="p-1 rounded-full bg-white dark:bg-black/20">{chip.icon}</span>
                      <span>{chip.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col px-4 pt-20 pb-40 min-h-full justify-end">
                {messages.map((msg) => (
                  <div key={msg.id} className={settings.denseMode ? "gap-2 py-2" : "gap-6 py-6"}>
                    <MessageItem
                      msg={msg}
                      onEdit={handleEditMessage}
                      onRegenerate={() => handleSend(messages[messages.length - 2]?.content)}
                      onOpenCanvas={(code) => {
                        setArtifactContent(code);
                        setArtifactOpen(true);
                      }}
                    />
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          <div
            className={`
                transition-all duration-500 ease-in-out z-20 
                ${
                  isInputExpanded
                    ? "fixed inset-0 bg-white dark:bg-[#131314] flex flex-col p-4"
                    : `absolute left-0 w-full px-4 ${isHome ? "top-[50%] -translate-y-1/2" : "bottom-0 pb-6 pt-10 bg-gradient-to-t from-white dark:from-[#131314] via-white dark:via-[#131314] to-transparent pointer-events-none"}`
                }
            `}
          >
            <div
              className={`pointer-events-auto mx-auto relative group flex flex-col ${isInputExpanded ? "h-full" : ""} ${settings.denseMode ? "max-w-4xl" : "max-w-3xl"}`}
            >
              {isInputExpanded && (
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-medium">Edit Message</span>
                  <button
                    onClick={() => setIsInputExpanded(false)}
                    className="p-2 hover:bg-gray-200 dark:hover:bg-[#3c4043] rounded-full"
                  >
                    <Minimize2 size={20} />
                  </button>
                </div>
              )}

              {triggerType && (
                <div className="absolute bottom-full left-4 mb-2 w-64 bg-white dark:bg-[#252627] border border-gray-200 dark:border-[#3c4043] rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-0.5 animate-scale-up overflow-hidden">
                  <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-200 dark:border-[#3c4043]/50 flex items-center gap-2">
                    {triggerType === "@" ? <AtSign size={12} /> : <Hash size={12} />}
                    <span>{triggerType === "@" ? "Mention" : "Tag"}</span>
                  </div>
                  <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
                    {getFilteredTriggers().map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleTriggerSelect(item)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-700 dark:text-gray-300 text-sm transition-colors text-left"
                      >
                        <div className="shrink-0">{item.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 dark:text-gray-200">{item.label}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div
                className={`bg-[#f0f4f9] dark:bg-[#1e1f20] rounded-[28px] border border-gray-200 dark:border-[#3c4043] shadow-lg flex flex-col transition-colors focus-within:bg-white dark:focus-within:bg-[#252627] focus-within:border-gray-300 dark:focus-within:border-[#5e5f61] ${isInputExpanded ? "flex-1" : ""}`}
              >
                {attachments.length > 0 && (
                  <div className="flex gap-3 px-4 pt-3 overflow-x-auto">
                    {attachments.map((att) => (
                      <div key={att.id} className="relative group/preview">
                        <div className="h-16 w-16 rounded-lg overflow-hidden border border-gray-300 dark:border-[#3c4043] flex items-center justify-center bg-gray-100 dark:bg-[#1e1f20]">
                          {att.type === "image" ? (
                            <img src={att.previewUrl} className="h-full w-full object-cover" />
                          ) : (
                            <FileText size={24} className="text-gray-500" />
                          )}
                        </div>
                        <button
                          onClick={() => removeAttachment(att.id)}
                          className="absolute -top-1 -right-1 bg-gray-800 text-white rounded-full p-0.5 shadow-md opacity-0 group-hover/preview:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className={`flex items-start w-full px-4 ${isInputExpanded ? "flex-1 py-4" : settings.denseMode ? "py-2 min-h-[48px]" : "py-3 min-h-[56px]"}`}
                >
                  {settings.denseMode && showCanvasBadge && !isInputExpanded && (
                    <div className="shrink-0 flex items-center gap-1 bg-[#dde3ea] dark:bg-[#28292a] border border-gray-300 dark:border-[#3c4043] rounded-lg px-2 py-1 mr-2 mt-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#333]">
                      <Maximize2 size={12} className="text-gray-500 dark:text-gray-400" />
                      <span className="text-xs text-gray-600 dark:text-gray-300">Canvas</span>
                      <button
                        onClick={() => setShowCanvasBadge(false)}
                        className="ml-1 hover:text-black dark:hover:text-white text-gray-400 dark:text-gray-500"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  )}
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && !triggerType) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask Gemini..."
                    className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-[#e3e3e3] placeholder-gray-500 text-base resize-none custom-scrollbar h-full"
                    style={{
                      minHeight: isInputExpanded ? "100%" : "24px",
                      maxHeight: isInputExpanded ? "none" : "200px"
                    }}
                  />
                  {!isInputExpanded && (
                    <button
                      onClick={() => setIsInputExpanded(true)}
                      className="ml-2 mt-1 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                      title="Full screen edit"
                    >
                      <Maximize2 size={14} />
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between px-4 pb-3 pt-1">
                  <div className="flex items-center gap-2">
                    <div className="relative" ref={plusMenuRef}>
                      <button
                        onClick={() => setPlusMenuOpen(!isPlusMenuOpen)}
                        className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3c4043] hover:text-gray-900 dark:hover:text-white rounded-full transition-all"
                      >
                        <Plus size={18} />
                      </button>
                      {isPlusMenuOpen && (
                        <div className="absolute bottom-14 left-0 w-60 bg-white dark:bg-[#252627] border border-gray-200 dark:border-[#3c4043] rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 animate-scale-up">
                          <label className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-700 dark:text-gray-300 text-sm transition-colors cursor-pointer">
                            <input type="file" className="hidden" onChange={handleFileUpload} ref={fileInputRef} />
                            <span className="text-gray-500 dark:text-gray-400">
                              <HardDrive size={18} />
                            </span>
                            <span>Upload files</span>
                          </label>
                          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-700 dark:text-gray-300 text-sm transition-colors text-left">
                            <span className="text-gray-500 dark:text-gray-400">
                              <Layout size={18} />
                            </span>
                            <span>Add from Drive</span>
                          </button>
                          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-700 dark:text-gray-300 text-sm transition-colors text-left">
                            <span className="text-gray-500 dark:text-gray-400">
                              <ImageIcon size={18} />
                            </span>
                            <span>Photos</span>
                          </button>
                          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-700 dark:text-gray-300 text-sm transition-colors text-left">
                            <span className="text-gray-500 dark:text-gray-400">
                              <FileCode size={18} />
                            </span>
                            <span>Import code</span>
                          </button>
                        </div>
                      )}
                    </div>
                    {settings.enableTools && (
                      <div className="relative" ref={toolsMenuRef}>
                        <button
                          onClick={() => setToolsMenuOpen(!isToolsMenuOpen)}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${isToolsMenuOpen ? "bg-gray-200 dark:bg-[#3c4043] text-black dark:text-white" : "bg-[#dde3ea] dark:bg-[#28292a] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3c4043] hover:text-black dark:hover:text-white"}`}
                        >
                          <Wrench size={14} />
                          <span>Tools</span>
                        </button>
                        {isToolsMenuOpen && (
                          <div className="absolute bottom-14 left-0 w-64 bg-white dark:bg-[#252627] border border-gray-200 dark:border-[#3c4043] rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 animate-scale-up">
                            {[
                              { icon: <Globe size={16} />, label: "Deep Research" },
                              { icon: <Video size={16} />, label: "Create videos" }
                            ].map((item, idx) => (
                              <button
                                key={idx}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-700 dark:text-gray-300 text-sm transition-colors text-left"
                              >
                                <span className="text-gray-500 dark:text-gray-400">{item.icon}</span>
                                <span>{item.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setModelDropdownOpen(!isModelDropdownOpen)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${selectedModel.id === "thinking" ? "bg-[#e8f0fe] dark:bg-[#18232c] border-blue-200 dark:border-[#294254] text-blue-700 dark:text-[#a8c7fa]" : "bg-[#dde3ea] dark:bg-[#28292a] border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3c4043]"}`}
                      >
                        {selectedModel.icon}
                        <span>{selectedModel.name}</span>
                        <ChevronDown size={12} className="opacity-70" />
                      </button>
                      {isModelDropdownOpen && (
                        <div className="absolute bottom-12 right-0 w-72 bg-white dark:bg-[#252627] border border-gray-200 dark:border-[#3c4043] rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 animate-scale-up origin-bottom-right">
                          <div className="px-3 py-2 text-xs font-medium text-gray-500">Choose your model</div>
                          {availableModels.map((model) => (
                            <button
                              key={model.id}
                              onClick={() => {
                                setSelectedModel(model);
                                setModelDropdownOpen(false);
                              }}
                              className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#3c4043] transition-colors text-left group/item"
                            >
                              <div className="mt-1">{model.icon}</div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span
                                    className={`text-sm font-medium ${selectedModel.id === model.id ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}
                                  >
                                    {model.name}
                                  </span>
                                  {selectedModel.id === model.id && (
                                    <Check size={14} className="text-blue-500 dark:text-blue-400" />
                                  )}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">{model.description}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => setIsListening(!isListening)}
                      className={`p-2 rounded-full transition-colors ${isListening ? "bg-red-500 text-white animate-pulse" : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3c4043]"}`}
                    >
                      {isListening ? (
                        <div className="flex gap-0.5 items-center justify-center h-5 w-5">
                          <span className="w-1 h-3 bg-white animate-wave"></span>
                          <span className="w-1 h-5 bg-white animate-wave delay-75"></span>
                          <span className="w-1 h-3 bg-white animate-wave delay-150"></span>
                        </div>
                      ) : (
                        <Mic size={20} />
                      )}
                    </button>
                    <button
                      onClick={() => handleSend()}
                      className={`p-2 rounded-full transition-colors ${input.trim() || attachments.length ? "bg-blue-600 dark:bg-[#a8c7fa] text-white dark:text-[#0b1219] hover:bg-blue-700 dark:hover:bg-white" : "bg-[#dde3ea] dark:bg-[#3c4043] text-gray-400 dark:text-gray-500 cursor-not-allowed"}`}
                    >
                      <Send size={18} className="ml-0.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {artifactOpen && (
          <div className="absolute right-0 top-0 h-full w-[400px] md:w-[500px] bg-gray-50 dark:bg-[#1e1f20] border-l border-gray-200 dark:border-[#3c4043] shadow-2xl z-40 flex flex-col animate-slide-left">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#3c4043]">
              <div className="flex items-center gap-2">
                <Code size={18} className="text-blue-500" />
                <span className="font-medium text-sm">Artifact Code</span>
              </div>
              <button
                onClick={() => setArtifactOpen(false)}
                className="p-2 hover:bg-gray-200 dark:hover:bg-[#3c4043] rounded-full"
              >
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4 custom-scrollbar">
              <pre className="text-xs font-mono text-gray-800 dark:text-gray-300 whitespace-pre-wrap">
                {artifactContent}
              </pre>
            </div>
            <div className="p-4 border-t border-gray-200 dark:border-[#3c4043] bg-white dark:bg-[#252627]">
              <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Play size={16} /> Run Code
              </button>
            </div>
          </div>
        )}
      </div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        updateSettings={(k, v) => setSettings({ ...settings, [k]: v })}
      />
    </div>
  );
};

export default ChatMain;
