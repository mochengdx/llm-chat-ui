import { Code, Play, X } from "lucide-react";
import React from "react";
import type { Translations } from "../../locales/en";

interface ArtifactPanelProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  t: Translations;
}

const ArtifactPanel: React.FC<ArtifactPanelProps> = ({ isOpen, onClose, content, t }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-0 h-full w-full md:w-[500px] bg-gray-50 dark:bg-[#1e1f20] border-l border-gray-200 dark:border-[#3c4043] shadow-2xl z-40 flex flex-col animate-slide-left">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#3c4043]">
        <div className="flex items-center gap-2">
          <Code size={18} className="text-blue-500" />
          <span className="font-medium text-sm">{t.artifact.code}</span>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-200 dark:hover:bg-[#3c4043] rounded-full text-gray-500 dark:text-gray-400"
        >
          <X size={18} />
        </button>
      </div>
      <div className="flex-1 overflow-auto p-4 custom-scrollbar">
        <pre className="text-xs font-mono text-gray-800 dark:text-gray-300 whitespace-pre-wrap">{content}</pre>
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-[#3c4043] bg-white dark:bg-[#252627]">
        <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
          <Play size={16} /> {t.artifact.run}
        </button>
      </div>
    </div>
  );
};

export default ArtifactPanel;
