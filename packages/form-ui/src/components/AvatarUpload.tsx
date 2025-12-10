import { User } from "lucide-react";
import React, { useRef } from "react";
import { cn } from "./base";

export interface AvatarUploadProps {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  onUpload?: (file: File) => Promise<string>;
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ value, onChange, disabled, className, onUpload }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || disabled) return;

    if (onUpload) {
      try {
        const url = await onUpload(file);
        onChange?.(url);
      } catch (error) {
        console.error("Upload failed", error);
      }
    } else {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onChange?.(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center p-4 border rounded-lg bg-gray-50 border-dashed hover:border-indigo-300 transition-colors",
        className
      )}
    >
      <div
        className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mb-2 border-2 border-white shadow-sm relative group cursor-pointer"
        onClick={() => inputRef.current?.click()}
      >
        {value ? (
          <img src={value} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <User size={32} className="text-gray-400" />
        )}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
          更换
        </div>
      </div>
      <span className="text-xs text-gray-500 font-medium">点击上传头像</span>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
      />
    </div>
  );
};
