import type { Message } from "@llm/core";
import { memo, useState } from "react";
import { Translations } from "../../../locales/en";
import MarkdownRenderer from "../MarkdownRenderer";
import { ChatExtensions } from "../renderers/types";
import styles from "./MessageContent.module.less";

interface MessageContentProps {
  msg: Message;
  isEditing: boolean;
  onSaveEdit: (newContent: string) => void;
  onCancelEdit: () => void;
  onOpenCanvas: (code: string) => void;
  isUser: boolean;
  extensions?: ChatExtensions;
  t: Translations;
  onSend?: (message: string) => void;
}

export const MessageContent = memo(
  ({ msg, isEditing, onSaveEdit, onCancelEdit, onOpenCanvas, isUser, extensions, t, onSend }: MessageContentProps) => {
    const [editContent, setEditContent] = useState(msg.content);

    if (isEditing) {
      return (
        <div className={styles.editContainer}>
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className={styles.editTextarea}
            rows={3}
          />
          <div className={styles.editActions}>
            <button onClick={onCancelEdit} className={styles.cancelButton}>
              {t.common.cancel}
            </button>
            <button onClick={() => onSaveEdit(editContent)} className={styles.updateButton}>
              {t.common.update}
            </button>
          </div>
        </div>
      );
    }

    if (isUser) {
      return (
        <div className={styles.userBubble}>
          <MarkdownRenderer content={msg.content} extensions={extensions} t={t} onSend={onSend} />
        </div>
      );
    }

    return (
      <div className={styles.modelContent}>
        <MarkdownRenderer
          content={msg.content}
          onCodeBlockFound={onOpenCanvas}
          extensions={extensions}
          t={t}
          onSend={onSend}
        />
        {msg.isStreaming && !msg.isThinking && <span className={styles.cursor}></span>}
      </div>
    );
  }
);
