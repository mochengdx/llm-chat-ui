import { Maximize2 } from "lucide-react";
import type { RefObject } from "react";
import { memo } from "react";
import type { Translations } from "../../../locales/en";

interface InputTextAreaProps {
  input: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSend: () => void;
  inputRef: RefObject<HTMLTextAreaElement>;
  isExpanded: boolean;
  onExpand: () => void;
  denseMode?: boolean;
  triggerType: string | null;
  t: Translations;
}

export const InputTextArea = memo(
  ({ input, onChange, onSend, inputRef, isExpanded, onExpand, denseMode, triggerType, t }: InputTextAreaProps) => {
    return (
      <div
        className={`flex items-start w-full px-4 ${isExpanded ? "flex-1 py-4" : denseMode ? "py-2 min-h-[48px]" : "py-3 min-h-[56px]"}`}
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={onChange}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !triggerType) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder={t.input.placeholder}
          className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-[#e3e3e3] placeholder-gray-500 text-base resize-none custom-scrollbar h-full w-full"
          style={{
            minHeight: isExpanded ? "100%" : "24px",
            maxHeight: isExpanded ? "none" : "200px"
          }}
        />
        {!isExpanded && (
          <button
            onClick={onExpand}
            className="ml-2 mt-1 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            title={t.input.fullScreen}
          >
            <Maximize2 size={14} />
          </button>
        )}
      </div>
    );
  }
);
