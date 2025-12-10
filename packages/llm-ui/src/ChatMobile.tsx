import { StreamClient } from "@llm/core";
import { useLLMStore } from "@llm/store";
import React from "react";
import ReactDOM from "react-dom";
import ArtifactPanel from "./components/artifact/ArtifactPanel";
import MessageItem from "./components/chat/MessageItem";
import SettingsModal from "./components/settings/SettingsModal";

const ChatMainMobileLayout: React.FC = () => {
  const { messages, setMessages, settings, setSettings } = useLLMStore();
  const [input, setInput] = React.useState("");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [isSettingsOpen, setSettingsOpen] = React.useState(false);
  const [artifactOpen, setArtifactOpen] = React.useState(false);
  const [artifactContent, setArtifactContent] = React.useState("");
  const chatEndRef = React.useRef<HTMLDivElement>(null);
  const streamClientRef = React.useRef<StreamClient | null>(null);

  React.useEffect(() => {
    if (messages.length > 0) chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isGenerating]);

  const handleSend = (txt?: string) => {
    const textToSend = txt || input;
    if (!textToSend.trim() || isGenerating) return;
    if (!streamClientRef.current) {
      streamClientRef.current = new StreamClient(settings.protocol);
    }
    setIsGenerating(true);
    const userMsg = {
      id: Date.now().toString(),
      role: "user" as const,
      content: textToSend,
      timestamp: Date.now(),
      isStreaming: false
    };
    setMessages([...messages, userMsg]);
    setInput("");
    const aiMsgId = (Date.now() + 1).toString();
    setMessages([
      ...messages,
      { id: aiMsgId, role: "model", content: "", timestamp: Date.now(), isStreaming: true, modelUsed: "Mock" }
    ]);
    const request = {
      modelId: "Mock",
      messages: [...messages, userMsg],
      config: { useThinking: settings.enableThinking }
    };
    const callbacks = {
      onThinking: (token: string) =>
        setMessages(
          messages.map((m: any) => (m.id === aiMsgId ? { ...m, thoughtProcess: (m.thoughtProcess || "") + token } : m))
        ),
      onContent: (token: string) =>
        setMessages(messages.map((m: any) => (m.id === aiMsgId ? { ...m, content: m.content + token } : m))),
      onEnd: () => setMessages(messages.map((m: any) => (m.id === aiMsgId ? { ...m, isStreaming: false } : m))),
      onError: (err: any) =>
        setMessages(
          messages.map((m: any) =>
            m.id === aiMsgId ? { ...m, content: m.content + `\n[Error: ${err.message}]`, isStreaming: false } : m
          )
        )
    };
    streamClientRef.current.stream(request, callbacks);
    setIsGenerating(false);
  };

  const handleEditMessage = (msgId: string, newContent: string) => {
    setMessages(messages.map((m: any) => (m.id === msgId ? { ...m, content: newContent } : m)));
  };

  return (
    <div className="flex flex-col h-full w-full relative">
      <header className="p-3 flex justify-between items-center border-b bg-white sticky top-0 z-10">
        <h1 className="text-lg font-bold">LLM Chat</h1>
        <button onClick={() => setSettingsOpen(true)} className="px-3 py-1 rounded bg-gray-200 text-base">
          设置
        </button>
      </header>
      <main className="flex-1 overflow-y-auto px-2 py-2 bg-white">
        {messages.map((msg: any) => (
          <div key={msg.id} className="mb-3">
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
      </main>
      <footer className="p-2 border-t bg-white sticky bottom-0 z-10 flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-3 text-base"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) handleSend();
          }}
          placeholder="输入消息..."
          disabled={isGenerating}
        />
        <button
          onClick={() => handleSend()}
          className="px-5 py-3 rounded bg-blue-600 text-white text-base font-medium"
          disabled={isGenerating}
        >
          发送
        </button>
      </footer>
      {isSettingsOpen &&
        ReactDOM.createPortal(
          <SettingsModal
            isOpen={isSettingsOpen}
            onClose={() => setSettingsOpen(false)}
            settings={settings}
            updateSettings={(k: keyof typeof settings, v: any) => setSettings({ ...settings, [k]: v })}
          />,
          document.body
        )}
      <ArtifactPanel isOpen={artifactOpen} onClose={() => setArtifactOpen(false)} content={artifactContent} />
    </div>
  );
};

const ChatMobile: React.FC = () => {
  // 响应式适配，底部输入区固定，内容区滚动，适合手持
  return (
    <div
      className="w-full h-screen max-w-[480px] mx-auto bg-white flex flex-col"
      style={{ boxShadow: "0 0 8px 0 #e5e7eb" }}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatMainMobileLayout />
      </div>
    </div>
  );
};

export default ChatMobile;
