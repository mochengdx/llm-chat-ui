import { FileOutlined } from "@ant-design/icons";
import type { Attachment } from "@llm/core";
import { memo } from "react";
import styles from "./MessageAttachments.module.less";

interface MessageAttachmentsProps {
  attachments?: Attachment[];
}

export const MessageAttachments = memo(({ attachments }: MessageAttachmentsProps) => {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className={styles.container}>
      {attachments.map((att) => (
        <div key={att.id} className={`${styles.attachment} group/att`}>
          {att.type === "image" ? (
            <img src={att.previewUrl} alt="attachment" className={styles.image} />
          ) : (
            <div className={styles.filePlaceholder}>
              <FileOutlined style={{ fontSize: 24 }} className={styles.fileIcon} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
});
