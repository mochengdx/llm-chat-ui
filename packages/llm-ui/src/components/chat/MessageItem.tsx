import type { Message } from "@llm/core";
import {
  Brain,
  ChevronDown,
  ChevronRight,
  Copy,
  Edit2,
  File,
  Loader2,
  RotateCcw,
  Sparkles,
  User,
  Volume2
} from "lucide-react";
import { memo, useEffect, useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";

const MessageItem = memo(
  ({
    msg,
    onEdit,
    onRegenerate,
    onOpenCanvas
  }: {
    msg: Message;
    onEdit: (id: string, newContent: string) => void;
    onRegenerate: () => void;
    onOpenCanvas: (code: string) => void;
  }) => {
    const [isThoughtOpen, setThoughtOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(msg.content);

    useEffect(() => {
      if (msg.isThinking) setThoughtOpen(true);
    }, [msg.isThinking]);

    const handleSaveEdit = () => {
      setIsEditing(false);
      if (editContent !== msg.content) {
        onEdit(msg.id, editContent);
      }
    };

    return (
      <div className="group flex gap-4 animate-fade-in w-full max-w-3xl mx-auto">
        <div className="shrink-0 mt-1">
          {msg.role === "model" ? (
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <Sparkles
                className={`animate-pulse ${
                  msg.modelUsed?.includes("Thinking")
                    ? "text-blue-500 dark:text-blue-400"
                    : "text-red-500 dark:text-red-400"
                }`}
                size={20}
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-[#3c4043] flex items-center justify-center">
              <User size={16} className="text-gray-600 dark:text-gray-300" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
              {msg.role === "model" ? "Simple LLM Chat" : "You"}
            </span>
            {msg.role === "model" && msg.modelUsed && (
              <span className="text-[10px] px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-700 text-gray-500">
                {msg.modelUsed}
              </span>
            )}
            {msg.childrenIds && msg.childrenIds.length > 1 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <button className="hover:text-gray-900 dark:hover:text-white">
                  <ChevronDown className="rotate-90" size={12} />
                </button>
                <span>
                  {(msg.currentChildIndex || 0) + 1} / {msg.childrenIds.length}
                </span>
                <button className="hover:text-gray-900 dark:hover:text-white">
                  <ChevronDown className="-rotate-90" size={12} />
                </button>
              </div>
            )}
          </div>

          {msg.attachments && msg.attachments.length > 0 && (
            <div className="flex gap-2 mb-2">
              {msg.attachments.map((att) => (
                <div
                  key={att.id}
                  className="relative group/att rounded-lg overflow-hidden border border-gray-200 dark:border-[#3c4043]"
                >
                  {att.type === "image" ? (
                    <img src={att.previewUrl} alt="attachment" className="h-20 w-auto object-cover" />
                  ) : (
                    <div className="h-20 w-20 flex items-center justify-center bg-gray-100 dark:bg-[#2d2e30]">
                      <File size={24} className="text-gray-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {msg.role === "model" && msg.thoughtProcess && (
            <div className="mb-3 rounded-xl bg-gray-50 dark:bg-[#1e1f20] border border-gray-200 dark:border-[#3c4043]/60 overflow-hidden">
              <button
                onClick={() => setThoughtOpen(!isThoughtOpen)}
                className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-[#252627] hover:bg-gray-200 dark:hover:bg-[#2d2e30] transition-colors text-left"
              >
                {isThoughtOpen ? (
                  <ChevronDown size={14} className="text-gray-500" />
                ) : (
                  <ChevronRight size={14} className="text-gray-500" />
                )}
                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
                  <Brain
                    size={12}
                    className={msg.isThinking ? "text-blue-500 dark:text-blue-400 animate-pulse" : "text-gray-500"}
                  />
                  <span>Thinking Process</span>
                </div>
                {msg.isThinking && (
                  <span className="ml-auto flex items-center gap-1 text-[10px] text-blue-600/80 dark:text-blue-400/80 font-mono">
                    Thinking <Loader2 size={10} className="animate-spin" />
                  </span>
                )}
              </button>
              {isThoughtOpen && (
                <div className="px-4 py-3 text-xs text-gray-700 dark:text-gray-300 font-mono leading-relaxed border-t border-gray-200 dark:border-[#3c4043]/30 bg-white dark:bg-[#1a1b1c] animate-slide-down">
                  {msg.thoughtProcess}
                  {msg.isThinking && (
                    <span className="inline-block w-1.5 h-3 bg-blue-500/50 ml-1 animate-pulse align-middle"></span>
                  )}
                </div>
              )}
            </div>
          )}

          {isEditing ? (
            <div className="bg-gray-50 dark:bg-[#252627] rounded-xl border border-blue-500/50 p-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-gray-800 dark:text-gray-200 text-sm resize-none"
                rows={3}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1 text-xs rounded-full hover:bg-gray-200 dark:hover:bg-[#3c4043]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600"
                >
                  Update
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`prose max-w-none dark:prose-invert prose-p:leading-relaxed prose-pre:bg-gray-100 dark:prose-pre:bg-[#1e1f20]`}
            >
              {msg.role === "user" ? (
                <div className="whitespace-pre-wrap text-gray-800 dark:text-[#e3e3e3] text-[16px]">{msg.content}</div>
              ) : (
                <MarkdownRenderer content={msg.content} onCodeBlockFound={onOpenCanvas} />
              )}
              {msg.isStreaming && !msg.isThinking && (
                <span className="inline-block w-2 h-4 bg-gray-800 dark:bg-gray-400 ml-1 animate-blink align-middle"></span>
              )}
            </div>
          )}

          {!msg.isStreaming && !msg.isThinking && !isEditing && (
            <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {msg.role === "user" && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-[#3c4043] text-gray-500"
                  title="Edit"
                >
                  <Edit2 size={14} />
                </button>
              )}
              {msg.role === "model" && (
                <>
                  <button
                    className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-[#3c4043] text-gray-500"
                    title="Speak"
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
                  <button className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-[#3c4043] text-gray-500">
                    <Copy size={14} />
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
);

export default MessageItem;
