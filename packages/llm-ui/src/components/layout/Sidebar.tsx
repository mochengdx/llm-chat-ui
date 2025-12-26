import type { UserSettings } from "@llm/core";
import { HelpCircle, Menu, MessageSquare, Plus, Settings, Trash2 } from "lucide-react";
import React from "react";
import { useTranslation } from "../../hooks/useTranslation";

const SidebarMain: React.FC<{
  isOpen: boolean;
  sessions: { id: string; title: string }[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onToggle: () => void;
  onOpenSettings: () => void;
  settings: UserSettings;
}> = ({ isOpen, sessions, currentSessionId, onNewChat, onSelect, onDelete, onToggle, onOpenSettings, settings }) => {
  const { t } = useTranslation(settings);

  return (
    <div
      className={`${
        isOpen ? "w-[280px]" : "w-0"
      } bg-gray-50 dark:bg-[#1e1f20] flex flex-col transition-all duration-300 overflow-hidden border-r border-gray-200 dark:border-[#3c4043] relative shrink-0`}
    >
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={onToggle}
          className="p-2 hover:bg-gray-200 dark:hover:bg-[#3c4043] rounded-full text-gray-500 dark:text-gray-400"
        >
          <Menu size={20} />
        </button>
      </div>
      <div className="px-4 pb-4">
        <button
          onClick={onNewChat}
          className="flex items-center gap-3 px-4 py-3 bg-gray-200 dark:bg-[#2d2e30] hover:bg-gray-300 dark:hover:bg-[#3c4043] rounded-full text-sm font-medium text-gray-600 dark:text-gray-200 transition-colors w-full"
        >
          <Plus size={18} />
          <span>{t.sidebar.newChat}</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 custom-scrollbar">
        <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400">{t.sidebar.recent}</div>
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelect(session.id)}
            className={`w-full flex items-center gap-3 px-4 py-2 rounded-full text-sm text-left transition-colors group ${
              currentSessionId === session.id
                ? "bg-blue-100 dark:bg-[#004a77] text-gray-900 dark:text-gray-100"
                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d2e30]"
            }`}
          >
            <MessageSquare
              size={16}
              className={currentSessionId === session.id ? "text-blue-600 dark:text-blue-300" : "text-gray-500"}
            />
            <span className="truncate">{session.title}</span>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(session.id);
              }}
              aria-label="Delete session"
              title="Delete"
              className="ml-auto p-1.5 rounded-full opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto hover:bg-gray-200 dark:hover:bg-[#3c4043] text-gray-500 dark:text-gray-300"
            >
              <Trash2 size={16} />
            </button>
          </button>
        ))}
      </div>

      <div className="p-2 border-t border-gray-200 dark:border-[#3c4043]">
        <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d2e30] transition-colors">
          <HelpCircle size={18} />
          <span>{t.sidebar.help}</span>
        </button>
        {/* <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d2e30] transition-colors">
          <Activity size={18} />
          <span>{t.sidebar.activity}</span>
        </button> */}
        <button
          onClick={onOpenSettings}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2d2e30] transition-colors"
        >
          <Settings size={18} />
          <span>{t.common.settings}</span>
        </button>
        <div className="mt-2 px-4 py-2 text-xs text-gray-500 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span>{t.common.location}</span>
        </div>
      </div>
    </div>
  );
};

export default SidebarMain;
