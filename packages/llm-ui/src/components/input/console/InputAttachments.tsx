import type { Attachment } from "@llm/core";
import { FileText, X } from "lucide-react";
import { memo } from "react";

interface InputAttachmentsProps {
  attachments: Attachment[];
  onRemove: (id: string) => void;
}

export const InputAttachments = memo(({ attachments, onRemove }: InputAttachmentsProps) => {
  if (attachments.length === 0) return null;

  return (
    <div className="flex gap-3 px-4 pt-3 overflow-x-auto">
      {attachments.map((att) => (
        <div key={att.id} className="relative group/preview">
          <div className="h-16 w-16 rounded-lg overflow-hidden border border-gray-300 dark:border-[#3c4043] flex items-center justify-center bg-gray-100 dark:bg-[#1e1f20]">
            {att.type === "image" ? (
              <img src={att.previewUrl} className="h-full w-full object-cover" alt="attachment" />
            ) : (
              <FileText size={24} className="text-gray-500" />
            )}
          </div>
          <button
            onClick={() => onRemove(att.id)}
            className="absolute -top-1 -right-1 bg-gray-800 text-white rounded-full p-0.5 shadow-md opacity-0 group-hover/preview:opacity-100 transition-opacity"
          >
            <X size={12} />
          </button>
        </div>
      ))}
    </div>
  );
});
