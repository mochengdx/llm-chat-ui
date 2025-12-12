import { UserSettings } from "@llm/core";
import { Layers, Palette, Settings, X } from "lucide-react";
import { useState } from "react";
import { FeaturesTab } from "./tabs/FeaturesTab";
import { GeneralTab } from "./tabs/GeneralTab";
import { InterfaceTab } from "./tabs/InterfaceTab";

const SettingsModal = ({
  isOpen,
  onClose,
  settings,
  updateSettings
}: {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  updateSettings: (k: keyof UserSettings, v: any) => void;
}) => {
  if (!isOpen) return null;
  const tabs = [
    { id: "general", label: "General", icon: <Settings size={16} /> },
    { id: "features", label: "Features", icon: <Layers size={16} /> },
    { id: "interface", label: "Interface", icon: <Palette size={16} /> }
  ];
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in text-gray-900 dark:text-gray-100">
      <div className="w-full max-w-2xl bg-white dark:bg-[#1e1f20] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#3c4043] overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[600px]">
        <div className="w-full md:w-60 bg-gray-50 dark:bg-[#252627] border-b md:border-b-0 md:border-r border-gray-200 dark:border-[#3c4043] p-4 flex flex-col shrink-0">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4 md:mb-6 px-2">Settings</h2>
          <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 md:w-full flex items-center justify-center md:justify-start gap-2 md:gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors shrink-0 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-gray-200 dark:bg-[#3c4043] text-gray-900 dark:text-white"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#3c4043]/50"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-[#1e1f20]">
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-[#3c4043]">
            <h3 className="text-xl font-medium text-gray-800 dark:text-gray-100">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-[#3c4043] rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
            {activeTab === "general" && <GeneralTab settings={settings} updateSettings={updateSettings} />}
            {activeTab === "features" && <FeaturesTab settings={settings} updateSettings={updateSettings} />}
            {activeTab === "interface" && <InterfaceTab settings={settings} updateSettings={updateSettings} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
