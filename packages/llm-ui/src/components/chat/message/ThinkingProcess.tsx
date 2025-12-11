import { Brain, ChevronDown, ChevronRight, Loader2 } from "lucide-react";
import { memo, useEffect, useState } from "react";

interface ThinkingProcessProps {
  thoughtProcess?: string;
  isThinking?: boolean;
}

export const ThinkingProcess = memo(({ thoughtProcess, isThinking }: ThinkingProcessProps) => {
  const [isThoughtOpen, setThoughtOpen] = useState(false);

  useEffect(() => {
    if (isThinking) setThoughtOpen(true);
  }, [isThinking]);

  if (!thoughtProcess) return null;

  return (
    <div className="mb-3 rounded-xl bg-gray-50 dark:bg-[#1e1f20] border border-gray-200 dark:border-[#3c4043]/60 overflow-hidden">
      <button
        onClick={() => setThoughtOpen(!isThoughtOpen)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-[#252627] hover:bg-gray-200 dark:hover:bg-[#2d2e30] transition-colors text-left"
      >
        {isThoughtOpen ? (
          <ChevronDown size={14} className="text-gray-500" />
        ) : (
          <ChevronRight size={14} className="text-gray-500" />
        )}
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400">
          <Brain
            size={12}
            className={isThinking ? "text-blue-500 dark:text-blue-400 animate-pulse" : "text-gray-500"}
          />
          <span>Thinking Process</span>
        </div>
        {isThinking && (
          <span className="ml-auto flex items-center gap-1 text-[10px] text-blue-600/80 dark:text-blue-400/80 font-mono">
            Thinking <Loader2 size={10} className="animate-spin" />
          </span>
        )}
      </button>
      {isThoughtOpen && (
        <div className="px-4 py-3 text-xs text-gray-700 dark:text-gray-300 font-mono leading-relaxed border-t border-gray-200 dark:border-[#3c4043]/30 bg-white dark:bg-[#1a1b1c] animate-slide-down">
          {thoughtProcess}
          {isThinking && (
            <span className="inline-block w-1.5 h-3 bg-blue-500/50 ml-1 animate-pulse align-middle"></span>
          )}
        </div>
      )}
    </div>
  );
});
