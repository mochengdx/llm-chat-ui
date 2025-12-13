import type { TriggerItem } from "@llm/core";
import { AtSign, Hash } from "lucide-react";
import { memo } from "react";
import { Translations } from "../../../locales/en";

interface InputSuggestionsProps {
  triggerType: "@" | "#" | null;
  suggestions: TriggerItem[];
  onSelect: (item: TriggerItem) => void;
  t: Translations;
}

export const InputSuggestions = memo(({ triggerType, suggestions, onSelect, t }: InputSuggestionsProps) => {
  if (!triggerType) return null;

  return (
    <div className="absolute bottom-full left-4 mb-2 w-64 bg-white dark:bg-[#252627] border border-gray-200 dark:border-[#3c4043] rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-0.5 animate-scale-up overflow-hidden">
      <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-200 dark:border-[#3c4043]/50 flex items-center gap-2">
        {triggerType === "@" ? <AtSign size={12} /> : <Hash size={12} />}
        <span>{triggerType === "@" ? t.common.mention : t.common.tag}</span>
      </div>
      <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
        {suggestions.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-700 dark:text-gray-300 text-sm transition-colors text-left"
          >
            <div className="shrink-0">{item.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 dark:text-gray-200">{item.label}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});
