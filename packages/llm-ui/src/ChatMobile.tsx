import type { Message, StreamAdapter, UserSettings } from "@llm/core";
import { StreamClient } from "@llm/core";
import { useLLMStore } from "@llm/store";
import { ChevronLeft, Image as ImageIcon, Mic, Plus, Send, Settings, Sparkles, Square, User } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { ChatHooks } from "./ChatMain";
import ArtifactPanel from "./components/artifact/ArtifactPanel";
import MarkdownRenderer from "./components/chat/MarkdownRenderer";
import SettingsModal from "./components/settings/SettingsModal";

import { useTranslation } from "./hooks/useTranslation";
import { Translations } from "./locales/en";

import { ChatExtensions } from "./components/chat/renderers/types";

interface ChatMobileProps extends ChatHooks {
  /** Custom stream adapter for handling different transport protocols */
  customAdapter?: StreamAdapter;
}

/**
 * Mobile Message Item Component
 * Renders individual chat messages with mobile-optimized styling.
 * Supports:
 * - User/Model distinction (Right/Left alignment)
 * - Markdown rendering for model responses
 * - Thinking process display
 * - Artifact/Canvas triggers
 */
const MobileMessageItem = ({
  msg,
  onOpenCanvas,
  t,
  onSend,
  extensions
}: {
  msg: Message;
  onOpenCanvas: (code: string) => void;
  t: Translations;
  onSend?: (message: string) => void;
  extensions?: ChatExtensions;
}) => {
  const isUser = msg.role === "user";
  const [showThought, setShowThought] = useState(false);

  return (
    <div className={`flex w-full mb-4 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center mr-2 shrink-0">
          <Sparkles size={18} className={`text-blue-600 ${msg.isStreaming ? "animate-spin" : ""}`} />
        </div>
      )}

      <div className={`flex flex-col max-w-[85%] ${isUser ? "items-end" : "items-start"}`}>
        {/* Thinking Process for Model */}
        {!isUser && msg.thoughtProcess && (
          <div className="mb-2 w-full">
            <button
              onClick={() => setShowThought(!showThought)}
              className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded mb-1"
            >
              {showThought ? t.chat.hideThought : t.chat.showThought}
            </button>
            {showThought && (
              <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 border border-gray-100 mb-1 break-words whitespace-pre-wrap">
                {msg.thoughtProcess}
              </div>
            )}
          </div>
        )}

        <div
          className={`px-3 py-2 rounded-lg text-[15px] leading-relaxed shadow-sm break-words ${
            isUser ? "bg-[#95ec69] text-black rounded-tr-none" : "bg-white text-gray-800 rounded-tl-none"
          }`}
          style={{ minHeight: "40px", minWidth: "40px" }}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">{msg.content}</div>
          ) : (
            <MarkdownRenderer
              content={msg.content || (msg.isStreaming ? "..." : "")}
              onCodeBlockFound={onOpenCanvas}
              onSend={onSend}
              extensions={extensions}
            />
          )}
        </div>
      </div>

      {isUser && (
        <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center ml-2 shrink-0">
          <User size={18} className="text-gray-600" />
        </div>
      )}
    </div>
  );
};

const ChatMainMobileLayout: React.FC<ChatMobileProps> = ({
  onBeforeSend,
  onStreamTransform,
  customAdapter,
  extensions
}) => {
  const { messages, setMessages, settings, setSettings } = useLLMStore();
  const { t } = useTranslation(settings);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [artifactOpen, setArtifactOpen] = useState(false);
  const [artifactContent, setArtifactContent] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const streamClientRef = useRef<StreamClient | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    chatEndRef.current?.scrollIntoView({ behavior });
  };

  // Sync theme with settings
  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.theme === "dark");
  }, [settings.theme]);

  // Reset streaming status on mount (in case of page refresh during generation)
  useEffect(() => {
    const hasStreamingMessage = messages.some((m) => m.isStreaming);
    if (hasStreamingMessage) {
      setMessages((prev) => prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)));
    }
  }, []);

  // Scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isGenerating]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + "px";
    }
  }, [input]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      streamClientRef.current?.abort();
    };
  }, []);

  const handleStop = () => {
    streamClientRef.current?.abort();
    setIsGenerating(false);
    setMessages((prev) => prev.map((m) => (m.isStreaming ? { ...m, isStreaming: false } : m)));
  };

  const handleSend = async (txt?: string) => {
    const textToSend = txt || input;
    if (!textToSend.trim() || isGenerating) return;

    if (!txt) setInput("");

    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    let finalContent = textToSend;

    if (onBeforeSend) {
      try {
        const processed = await onBeforeSend(textToSend);
        if (typeof processed === "string") {
          finalContent = processed;
        }
      } catch (error) {
        console.error("Error in onBeforeSend:", error);
      }
    }

    if (!streamClientRef.current) {
      streamClientRef.current = new StreamClient(customAdapter || settings.protocol);
    }

    setIsGenerating(true);

    const userMsg = {
      id: Date.now().toString(),
      role: "user" as const,
      content: finalContent,
      timestamp: Date.now(),
      isStreaming: false
    };

    const aiMsgId = (Date.now() + 1).toString();
    const aiMsg = {
      id: aiMsgId,
      role: "model" as const,
      content: "",
      timestamp: Date.now(),
      isStreaming: true,
      modelUsed: "Mock"
    };

    setMessages([...messages, userMsg, aiMsg]);

    const request = {
      modelId: "Mock",
      messages: [...messages, userMsg],
      config: { useThinking: settings.enableThinking }
    };

    const callbacks = {
      onThinking: (token: string) =>
        setMessages((prev) =>
          prev.map((m) => (m.id === aiMsgId ? { ...m, thoughtProcess: (m.thoughtProcess || "") + token } : m))
        ),
      onContent: (token: string) => {
        const processedToken = onStreamTransform ? onStreamTransform(token) : token;
        setMessages((prev) => prev.map((m) => (m.id === aiMsgId ? { ...m, content: m.content + processedToken } : m)));
        scrollToBottom("auto"); // Instant scroll during generation
      },
      onEnd: () => {
        setMessages((prev) => prev.map((m) => (m.id === aiMsgId ? { ...m, isStreaming: false } : m)));
        setIsGenerating(false);
      },
      onError: (err: unknown) => {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setMessages((prev) =>
          prev.map((m) =>
            m.id === aiMsgId ? { ...m, content: m.content + `\n[Error: ${errorMessage}]`, isStreaming: false } : m
          )
        );
        setIsGenerating(false);
      }
    };

    streamClientRef.current.stream(request, callbacks);
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-[#ededed] relative overflow-hidden">
      {/* Header */}
      <header className="h-[44px] px-4 flex justify-between items-center bg-[#ededed] border-b border-gray-300 shrink-0 z-20">
        <div className="w-8 flex items-center">
          <ChevronLeft size={24} className="text-black" />
        </div>
        <h1 className="text-[17px] font-medium text-black">Simple LLM Chat</h1>
        <button onClick={() => setSettingsOpen(true)} className="w-8 flex items-center justify-end">
          <Settings size={20} className="text-black" />
        </button>
      </header>

      {/* Message List */}
      <main className="flex-1 overflow-y-auto p-3 scroll-smooth" style={{ WebkitOverflowScrolling: "touch" }}>
        {messages.map((msg: Message) => (
          <MobileMessageItem
            key={msg.id}
            msg={msg}
            onOpenCanvas={(code) => {
              setArtifactContent(code);
              setArtifactOpen(true);
            }}
            t={t}
            onSend={(message) => handleSend(message)}
            extensions={extensions}
          />
        ))}
        <div ref={chatEndRef} className="h-2" />
      </main>

      {/* Input Area */}
      <footer className="bg-white border-t border-gray-100 p-3 pb-[max(12px,env(safe-area-inset-bottom))] shrink-0 z-20">
        <div className="bg-[#f0f4f9] rounded-[28px] flex items-end px-2 py-2 gap-2 transition-colors focus-within:bg-white focus-within:shadow-md border border-transparent focus-within:border-gray-200">
          <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-full shrink-0">
            <Plus size={20} />
          </button>

          <textarea
            ref={textareaRef}
            className="flex-1 bg-transparent border-none outline-none text-[16px] resize-none max-h-[120px] leading-6 py-1.5 text-gray-800 placeholder-gray-500"
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.input.placeholder}
            style={{ height: "auto" }}
          />

          {isGenerating ? (
            <button
              onClick={handleStop}
              className="p-2 rounded-full shrink-0 mb-0.5 transition-colors bg-red-500 text-white"
            >
              <Square size={18} fill="currentColor" />
            </button>
          ) : !input.trim() ? (
            <div className="flex items-center gap-1 shrink-0 pb-0.5">
              <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-full">
                <ImageIcon size={20} />
              </button>
              <button className="p-2 text-gray-500 hover:bg-gray-200 rounded-full">
                <Mic size={20} />
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleSend()}
              disabled={isGenerating}
              className={`p-2 rounded-full shrink-0 mb-0.5 transition-colors ${
                isGenerating ? "bg-gray-200 text-gray-400" : "bg-blue-600 text-white"
              }`}
            >
              <Send size={18} />
            </button>
          )}
        </div>
      </footer>

      {/* Modals */}
      {isSettingsOpen &&
        ReactDOM.createPortal(
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setSettingsOpen(false)}
            settings={settings}
            updateSettings={(k: keyof UserSettings, v: UserSettings[keyof UserSettings]) =>
              setSettings({ ...settings, [k]: v })
            }
          />,
          document.body
        )}

      <ArtifactPanel isOpen={artifactOpen} onClose={() => setArtifactOpen(false)} content={artifactContent} t={t} />
    </div>
  );
};

const ChatMobile: React.FC<ChatMobileProps> = (props) => {
  return (
    <div className="w-full h-full">
      <ChatMainMobileLayout {...props} />
    </div>
  );
};

export default ChatMobile;
