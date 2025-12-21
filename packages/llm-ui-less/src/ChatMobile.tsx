import {
  AudioOutlined,
  BulbOutlined,
  LeftOutlined,
  PictureOutlined,
  PlusOutlined,
  SendOutlined,
  SettingOutlined,
  StopOutlined,
  UserOutlined
} from "@ant-design/icons";
import type { Message, StreamAdapter, UserSettings } from "@llm/core";
import { StreamClient } from "@llm/core";
import { useLLMStore } from "@llm/store";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { ChatHooks } from "./ChatMain";
import styles from "./ChatMobile.module.less";
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
    <div className={`${styles.messageRow} ${isUser ? styles.user : styles.model}`}>
      {!isUser && (
        <div className={`${styles.avatar} ${styles.model}`}>
          <BulbOutlined style={{ fontSize: 18 }} className={msg.isStreaming ? styles.spin : ""} />
        </div>
      )}

      <div className={`${styles.messageContentWrapper} ${isUser ? styles.user : styles.model}`}>
        {/* Thinking Process for Model */}
        {!isUser && msg.thoughtProcess && (
          <div style={{ marginBottom: 8, width: "100%" }}>
            <button onClick={() => setShowThought(!showThought)} className={styles.thoughtToggle}>
              {showThought ? t.chat.hideThought : t.chat.showThought}
            </button>
            {showThought && <div className={styles.thoughtContent}>{msg.thoughtProcess}</div>}
          </div>
        )}

        <div className={`${styles.messageBubble} ${isUser ? styles.user : styles.model}`}>
          {isUser ? (
            <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>
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
        <div className={`${styles.avatar} ${styles.user}`}>
          <UserOutlined style={{ fontSize: 18 }} />
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
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div style={{ width: 32, display: "flex", alignItems: "center" }}>
          <LeftOutlined style={{ fontSize: 24, color: "#000" }} />
        </div>
        <h1 className={styles.headerTitle}>Simple LLM Chat</h1>
        <button
          onClick={() => setSettingsOpen(true)}
          className={styles.headerButton}
          style={{ width: 32, justifyContent: "flex-end" }}
        >
          <SettingOutlined style={{ fontSize: 20, color: "#000" }} />
        </button>
      </header>

      {/* Message List */}
      <main className={styles.messageList}>
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
        <div ref={chatEndRef} style={{ height: 8 }} />
      </main>

      {/* Input Area */}
      <footer className={styles.inputArea}>
        <button className={styles.inputButton}>
          <PlusOutlined style={{ fontSize: 20 }} />
        </button>

        <div className={styles.inputWrapper}>
          <textarea
            ref={textareaRef}
            className={styles.input}
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t.input.placeholder}
          />
        </div>

        {isGenerating ? (
          <button onClick={handleStop} className={styles.stopButton}>
            <StopOutlined style={{ fontSize: 18 }} />
          </button>
        ) : !input.trim() ? (
          <div style={{ display: "flex", gap: 4, paddingBottom: 2 }}>
            <button className={styles.inputButton} style={{ border: "none" }}>
              <PictureOutlined style={{ fontSize: 20 }} />
            </button>
            <button className={styles.inputButton} style={{ border: "none" }}>
              <AudioOutlined style={{ fontSize: 20 }} />
            </button>
          </div>
        ) : (
          <button onClick={() => handleSend()} disabled={isGenerating} className={styles.sendButton}>
            <SendOutlined style={{ fontSize: 18 }} />
          </button>
        )}
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
    <div style={{ width: "100%", height: "100%" }}>
      <ChatMainMobileLayout {...props} />
    </div>
  );
};

export default ChatMobile;
