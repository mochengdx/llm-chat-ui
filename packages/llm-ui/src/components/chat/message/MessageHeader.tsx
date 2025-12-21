import type { Message } from "@llm/core";
import { ChevronDown } from "lucide-react";
import { memo } from "react";
import type { Translations } from "../../../locales/en";

interface MessageHeaderProps {
  role: Message["role"];
  modelUsed?: string;
  childrenIds?: string[];
  currentChildIndex?: number;
  isUser: boolean;
  t: Translations;
}

export const MessageHeader = memo(
  ({ role, modelUsed, childrenIds, currentChildIndex, isUser, t }: MessageHeaderProps) => {
    return (
      <div className={`flex items-center gap-2 h-8 ${isUser ? "flex-row-reverse" : ""}`}>
        <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
          {role === "model" ? t.common.modelName : t.common.you}
        </span>
        {role === "model" && modelUsed && (
          <span className="text-[10px] px-1.5 py-0.5 rounded border border-gray-300 dark:border-gray-700 text-gray-500">
            {modelUsed}
          </span>
        )}
        {childrenIds && childrenIds.length > 1 && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <button className="hover:text-gray-900 dark:hover:text-white">
              <ChevronDown className="rotate-90" size={12} />
            </button>
            <span>
              {(currentChildIndex || 0) + 1} / {childrenIds.length}
            </span>
            <button className="hover:text-gray-900 dark:hover:text-white">
              <ChevronDown className="-rotate-90" size={12} />
            </button>
          </div>
        )}
      </div>
    );
  }
);
