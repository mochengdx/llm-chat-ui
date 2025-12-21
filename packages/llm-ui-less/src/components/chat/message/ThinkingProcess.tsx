import { BulbOutlined, DownOutlined, LoadingOutlined, RightOutlined } from "@ant-design/icons";
import { memo, useEffect, useState } from "react";
import { Translations } from "../../../locales/en";
import styles from "./ThinkingProcess.module.less";

interface ThinkingProcessProps {
  thoughtProcess?: string;
  isThinking?: boolean;
  t: Translations;
}

export const ThinkingProcess = memo(({ thoughtProcess, isThinking, t }: ThinkingProcessProps) => {
  const [isThoughtOpen, setThoughtOpen] = useState(false);

  useEffect(() => {
    if (isThinking) setThoughtOpen(true);
  }, [isThinking]);

  if (!thoughtProcess) return null;

  return (
    <div className={styles.container}>
      <button onClick={() => setThoughtOpen(!isThoughtOpen)} className={styles.header}>
        {isThoughtOpen ? (
          <DownOutlined style={{ fontSize: 14 }} className={styles.icon} />
        ) : (
          <RightOutlined style={{ fontSize: 14 }} className={styles.icon} />
        )}
        <div className={styles.title}>
          <BulbOutlined
            style={{ fontSize: 12 }}
            className={`${styles.brainIcon} ${isThinking ? styles.thinking : ""}`}
          />
          <span>{t.chat.thinkingProcess}</span>
        </div>
        {isThinking && (
          <span className={styles.status}>
            {t.chat.thinking} <LoadingOutlined style={{ fontSize: 10 }} />
          </span>
        )}
      </button>
      {isThoughtOpen && (
        <div className={styles.content}>
          {thoughtProcess}
          {isThinking && <span className={styles.cursor}></span>}
        </div>
      )}
    </div>
  );
});
