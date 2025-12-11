import type { Attachment } from "@llm/core";
import { File } from "lucide-react";
import { memo } from "react";

interface MessageAttachmentsProps {
  attachments?: Attachment[];
}

export const MessageAttachments = memo(({ attachments }: MessageAttachmentsProps) => {
  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="flex gap-2 mb-2">
      {attachments.map((att) => (
        <div
          key={att.id}
          className="relative group/att rounded-lg overflow-hidden border border-gray-200 dark:border-[#3c4043]"
        >
          {att.type === "image" ? (
            <img src={att.previewUrl} alt="attachment" className="h-20 w-auto object-cover" />
          ) : (
            <div className="h-20 w-20 flex items-center justify-center bg-gray-100 dark:bg-[#2d2e30]">
              <File size={24} className="text-gray-500" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
});
