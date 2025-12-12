import { Minimize2 } from "lucide-react";
import { memo } from "react";

interface InputHeaderProps {
  isExpanded: boolean;
  onCollapse: () => void;
}

export const InputHeader = memo(({ isExpanded, onCollapse }: InputHeaderProps) => {
  if (!isExpanded) return null;

  return (
    <div className="flex justify-between items-center mb-4">
      <span className="text-lg font-medium">Edit Message</span>
      <button onClick={onCollapse} className="p-2 hover:bg-gray-200 dark:hover:bg-[#3c4043] rounded-full">
        <Minimize2 size={20} />
      </button>
    </div>
  );
});
