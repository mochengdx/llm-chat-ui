import { CloseOutlined, FileTextOutlined } from "@ant-design/icons";
import type { Attachment } from "@llm/core";
import { memo } from "react";
import styles from "./InputAttachments.module.less";

interface InputAttachmentsProps {
  attachments: Attachment[];
  onRemove: (id: string) => void;
}

export const InputAttachments = memo(({ attachments, onRemove }: InputAttachmentsProps) => {
  if (attachments.length === 0) return null;

  return (
    <div className={styles.container}>
      {attachments.map((att) => (
        <div key={att.id} className={`${styles.item} item`}>
          <div className={styles.preview}>
            {att.type === "image" ? (
              <img src={att.previewUrl} className={styles.image} alt="attachment" />
            ) : (
              <FileTextOutlined style={{ fontSize: 24 }} className={styles.icon} />
            )}
          </div>
          <button onClick={() => onRemove(att.id)} className={styles.removeButton}>
            <CloseOutlined style={{ fontSize: 12 }} />
          </button>
        </div>
      ))}
    </div>
  );
});
