import { TagOutlined, UserOutlined } from "@ant-design/icons";
import type { TriggerItem } from "@llm/core";
import { memo } from "react";
import { Translations } from "../../../locales/en";
import styles from "./InputSuggestions.module.less";

interface InputSuggestionsProps {
  triggerType: "@" | "#" | null;
  suggestions: TriggerItem[];
  onSelect: (item: TriggerItem) => void;
  t: Translations;
}

export const InputSuggestions = memo(({ triggerType, suggestions, onSelect, t }: InputSuggestionsProps) => {
  if (!triggerType) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {triggerType === "@" ? <UserOutlined style={{ fontSize: 12 }} /> : <TagOutlined style={{ fontSize: 12 }} />}
        <span>{triggerType === "@" ? t.common.mention : t.common.tag}</span>
      </div>
      <div className={`${styles.list} custom-scrollbar`}>
        {suggestions.map((item) => (
          <button key={item.id} onClick={() => onSelect(item)} className={styles.item}>
            <div className={styles.itemIcon}>{item.icon}</div>
            <div className={styles.itemContent}>
              <div className={styles.itemLabel}>{item.label}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});
