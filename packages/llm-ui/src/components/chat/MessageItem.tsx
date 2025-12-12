import type { Message } from "@llm/core";
import { memo, useState } from "react";
import { MessageActions } from "./message/MessageActions";
import { MessageAttachments } from "./message/MessageAttachments";
import { MessageAvatar } from "./message/MessageAvatar";
import { MessageContent } from "./message/MessageContent";
import { MessageHeader } from "./message/MessageHeader";
import { ThinkingProcess } from "./message/ThinkingProcess";
import { ChatExtensions } from "./renderers/types";

const MessageItem = memo(
  ({
    msg,
    onEdit,
    onRegenerate,
    onOpenCanvas,
    extensions
  }: {
    msg: Message;
    onEdit: (id: string, newContent: string) => void;
    onRegenerate: () => void;
    onOpenCanvas: (code: string) => void;
    extensions?: ChatExtensions;
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
      <div className={`group flex gap-4 animate-fade-in w-full max-w-3xl mx-auto ${isUser ? "flex-row-reverse" : ""}`}>
        <div className="shrink-0 mt-1">
          <MessageAvatar role={msg.role} modelUsed={msg.modelUsed} />
        </div>
        <div className={`flex-1 min-w-0 space-y-2 ${isUser ? "flex flex-col items-end" : ""}`}>
          <MessageHeader
            role={msg.role}
            modelUsed={msg.modelUsed}
            childrenIds={msg.childrenIds}
            currentChildIndex={msg.currentChildIndex}
            isUser={isUser}
          />

          <MessageAttachments attachments={msg.attachments} />

          {msg.role === "model" && <ThinkingProcess thoughtProcess={msg.thoughtProcess} isThinking={msg.isThinking} />}

          <MessageContent
            msg={msg}
            isEditing={isEditing}
            onSaveEdit={handleSaveEdit}
            onCancelEdit={() => setIsEditing(false)}
            onOpenCanvas={onOpenCanvas}
            isUser={isUser}
            extensions={extensions}
          />

          <MessageActions
            msg={msg}
            isEditing={isEditing}
            onEditStart={() => setIsEditing(true)}
            onRegenerate={onRegenerate}
          />
        </div>
      </div>
    );
  }
);

export default MessageItem;
