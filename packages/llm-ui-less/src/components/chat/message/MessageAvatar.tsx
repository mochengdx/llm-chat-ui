import { ExperimentOutlined, UserOutlined } from "@ant-design/icons";
import type { Message } from "@llm/core";
import { memo } from "react";
import styles from "./MessageAvatar.module.less";

interface MessageAvatarProps {
  role: Message["role"];
  modelUsed?: string;
  isStreaming?: boolean;
}

export const MessageAvatar = memo(({ role, modelUsed, isStreaming }: MessageAvatarProps) => {
  if (role === "model") {
    return (
      <div className={`${styles.avatarContainer} ${styles.modelAvatar}`}>
        <ExperimentOutlined
          className={`${styles.icon} ${isStreaming ? styles.spinning : ""} ${
            modelUsed?.includes("Thinking") ? styles.thinking : styles.defaultModel
          }`}
        />
      </div>
    );
  }

  return (
    <div className={`${styles.avatarContainer} ${styles.userAvatar}`}>
      <UserOutlined className={styles.userIcon} />
    </div>
  );
});
