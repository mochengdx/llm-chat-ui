import { Minimize2 } from "lucide-react";
import { memo } from "react";
import type { Translations } from "../../../locales/en";

interface InputHeaderProps {
  isExpanded: boolean;
  onCollapse: () => void;
  t: Translations;
}

export const InputHeader = memo(({ isExpanded, onCollapse, t }: InputHeaderProps) => {
  if (!isExpanded) return null;

  return (
    <div className="flex justify-between items-center mb-4">
      <span className="text-lg font-medium">{t.input.fullScreen}</span>
      <button onClick={onCollapse} className="p-2 hover:bg-gray-200 dark:hover:bg-[#3c4043] rounded-full">
        <Minimize2 size={20} />
      </button>
    </div>
  );
});
