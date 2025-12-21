import { CheckOutlined, CopyOutlined, EditOutlined, ReloadOutlined, SoundOutlined } from "@ant-design/icons";
import type { Message } from "@llm/core";
import { memo, useState } from "react";
import type { Translations } from "../../../locales/en";
import styles from "./MessageActions.module.less";

interface MessageActionsProps {
  msg: Message;
  isEditing: boolean;
  onEditStart: () => void;
  onRegenerate: () => void;
  t: Translations;
}

export const MessageActions = memo(({ msg, isEditing, onEditStart, onRegenerate, t }: MessageActionsProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (msg.isStreaming || msg.isThinking || isEditing) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(msg.content);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleSpeak = () => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(msg.content);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  return (
    <div className={styles.container}>
      {msg.role === "user" && (
        <button onClick={onEditStart} className={styles.actionButton} title={t.common.edit}>
          <EditOutlined style={{ fontSize: 14 }} />
        </button>
      )}
      {msg.role === "model" && (
        <>
          <button
            onClick={handleSpeak}
            className={`${styles.actionButton} ${isSpeaking ? styles.active : ""}`}
            title={isSpeaking ? t.common.stopSpeaking : t.common.speak}
          >
            <SoundOutlined style={{ fontSize: 14 }} />
          </button>
          <button onClick={onRegenerate} className={styles.actionButton} title={t.common.regenerate}>
            <ReloadOutlined style={{ fontSize: 14 }} />
          </button>
          <button onClick={handleCopy} className={styles.actionButton} title={t.common.copy}>
            {isCopied ? (
              <CheckOutlined style={{ fontSize: 14, color: "#22c55e" }} />
            ) : (
              <CopyOutlined style={{ fontSize: 14 }} />
            )}
          </button>
        </>
      )}
    </div>
  );
});
