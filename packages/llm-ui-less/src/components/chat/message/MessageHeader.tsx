import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import type { Message } from "@llm/core";
import { memo } from "react";
import { Translations } from "../../../locales/en";
import styles from "./MessageHeader.module.less";

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
      <div className={`${styles.container} ${isUser ? styles.user : ""}`}>
        <span className={styles.name}>{role === "model" ? t.common.modelName : t.common.you}</span>
        {role === "model" && modelUsed && <span className={styles.modelBadge}>{modelUsed}</span>}
        {childrenIds && childrenIds.length > 1 && (
          <div className={styles.navigation}>
            <button className={styles.navButton}>
              <LeftOutlined style={{ fontSize: 12 }} />
            </button>
            <span>
              {(currentChildIndex || 0) + 1} / {childrenIds.length}
            </span>
            <button className={styles.navButton}>
              <RightOutlined style={{ fontSize: 12 }} />
            </button>
          </div>
        )}
      </div>
    );
  }
);
