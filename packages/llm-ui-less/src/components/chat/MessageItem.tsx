import type { Message } from "@llm/core";
import { memo, useState } from "react";
import { Translations } from "../../locales/en";
import { MessageActions } from "./message/MessageActions";
import { MessageAttachments } from "./message/MessageAttachments";
import { MessageAvatar } from "./message/MessageAvatar";
import { MessageContent } from "./message/MessageContent";
import { MessageHeader } from "./message/MessageHeader";
import { ThinkingProcess } from "./message/ThinkingProcess";
import styles from "./MessageItem.module.less";
import { ChatExtensions } from "./renderers/types";

const MessageItem = memo(
  ({
    msg,
    onEdit,
    onRegenerate,
    onOpenCanvas,
    extensions,
    t,
    onSend
  }: {
    msg: Message;
    onEdit: (id: string, newContent: string) => void;
    onRegenerate: () => void;
    onOpenCanvas: (code: string) => void;
    extensions?: ChatExtensions;
    t: Translations;
    onSend?: (message: string) => void;
  }) => {
    const [isEditing, setIsEditing] = useState(false);

    const handleSaveEdit = (newContent: string) => {
      setIsEditing(false);
      if (newContent !== msg.content) {
        onEdit(msg.id, newContent);
      }
    };

    const isUser = msg.role === "user";

    return (
      <div className={`${styles.container} ${isUser ? styles.user : ""} group`}>
        <div className={styles.avatarWrapper}>
          <MessageAvatar role={msg.role} modelUsed={msg.modelUsed} isStreaming={msg.isStreaming} />
        </div>
        <div className={`${styles.contentWrapper} ${isUser ? styles.user : ""}`}>
          <MessageHeader
            role={msg.role}
            modelUsed={msg.modelUsed}
            childrenIds={msg.childrenIds}
            currentChildIndex={msg.currentChildIndex}
            isUser={isUser}
            t={t}
          />
          <MessageAttachments attachments={msg.attachments} />

          {msg.role === "model" && (
            <ThinkingProcess thoughtProcess={msg.thoughtProcess} isThinking={msg.isThinking} t={t} />
          )}

          <MessageContent
            msg={msg}
            isEditing={isEditing}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={() => setIsEditing(false)}
            onOpenCanvas={onOpenCanvas}
            isUser={isUser}
            extensions={extensions}
            t={t}
            onSend={onSend}
          />

          <MessageActions
            msg={msg}
            isEditing={isEditing}
            onEditStart={() => setIsEditing(true)}
            onRegenerate={onRegenerate}
            t={t}
          />
        </div>
      </div>
    );
  }
);

export default MessageItem;
