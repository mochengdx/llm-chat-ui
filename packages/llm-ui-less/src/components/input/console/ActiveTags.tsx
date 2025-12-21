import { CloseOutlined } from "@ant-design/icons";
import { TriggerItem } from "@llm/core";
import React from "react";
import styles from "./ActiveTags.module.less";

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
    <div className={styles.container}>
      {activeTags.map((tag) => (
        <div key={tag.id} className={styles.tag}>
          {tag.icon && <span className={styles.icon}>{tag.icon}</span>}
          <span>{tag.label}</span>
          <button onClick={() => onRemove(tag.id)} className={styles.removeButton} aria-label={`Remove ${tag.label}`}>
            <CloseOutlined style={{ fontSize: 12 }} />
          </button>
        </div>
      ))}
    </div>
  );
};
