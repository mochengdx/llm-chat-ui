import type { Message } from "@llm/core";
import { Check, Copy, Edit2, RotateCcw, Volume2 } from "lucide-react";
import { memo, useState } from "react";

interface MessageActionsProps {
  msg: Message;
  isEditing: boolean;
  onEditStart: () => void;
  onRegenerate: () => void;
}

export const MessageActions = memo(({ msg, isEditing, onEditStart, onRegenerate }: MessageActionsProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (msg.isStreaming || msg.isThinking || isEditing) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(msg.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(msg.content);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {msg.role === "user" && (
        <button
          onClick={onEditStart}
          className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-[#3c4043] text-gray-500"
          title="Edit"
        >
          <Edit2 size={14} />
        </button>
      )}
      {msg.role === "model" && (
        <>
          <button
            onClick={handleSpeak}
            className={`p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-[#3c4043] ${isSpeaking ? "text-blue-500" : "text-gray-500"}`}
            title={isSpeaking ? "Stop Speaking" : "Speak"}
          >
            <Volume2 size={14} />
          </button>
          <button
            onClick={onRegenerate}
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-[#3c4043] text-gray-500"
            title="Regenerate"
          >
            <RotateCcw size={14} />
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-[#3c4043] text-gray-500"
            title="Copy"
          >
            {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
        </>
      )}
    </div>
  );
});
