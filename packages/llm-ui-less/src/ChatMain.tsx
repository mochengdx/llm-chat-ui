import {
  CodeOutlined,
  EditOutlined,
  ExperimentOutlined,
  FileMarkdownOutlined,
  FileTextOutlined,
  GlobalOutlined,
  MenuOutlined,
  PictureOutlined,
  ReadOutlined,
  ThunderboltOutlined,
  ToolOutlined,
  UserOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";
import type { Attachment, Message, StreamAdapter, StreamRequest, TriggerItem } from "@llm/core";
import { StreamClient } from "@llm/core";
import { useLLMStore } from "@llm/store";
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "./ChatMain.module.less";
import ArtifactPanel from "./components/artifact/ArtifactPanel";
import MessageItem from "./components/chat/MessageItem";
import type { ChatExtensions } from "./components/chat/renderers/types";
import InputConsole from "./components/input/InputConsole";
import SidebarMain from "./components/layout/Sidebar";
import SettingsModal from "./components/settings/SettingsModal";
import { useLLMStream } from "./hooks/useLLMStream";
import { useTranslation } from "./hooks/useTranslation";

/* eslint-disable react-hooks/purity */

export interface ChatHooks {
  /**
   * Hook called before sending a message.
   * 发送消息前调用的钩子。
   *
   * Can be used to modify the message or filter it (by returning empty string).
   * 可用于修改消息或过滤消息（通过返回空字符串）。
   *
   * Supports async operations.
   * 支持异步操作。
   */
  onBeforeSend?: (message: string) => Promise<string> | string;

  /**
   * Hook called when receiving a stream chunk.
   * 接收到流分块时调用的钩子。
   *
   * Can be used to transform the incoming text chunk.
   * 可用于转换传入的文本分块。
   */
  onStreamTransform?: (chunk: string) => string;

  /**
   * Custom StreamAdapter implementation.
   * 自定义 StreamAdapter 实现。
   *
   * If provided, it will be used instead of the internal adapters.
   * 如果提供，将代替内部适配器使用。
   */
  customAdapter?: StreamAdapter;

  /**
   * Custom file upload handler.
   * 自定义文件上传处理程序。
   *
   * If provided, it will be used to handle file uploads.
   * 如果提供，将用于处理文件上传。
   */
  onFileUpload?: (file: File) => Promise<Attachment>;

  /**
   * Custom extensions for the chat interface.
   * 聊天界面的自定义扩展。
   *
   * Allows injecting custom renderers for code blocks and markdown directives.
   * 允许注入用于代码块和 Markdown 指令的自定义渲染器。
   */
  extensions?: ChatExtensions;

  /**
   * Custom triggers for the chat interface.
   * 聊天界面的自定义触发器。
   *
   * Allows injecting custom triggers for @ mentions and # tags.
   * 允许注入用于 @ 提及和 # 标签的自定义触发器。
   */
  triggers?: {
    mentions?: TriggerItem[];
    tags?: TriggerItem[];
  };
}

type ChatMainProps = ChatHooks;

interface HistoryMessagesProps {
  messages: Message[];
  denseMode: boolean;
  onEdit: (msgId: string, newContent: string) => void;
  onRegenerate: (modelMsgId: string) => void;
  onOpenCanvas: (code: string) => void;
  extensions?: ChatExtensions;
  t: any;
  onSendFromDirective?: (message: string) => void;
}

const HistoryMessages = memo(
  ({
    messages,
    denseMode,
    onEdit,
    onRegenerate,
    onOpenCanvas,
    extensions,
    t,
    onSendFromDirective
  }: HistoryMessagesProps) => {
    return (
      <>
        {messages.map((msg) => (
          <div key={msg.id} className={denseMode ? styles.messageWrapperDense : styles.messageWrapper}>
            <MessageItem
              msg={msg}
              onEdit={onEdit}
              onRegenerate={() => onRegenerate(msg.id)}
              onOpenCanvas={onOpenCanvas}
              extensions={extensions}
              t={t}
              onSend={onSendFromDirective}
            />
          </div>
        ))}
      </>
    );
  }
);

HistoryMessages.displayName = "HistoryMessages";

interface ActiveMessageProps {
  msg: Message | null;
  denseMode: boolean;
  onEdit: (msgId: string, newContent: string) => void;
  onRegenerate: (modelMsgId: string) => void;
  onOpenCanvas: (code: string) => void;
  extensions?: ChatExtensions;
  t: any;
  onSendFromDirective?: (message: string) => void;
}

const ActiveMessage = memo(
  ({ msg, denseMode, onEdit, onRegenerate, onOpenCanvas, extensions, t, onSendFromDirective }: ActiveMessageProps) => {
    if (!msg) return null;
    return (
      <div key={msg.id} className={denseMode ? styles.messageWrapperDense : styles.messageWrapper}>
        <MessageItem
          msg={msg}
          onEdit={onEdit}
          onRegenerate={() => onRegenerate(msg.id)}
          onOpenCanvas={onOpenCanvas}
          extensions={extensions}
          t={t}
          onSend={onSendFromDirective}
        />
      </div>
    );
  }
);

ActiveMessage.displayName = "ActiveMessage";

const DEFAULT_MENTIONS_LIST: TriggerItem[] = [
  {
    id: "simple-llm-chat",
    label: "Smart LLM Chat",
    icon: <ExperimentOutlined style={{ fontSize: 14, color: "#3b82f6" }} />,
    description: "Default Model"
  },
  {
    id: "docs",
    label: "Google Docs",
    icon: <FileTextOutlined style={{ fontSize: 14, color: "#2563eb" }} />,
    description: "Search documents"
  },
  {
    id: "python",
    label: "Python",
    icon: <CodeOutlined style={{ fontSize: 14, color: "#ca8a04" }} />,
    description: "Query User Profile"
  }
];

const DEFAULT_TAGS_LIST: TriggerItem[] = [
  {
    id: "gen-user-profile",
    label: "Generate User Profile",
    icon: <UserOutlined style={{ fontSize: 14, color: "#a855f7" }} />,
    description: "Ask AI to generate a user profile",
    prompt:
      'Please generate a user profile for a fictional character. Return the result using the ::user-profile directive format: ::user-profile[Bio]{name="..." role="..." avatar="..."}.'
  },
  {
    id: "gen-image-plus",
    label: "Generate Image Card",
    icon: <PictureOutlined style={{ fontSize: 14, color: "#eab308" }} />,
    description: "Ask AI to generate an image card",
    prompt:
      'Please generate an image card for a tech concept. Return the result using the ::image-plus directive format: ::image-plus[Description]{src="..." name="..." info="..." link="..."}.'
  },
  {
    id: "gen-data-list",
    label: "Generate Data List",
    icon: <FileMarkdownOutlined style={{ fontSize: 14, color: "#3b82f6" }} />,
    description: "Ask AI to generate a data list",
    prompt:
      'Please generate a status list for a project. Return the result using the ::data-list directive format: ::data-list[Title]{data="[... ]"}.'
  },
  {
    id: "confirm-demo",
    label: "Confirm Button Demo",
    icon: <ThunderboltOutlined style={{ fontSize: 14, color: "#ef4444" }} />,
    description: "Demo of interactive confirm button",
    prompt:
      'Please show me a confirmation button. Return the result using the ::confirm-button directive format: ::confirm-button[Click to Confirm]{message="I have confirmed the action"}.'
  }
];

const ChatMain: React.FC<ChatMainProps> = ({
  onBeforeSend,
  onStreamTransform,
  customAdapter,
  onFileUpload,
  extensions,
  triggers
}) => {
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

  const { t } = useTranslation(settings);

  const SUGGESTION_CHIPS = [
    {
      label: t.chat.chips?.createImage || "Create Image",
      icon: <PictureOutlined style={{ fontSize: 16, color: "#eab308" }} />,
      action: "image"
    },
    {
      label: t.chat.chips?.write || "Write",
      icon: <EditOutlined style={{ fontSize: 16, color: "#a855f7" }} />,
      action: "write"
    },
    {
      label: t.chat.chips?.build || "Build",
      icon: <ToolOutlined style={{ fontSize: 16, color: "#3b82f6" }} />,
      action: "code"
    },
    {
      label: t.chat.chips?.deepResearch || "Deep Research",
      icon: <GlobalOutlined style={{ fontSize: 16, color: "#22c55e" }} />,
      action: "research"
    },
    {
      label: t.chat.chips?.createVideo || "Create Video",
      icon: <VideoCameraOutlined style={{ fontSize: 16, color: "#ef4444" }} />,
      action: "video"
    },
    {
      label: t.chat.chips?.learn || "Learn",
      icon: <ReadOutlined style={{ fontSize: 16, color: "#f97316" }} />,
      action: "learn"
    }
  ];

  const mentionsList = useMemo(() => [...DEFAULT_MENTIONS_LIST, ...(triggers?.mentions || [])], [triggers?.mentions]);
  const tagsList = useMemo(() => [...DEFAULT_TAGS_LIST, ...(triggers?.tags || [])], [triggers?.tags]);

  const [input, setInput] = useState("");
  const [activeTags, setActiveTags] = useState<TriggerItem[]>([]);
  // const [isGenerating, setIsGenerating] = useState(false); // Replaced by useLLMStream
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
  const [activeMessage, setActiveMessage] = useState<Message | null>(null);

  const pendingActiveContentRef = useRef<string[]>([]);
  const pendingActiveReasoningRef = useRef<string[]>([]);
  const activeFlushRafRef = useRef<number | null>(null);
  const activeFlushScheduledRef = useRef(false);
  const activeMsgIdRef = useRef<string | null>(null);
  const activeStopThinkingRef = useRef(false);
  const messagesRef = useRef<Message[]>(messages);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  // const streamClientRef = useRef<StreamClient | null>(null); // Replaced by useLLMStream
  const streamClient = useMemo(
    () => new StreamClient(customAdapter || settings.protocol),
    [customAdapter, settings.protocol]
  );
  const { isStreaming, trigger, stop: stopStream } = useLLMStream({ streamClient });

  const cancelActiveFlush = useCallback(() => {
    if (activeFlushRafRef.current != null) {
      cancelAnimationFrame(activeFlushRafRef.current);
      activeFlushRafRef.current = null;
    }
    activeFlushScheduledRef.current = false;
  }, []);

  const flushActiveSync = useCallback(() => {
    cancelActiveFlush();
    if (pendingActiveContentRef.current.length === 0 && pendingActiveReasoningRef.current.length === 0) return;

    const contentDelta = pendingActiveContentRef.current.join("");
    const reasoningDelta = pendingActiveReasoningRef.current.join("");
    pendingActiveContentRef.current = [];
    pendingActiveReasoningRef.current = [];

    setActiveMessage((prev) => {
      if (!prev) return prev;
      if (activeMsgIdRef.current && prev.id !== activeMsgIdRef.current) return prev;
      return {
        ...prev,
        content: contentDelta ? prev.content + contentDelta : prev.content,
        thoughtProcess: reasoningDelta ? (prev.thoughtProcess || "") + reasoningDelta : prev.thoughtProcess,
        isThinking: activeStopThinkingRef.current ? false : prev.isThinking
      };
    });

    activeStopThinkingRef.current = false;
  }, [cancelActiveFlush]);

  const scheduleActiveFlush = useCallback(() => {
    if (activeFlushScheduledRef.current) return;
    activeFlushScheduledRef.current = true;
    activeFlushRafRef.current = requestAnimationFrame(() => {
      activeFlushScheduledRef.current = false;
      activeFlushRafRef.current = null;
      flushActiveSync();
    });
  }, [flushActiveSync]);

  const finalizeActiveToHistory = useCallback(
    (finalPatch?: Partial<Message>) => {
      flushActiveSync();
      setActiveMessage((prev) => {
        if (!prev) return null;

        const finalMsg: Message = {
          ...prev,
          ...finalPatch,
          isStreaming: false
        };

        setMessages((history) => {
          const nextHistory = [...history, finalMsg];

          // Keep sessions in sync, but avoid per-token updates.
          if (currentSessionId) {
            setSessions((ss) => ss.map((s) => (s.id === currentSessionId ? { ...s, messages: nextHistory } : s)));
          }

          return nextHistory;
        });

        activeMsgIdRef.current = null;
        return null;
      });
    },
    [flushActiveSync, setMessages, setSessions, currentSessionId]
  );

  const stop = useCallback(() => {
    stopStream();
    // Stop should force a synchronous flush, then finalize the active message.
    finalizeActiveToHistory({ isThinking: false });
  }, [stopStream, finalizeActiveToHistory]);

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
        icon: <ThunderboltOutlined style={{ fontSize: 16, color: "#eab308" }} />
      }
    ];
    if (settings.enableThinking) {
      base.push({
        id: "thinking",
        name: "Thinking with 3 Pro",
        description: "Deep reasoning capabilities",
        icon: <ExperimentOutlined style={{ fontSize: 16, color: "#3b82f6" }} />
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

  // Reset streaming status on mount (in case of page refresh during generation)
  useEffect(() => {
    const hasStreamingMessage = messages.some((m) => m.isStreaming);
    if (hasStreamingMessage) {
      setMessages((prev) => prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (messages.length > 0 || activeMessage) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isStreaming, activeMessage?.content, activeMessage?.thoughtProcess]);

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

  /**
   * Handles input changes to detect trigger characters (@ or #).
   * 处理输入变化以检测触发字符（@ 或 #）。
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newVal = e.target.value;
    setInput(newVal);
    const cursorIndex = e.target.selectionStart;
    const textBeforeCursor = newVal.slice(0, cursorIndex);

    // Match @ or # preceded by start of line or whitespace
    // 匹配行首或空白字符后的 @ 或 #
    const match = textBeforeCursor.match(/(?:^|\s)([@#])([\w\u4e00-\u9fa5]*)$/);

    if (match) {
      setTriggerType(match[1] as "@" | "#");
      setTriggerQuery(match[2]);
    } else {
      setTriggerType(null);
      setTriggerQuery("");
    }
  };

  /**
   * Handles the selection of a trigger item (mention or tag).
   * 处理触发项（提及或标签）的选择。
   */
  const handleTriggerSelect = (item: TriggerItem) => {
    if (!triggerType) return;
    const cursorIndex = inputRef.current?.selectionStart || 0;
    const textBeforeCursor = input.slice(0, cursorIndex);

    // Find the last occurrence of the trigger that matches our current query context
    // 查找与当前查询上下文匹配的最后一个触发器出现位置
    const match = textBeforeCursor.match(new RegExp(`(?:^|\\s)${triggerType}${triggerQuery}$`));

    if (!match) return;

    // Calculate where the trigger actually starts (accounting for the potential space)
    // 计算触发器的实际起始位置（考虑可能的空格）
    const matchLength = match[0].length;
    const triggerStartIndex = cursorIndex - matchLength + (match[0].startsWith(" ") ? 1 : 0);

    const beforeTrigger = input.slice(0, triggerStartIndex);
    const afterTrigger = input.slice(cursorIndex);

    // Treat as tag if it's a # tag OR if it's a mention that has a prompt (Capability)
    // 如果是 # 标签或者是有 prompt 的提及（能力），则作为标签处理
    const isTagBehavior = triggerType === "#" || !!item.prompt;

    if (isTagBehavior) {
      // For tags/capabilities, add to activeTags list instead of inserting text (Capsule UI)
      // 对于标签/能力，添加到 activeTags 列表而不是插入文本（胶囊 UI）
      if (!activeTags.find((t) => t.id === item.id)) {
        setActiveTags((prev) => [...prev, item]);
      }
      // Remove the trigger text from input
      // 从输入中移除触发文本
      const newText = `${beforeTrigger}${afterTrigger}`;
      setInput(newText);
      setTriggerType(null);
      setTriggerQuery("");

      // Reset cursor position
      // 重置光标位置
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.selectionStart = triggerStartIndex;
          inputRef.current.selectionEnd = triggerStartIndex;
          inputRef.current.focus();
        }
      }, 0);
    } else {
      // For @ mentions, insert text as before
      // 对于 @ 提及，像以前一样插入文本
      const insertText = `${triggerType}${item.label} `;
      const newText = `${beforeTrigger}${insertText}${afterTrigger}`;
      setInput(newText);
      setTriggerType(null);
      setTriggerQuery("");

      // Reset cursor position after the inserted text
      // 在插入文本后重置光标位置
      setTimeout(() => {
        if (inputRef.current) {
          const newCursorPos = triggerStartIndex + insertText.length;
          inputRef.current.selectionStart = newCursorPos;
          inputRef.current.selectionEnd = newCursorPos;
          inputRef.current.focus();
        }
      }, 0);
    }
  };

  const getFilteredTriggers = () => {
    const list = triggerType === "@" ? mentionsList : tagsList;
    return list.filter((item) => item.label.toLowerCase().includes(triggerQuery.toLowerCase()));
  };

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([]);
    setActiveMessage(null);
    setInput("");
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const handleDeleteSession = useCallback(
    (id: string) => {
      // If deleting the currently open session, stop streaming and reset UI state.
      if (currentSessionId === id) {
        stopStream();
        setCurrentSessionId(null);
        setMessages([]);
        setActiveMessage(null);
        setInput("");
      }
      setSessions((prev) => prev.filter((s) => s.id !== id));
    },
    [currentSessionId, setSessions, setMessages, setCurrentSessionId, stopStream]
  );

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (onFileUpload) {
        onFileUpload(file);
      } else {
        const type = file.type.startsWith("image/") ? "image" : "file";
        const previewUrl = URL.createObjectURL(file);
        setAttachments((prev) => [...prev, { id: Date.now().toString(), file, previewUrl, type }]);
      }
      setPlusMenuOpen(false);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const removeTag = (id: string) => {
    setActiveTags((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOpenCanvas = useCallback((code: string) => {
    setArtifactContent(code);
    setArtifactOpen(true);
  }, []);

  /**
   * Handles sending a message.
   * 处理发送消息。
   *
   * @param txt - Optional text to send (overrides input state) / 可选的发送文本（覆盖输入状态）
   * @param overrideAttachments - Optional attachments to send / 可选的发送附件
   */
  const handleSend = async (txt?: string, overrideAttachments?: Attachment[]) => {
    let textToSend = txt || input;
    const currentAttachments = overrideAttachments || attachments;

    if ((!textToSend.trim() && currentAttachments.length === 0) || isStreaming) return;

    // Execute onBeforeSend hook if available
    // 如果存在 onBeforeSend 钩子，则执行它
    if (onBeforeSend) {
      try {
        const processed = await onBeforeSend(textToSend);
        if (typeof processed === "string") {
          textToSend = processed;
        }
      } catch (error) {
        console.error("Error in onBeforeSend:", error);
      }
    }

    if (!textToSend.trim() && currentAttachments.length === 0) return;

    setTriggerType(null);
    setIsInputExpanded(false);

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: Date.now(),
      attachments: [...currentAttachments]
    };

    // Clear attachments state only if we didn't use override (which implies a re-send/edit)
    // Actually we should always clear the input attachments state after sending
    // 发送后清除附件和标签状态
    setAttachments([]);
    setActiveTags([]);
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");

    // Update sessions
    // 更新会话列表
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

    // Keep active streaming message out of history to avoid rerendering all MessageItems.
    activeMsgIdRef.current = aiMsgId;
    pendingActiveContentRef.current = [];
    pendingActiveReasoningRef.current = [];
    cancelActiveFlush();
    setActiveMessage(aiMsg);

    // Expand # tags in the message sent to LLM
    // 在发送给 LLM 的消息中展开 # 标签
    let finalPrompt = textToSend;

    // Prepend prompts from active tags (Capsule UI logic)
    // 前置活动标签的提示词（胶囊 UI 逻辑）
    if (activeTags.length > 0) {
      const tagPrompts = activeTags
        .map((tag) => tag.prompt)
        .filter(Boolean)
        .join("\n\n");

      if (tagPrompts) {
        finalPrompt = `${tagPrompts}\n\n${textToSend}`;
      }
    }

    // Legacy support for inline #tags (optional, can be removed if we fully switch to chips)
    // 对内联 #tags 的旧版支持（可选，如果我们完全切换到 chips 可以移除）
    const tagMatch = textToSend.match(/#([\w-]+)\s/);
    if (tagMatch) {
      const tagId = tagMatch[1];
      const tagItem = tagsList.find((t) => t.id === tagId);
      if (tagItem && tagItem.prompt) {
        finalPrompt = textToSend.replace(tagMatch[0], tagItem.prompt + " ");
      }
    }

    const request: StreamRequest = {
      modelId: selectedModel.name,
      messages: [...newMessages.slice(0, -1), { ...userMsg, content: finalPrompt }],
      config: { useThinking: isThinkingModel }
    };

    // Trigger the LLM stream
    // 触发 LLM 流
    trigger(request, {
      onThinking: (token: string) => {
        // Buffer and flush on raf to avoid token-level setState jitter
        pendingActiveReasoningRef.current.push(token);
        scheduleActiveFlush();
      },
      onContent: (token: string) => {
        const processedToken = onStreamTransform ? onStreamTransform(token) : token;
        pendingActiveContentRef.current.push(processedToken);
        // Once we get content, stop thinking indicator (batched)
        activeStopThinkingRef.current = true;
        scheduleActiveFlush();
      },
      onEnd: () => {
        finalizeActiveToHistory({ isThinking: false });
      },
      onError: (err: Error) => {
        pendingActiveContentRef.current.push(`\n[Error: ${err.message}]`);
        finalizeActiveToHistory({ isThinking: false });
      }
    });
  };

  // Keep stable callbacks for message list rendering to avoid rerenders while typing/streaming.
  const handleSendRef = useRef<typeof handleSend>();
  useEffect(() => {
    handleSendRef.current = handleSend;
  }, [handleSend]);

  const onSendFromDirective = useCallback((message: string) => {
    void handleSendRef.current?.(message);
  }, []);

  const handleEditMessageStable = useCallback(
    (msgId: string, newContent: string) => {
      const currentMessages = messagesRef.current;
      const msgIndex = currentMessages.findIndex((m) => m.id === msgId);
      if (msgIndex === -1) return;

      const originalMsg = currentMessages[msgIndex];
      const updatedMessages = currentMessages.slice(0, msgIndex);
      setMessages(updatedMessages);

      if (originalMsg.attachments && originalMsg.attachments.length > 0) {
        setAttachments(originalMsg.attachments);
      }

      setInput(newContent);
      void handleSendRef.current?.(newContent, originalMsg.attachments);
    },
    [setMessages]
  );

  const handleRegenerateStable = useCallback((modelMsgId: string) => {
    const currentMessages = messagesRef.current;
    const idx = currentMessages.findIndex((m) => m.id === modelMsgId);
    const sliceEnd = idx === -1 ? currentMessages.length : idx;
    for (let i = sliceEnd - 1; i >= 0; i--) {
      const m = currentMessages[i];
      if (m.role === "user") {
        void handleSendRef.current?.(m.content, m.attachments);
        return;
      }
    }
  }, []);

  // NOTE: use stable handlers above to avoid rerenders while typing/streaming

  return (
    <div className={`${styles.chatContainer} ${settings.denseMode ? styles.dense : ""}`}>
      <SidebarMain
        isOpen={isSidebarOpen}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onNewChat={handleNewChat}
        onSelect={(id) => {
          setCurrentSessionId(id);
          const session = sessions.find((s) => s.id === id);
          if (session) setMessages(session.messages);
          setActiveMessage(null);
          if (window.innerWidth < 768) setSidebarOpen(false);
        }}
        onDelete={handleDeleteSession}
        onToggle={() => setSidebarOpen(!isSidebarOpen)}
        onOpenSettings={() => setSettingsOpen(true)}
        settings={settings}
      />

      <div className={styles.mainContent}>
        <main className={`${styles.mainContent} ${artifactOpen ? styles.artifactOpen : ""}`}>
          <header className={styles.header}>
            <div className={styles.headerContent}>
              {!isSidebarOpen && (
                <button onClick={() => setSidebarOpen(true)} className={styles.menuButton}>
                  <MenuOutlined style={{ fontSize: 20 }} />
                </button>
              )}
              <span className={`${styles.title} ${isSidebarOpen ? styles.hidden : ""}`}>Smart LLM Chat</span>
            </div>
          </header>

          <div className={`${styles.scrollArea} custom-scrollbar`}>
            {isHome ? (
              <div className={styles.welcomeContainer}>
                <div className={styles.welcomeHeader}>
                  <h1 className={styles.welcomeTitle}>{t.chat.hello}</h1>
                  <h2 className={styles.welcomeSubtitle}>{t.chat.howCanIHelp}</h2>
                </div>

                {/* Input Console in Home Mode */}
                <div className={styles.homeInputWrapper}>
                  <InputConsole
                    input={input}
                    setInput={setInput}
                    isInputExpanded={isInputExpanded}
                    setIsInputExpanded={setIsInputExpanded}
                    attachments={attachments}
                    removeAttachment={removeAttachment}
                    activeTags={activeTags}
                    removeTag={removeTag}
                    triggerType={triggerType}
                    triggerQuery={triggerQuery}
                    handleTriggerSelect={handleTriggerSelect}
                    getFilteredTriggers={getFilteredTriggers}
                    isPlusMenuOpen={isPlusMenuOpen}
                    setPlusMenuOpen={setPlusMenuOpen}
                    isToolsMenuOpen={isToolsMenuOpen}
                    setToolsMenuOpen={setToolsMenuOpen}
                    isModelDropdownOpen={isModelDropdownOpen}
                    setModelDropdownOpen={setModelDropdownOpen}
                    selectedModel={selectedModel}
                    setSelectedModel={setSelectedModel}
                    availableModels={availableModels}
                    isListening={isListening}
                    setIsListening={setIsListening}
                    handleInputChange={handleInputChange}
                    handleSend={handleSend}
                    handleFileUpload={handleFileUpload}
                    settings={settings}
                    inputRef={inputRef}
                    fileInputRef={fileInputRef}
                    plusMenuRef={plusMenuRef}
                    toolsMenuRef={toolsMenuRef}
                    dropdownRef={dropdownRef}
                    isHome={isHome}
                    showCanvasBadge={showCanvasBadge}
                    setShowCanvasBadge={setShowCanvasBadge}
                    isStreaming={isStreaming}
                    onStop={stop}
                  />
                </div>

                <div className={styles.suggestionGrid}>
                  {SUGGESTION_CHIPS.map((chip, idx) => (
                    <button key={idx} onClick={() => setInput(chip.label)} className={styles.suggestionCard}>
                      <span className={styles.suggestionIcon}>{chip.icon}</span>
                      <span className={styles.suggestionLabel}>{chip.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className={`${styles.messagesContainer} ${settings.denseMode ? styles.dense : ""}`}>
                <HistoryMessages
                  messages={messages}
                  denseMode={settings.denseMode}
                  onEdit={handleEditMessageStable}
                  onRegenerate={handleRegenerateStable}
                  onOpenCanvas={handleOpenCanvas}
                  extensions={extensions}
                  t={t}
                  onSendFromDirective={onSendFromDirective}
                />
                <ActiveMessage
                  msg={activeMessage}
                  denseMode={settings.denseMode}
                  onEdit={handleEditMessageStable}
                  onRegenerate={handleRegenerateStable}
                  onOpenCanvas={handleOpenCanvas}
                  extensions={extensions}
                  t={t}
                  onSendFromDirective={onSendFromDirective}
                />
                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {!isHome && (
            <InputConsole
              input={input}
              setInput={setInput}
              isInputExpanded={isInputExpanded}
              setIsInputExpanded={setIsInputExpanded}
              attachments={attachments}
              removeAttachment={removeAttachment}
              activeTags={activeTags}
              removeTag={removeTag}
              triggerType={triggerType}
              triggerQuery={triggerQuery}
              handleTriggerSelect={handleTriggerSelect}
              getFilteredTriggers={getFilteredTriggers}
              isPlusMenuOpen={isPlusMenuOpen}
              setPlusMenuOpen={setPlusMenuOpen}
              isToolsMenuOpen={isToolsMenuOpen}
              setToolsMenuOpen={setToolsMenuOpen}
              isModelDropdownOpen={isModelDropdownOpen}
              setModelDropdownOpen={setModelDropdownOpen}
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              availableModels={availableModels}
              isListening={isListening}
              setIsListening={setIsListening}
              handleInputChange={handleInputChange}
              handleSend={handleSend}
              handleFileUpload={handleFileUpload}
              settings={settings}
              inputRef={inputRef}
              fileInputRef={fileInputRef}
              plusMenuRef={plusMenuRef}
              toolsMenuRef={toolsMenuRef}
              dropdownRef={dropdownRef}
              isHome={isHome}
              showCanvasBadge={showCanvasBadge}
              setShowCanvasBadge={setShowCanvasBadge}
              isStreaming={isStreaming}
              onStop={stop}
            />
          )}
        </main>

        <ArtifactPanel isOpen={artifactOpen} onClose={() => setArtifactOpen(false)} content={artifactContent} t={t} />
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
