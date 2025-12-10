import { FileCheck } from "lucide-react";
import React, { useRef } from "react";
import { cn } from "./base";

export interface DocumentUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  label?: string;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  value,
  onChange,
  disabled,
  className,
  label = "文档上传"
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && !disabled) {
      onChange?.(file.name);
    }
  };

  return (
    <div
      className={cn(
        "border border-blue-100 bg-blue-50/50 p-3 rounded-lg flex items-center justify-between group hover:bg-blue-50 transition-colors",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="bg-blue-100 p-2 rounded-lg">
          <FileCheck className="text-blue-600" size={20} />
        </div>
        <div>
          <div className="text-sm font-bold text-blue-900">{label}</div>
          <div className="text-[10px] text-blue-500">{value ? "已选择文件" : "支持 PDF, Word"}</div>
        </div>
      </div>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
        className="bg-white text-blue-600 border border-blue-200 px-4 py-1.5 rounded-md text-xs font-medium cursor-pointer hover:shadow-sm transition-all"
      >
        {value ? "重新上传" : "选择文件"}
      </button>
      <input ref={inputRef} type="file" className="hidden" onChange={handleFileChange} disabled={disabled} />
    </div>
  );
};
