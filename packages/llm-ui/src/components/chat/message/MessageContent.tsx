import type { Message } from "@llm/core";
import { memo, useState } from "react";
import MarkdownRenderer from "../MarkdownRenderer";

interface MessageContentProps {
  msg: Message;
  isEditing: boolean;
  onSaveEdit: (newContent: string) => void;
  onCancelEdit: () => void;
  onOpenCanvas: (code: string) => void;
  isUser: boolean;
}

export const MessageContent = memo(
  ({ msg, isEditing, onSaveEdit, onCancelEdit, onOpenCanvas, isUser }: MessageContentProps) => {
    const [editContent, setEditContent] = useState(msg.content);

    if (isEditing) {
      return (
        <div className="bg-gray-50 dark:bg-[#252627] rounded-xl border border-blue-500/50 p-2 w-full">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-gray-800 dark:text-gray-200 text-sm resize-none"
            rows={3}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={onCancelEdit}
              className="px-3 py-1 text-xs rounded-full hover:bg-gray-200 dark:hover:bg-[#3c4043]"
            >
              Cancel
            </button>
            <button
              onClick={() => onSaveEdit(editContent)}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </div>
      );
    }

    if (isUser) {
      return (
        <div className="bg-blue-50 dark:bg-blue-500/10 px-4 py-3 rounded-2xl rounded-tr-sm text-gray-800 dark:text-gray-100 text-[16px]">
          <MarkdownRenderer content={msg.content} />
        </div>
      );
    }

    return (
      <div
        className={`prose max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:bg-gray-100 dark:prose-pre:bg-[#1e1f20]`}
      >
        <MarkdownRenderer content={msg.content} onCodeBlockFound={onOpenCanvas} />
        {msg.isStreaming && !msg.isThinking && (
          <span className="inline-block w-2 h-4 bg-gray-800 dark:bg-gray-400 ml-1 animate-blink align-middle"></span>
        )}
      </div>
    );
  }
);
