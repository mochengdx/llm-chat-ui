import { FileCheck, FileText, Image as ImageIcon, Upload, X } from "lucide-react";
import React, { useRef } from "react";
import { cn } from "./base";

export interface FileUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  disabled?: boolean;
  className?: string;
  uploading?: boolean;
  onUpload?: (file: File) => Promise<string>;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  value,
  onChange,
  accept,
  maxSize = 5,
  disabled,
  className,
  uploading,
  onUpload
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || disabled) return;

    if (maxSize && file.size > maxSize * 1024 * 1024) {
      alert(`文件大小不能超过 ${maxSize}MB`);
      return;
    }

    if (onUpload) {
      try {
        const url = await onUpload(file);
        onChange?.(url);
      } catch (error) {
        console.error("Upload failed", error);
      }
    } else {
      // Default mock behavior if no handler provided
      const fakeUrl = URL.createObjectURL(file);
      onChange?.(fakeUrl);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={cn("w-full", className)}>
      {!value ? (
        <div
          onClick={() => !disabled && inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center gap-2 transition-colors bg-gray-50",
            !disabled && "cursor-pointer hover:border-indigo-500 hover:bg-indigo-50",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
            disabled={disabled}
          />
          <div className="p-3 bg-white rounded-full shadow-sm">
            <Upload className={cn("w-6 h-6", disabled ? "text-gray-300" : "text-indigo-600")} />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700">{uploading ? "上传中..." : "点击上传文件"}</p>
            <p className="text-xs text-gray-400 mt-1">
              支持 {accept || "所有文件"} (最大 {maxSize}MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="relative group border border-gray-200 rounded-lg p-3 flex items-center gap-3 bg-white hover:shadow-sm transition-shadow">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
            {value.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
              <ImageIcon className="w-5 h-5 text-indigo-600" />
            ) : (
              <FileText className="w-5 h-5 text-indigo-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-700 truncate">{value.split("/").pop() || "已上传文件"}</p>
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
            >
              <FileCheck size={12} /> 查看文件
            </a>
          </div>
          {!disabled && (
            <button
              onClick={handleClear}
              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
