import React from "react";
import styles from "./InputMain.module.less";

const InputMain: React.FC<{ value: string; onChange: (v: string) => void; onSend: () => void; disabled?: boolean }> = ({
  value,
  onChange,
  onSend,
  disabled
}) => (
  <div className={styles.container}>
    <input
      className={styles.input}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) onSend();
      }}
      placeholder="Type a message..."
      disabled={disabled}
    />
    <button onClick={onSend} className={styles.button} disabled={disabled}>
      Send
    </button>
  </div>
);

export default InputMain;
