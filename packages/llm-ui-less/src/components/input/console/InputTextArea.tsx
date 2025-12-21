import { ExpandOutlined } from "@ant-design/icons";
import type { RefObject } from "react";
import { memo } from "react";
import type { Translations } from "../../../locales/en";
import styles from "./InputTextArea.module.less";

interface InputTextAreaProps {
  input: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  inputRef: RefObject<HTMLTextAreaElement>;
  isExpanded: boolean;
  onExpand: () => void;
  denseMode?: boolean;
  triggerType: string | null;
  t: Translations;
}

export const InputTextArea = memo(
  ({ input, onChange, onSend, inputRef, isExpanded, onExpand, denseMode, triggerType, t }: InputTextAreaProps) => {
    return (
      <div className={`${styles.container} ${isExpanded ? styles.expanded : denseMode ? styles.dense : styles.normal}`}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !triggerType) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder={t.input.placeholder}
          className={`${styles.textarea} custom-scrollbar`}
          style={{
            minHeight: isExpanded ? "100%" : "24px",
            maxHeight: isExpanded ? "none" : "200px"
          }}
        />
        {!isExpanded && (
          <button onClick={onExpand} className={styles.expandButton} title={t.input.fullScreen}>
            <ExpandOutlined style={{ fontSize: 14 }} />
          </button>
        )}
      </div>
    );
  }
);
