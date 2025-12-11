import type { Message } from "@llm/core";
import { Copy, Edit2, RotateCcw, Volume2 } from "lucide-react";
import { memo } from "react";

interface MessageActionsProps {
  msg: Message;
  isEditing: boolean;
  onEditStart: () => void;
  onRegenerate: () => void;
}

export const MessageActions = memo(({ msg, isEditing, onEditStart, onRegenerate }: MessageActionsProps) => {
  if (msg.isStreaming || msg.isThinking || isEditing) return null;

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
          <button className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-[#3c4043] text-gray-500" title="Speak">
            <Volume2 size={14} />
          </button>
          <button
            onClick={onRegenerate}
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-[#3c4043] text-gray-500"
            title="Regenerate"
          >
            <RotateCcw size={14} />
          </button>
          <button className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-[#3c4043] text-gray-500">
            <Copy size={14} />
          </button>
        </>
      )}
    </div>
  );
});
