import type { TriggerItem } from "@llm/core";
import { X } from "lucide-react";
import React from "react";

interface ActiveTagsProps {
  /**
   * List of active tags/chips to display
   * 当前激活的标签/胶囊列表
   */
  activeTags: TriggerItem[];
  /**
   * Callback when a tag is removed
   * 移除标签时的回调函数
   */
  onRemove: (id: string) => void;
}

/**
 * ActiveTags Component
 *
 * Displays a list of selected tags (capsules/chips) above the input area.
 * Used for "Prompt DSL" features where tags represent injected context or instructions.
 *
 * ActiveTags 组件
 *
 * 在输入区域上方显示选中的标签（胶囊/芯片）列表。
 * 用于 "Prompt DSL" 功能，其中标签代表注入的上下文或指令。
 */
export const ActiveTags: React.FC<ActiveTagsProps> = ({ activeTags, onRemove }) => {
  if (!activeTags || activeTags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mb-2 px-1 animate-fade-in">
      {activeTags.map((tag) => (
        <div
          key={tag.id}
          className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-full text-xs font-medium border border-blue-100 dark:border-blue-800/50 shadow-sm"
        >
          {tag.icon && <span className="w-3 h-3 opacity-70">{tag.icon}</span>}
          <span>{tag.label}</span>
          <button
            onClick={() => onRemove(tag.id)}
            className="ml-0.5 p-0.5 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full transition-colors"
            aria-label={`Remove ${tag.label}`}
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
};
