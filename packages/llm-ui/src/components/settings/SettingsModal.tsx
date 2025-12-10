import { UserSettings } from "@llm/core";
import { Brain, Layers, Monitor, Moon, Palette, Settings, Sun, ToggleLeft, ToggleRight, Wrench, X } from "lucide-react";
import { useState } from "react";

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
      <div className="w-full max-w-2xl bg-white dark:bg-[#1e1f20] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#3c4043] overflow-hidden flex flex-col md:flex-row h-[500px] md:h-[600px]">
        <div className="w-full md:w-60 bg-gray-50 dark:bg-[#252627] border-b md:border-b-0 md:border-r border-gray-200 dark:border-[#3c4043] p-4 flex flex-col">
          <h2 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-6 px-2">Settings</h2>
          <div className="space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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
            {activeTab === "general" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Usage Mode
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {[
                      { id: "general", label: "General", desc: "Standard experience" },
                      { id: "developer", label: "Developer", desc: "Code & Tools focused" },
                      { id: "writer", label: "Creative", desc: "Minimalist interface" }
                    ].map((mode) => (
                      <button
                        key={mode.id}
                        onClick={() => updateSettings("mode", mode.id)}
                        className={`p-4 rounded-xl border text-left transition-all ${
                          settings.mode === mode.id
                            ? "bg-blue-50 dark:bg-[#004a77] border-blue-200 dark:border-[#7fcfff] text-blue-700 dark:text-[#c2e7ff]"
                            : "bg-gray-50 dark:bg-[#28292a] border-gray-200 dark:border-[#3c4043] text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
                        }`}
                      >
                        <div className="font-medium text-sm">{mode.label}</div>
                        <div className="text-xs opacity-70 mt-1">{mode.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === "features" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Capabilities
                  </label>

                  {/* Thinking Process Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#28292a] rounded-xl border border-gray-200 dark:border-[#3c4043]">
                    <div className="flex items-center gap-3">
                      <Brain size={20} className="text-blue-500 dark:text-blue-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Thinking Process</div>
                        <div className="text-xs text-gray-500">Show internal reasoning steps</div>
                      </div>
                    </div>
                    <button
                      onClick={() => updateSettings("enableThinking", !settings.enableThinking)}
                      className={`text-2xl ${
                        settings.enableThinking
                          ? "text-blue-500 dark:text-blue-400"
                          : "text-gray-400 dark:text-gray-600"
                      }`}
                    >
                      {settings.enableThinking ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>

                  {/* Advanced Tools Toggle */}
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#28292a] rounded-xl border border-gray-200 dark:border-[#3c4043]">
                    <div className="flex items-center gap-3">
                      <Wrench size={20} className="text-green-500 dark:text-green-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Advanced Tools</div>
                        <div className="text-xs text-gray-500">Enable Deep Research, Python exec, etc</div>
                      </div>
                    </div>
                    <button
                      onClick={() => updateSettings("enableTools", !settings.enableTools)}
                      className={`text-2xl ${
                        settings.enableTools ? "text-green-500 dark:text-green-400" : "text-gray-400 dark:text-gray-600"
                      }`}
                    >
                      {settings.enableTools ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "interface" && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Theme & Layout
                  </label>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#28292a] rounded-xl border border-gray-200 dark:border-[#3c4043]">
                    <div className="flex items-center gap-3">
                      {settings.theme === "dark" ? (
                        <Moon size={20} className="text-purple-500 dark:text-purple-400" />
                      ) : (
                        <Sun size={20} className="text-yellow-500 dark:text-yellow-400" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Dark Mode</div>
                        <div className="text-xs text-gray-500">Toggle theme</div>
                      </div>
                    </div>
                    <button
                      onClick={() => updateSettings("theme", settings.theme === "dark" ? "light" : "dark")}
                      className={`text-2xl ${
                        settings.theme === "dark"
                          ? "text-purple-500 dark:text-purple-400"
                          : "text-gray-400 dark:text-gray-600"
                      }`}
                    >
                      {settings.theme === "dark" ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#28292a] rounded-xl border border-gray-200 dark:border-[#3c4043]">
                    <div className="flex items-center gap-3">
                      <Monitor size={20} className="text-orange-500 dark:text-orange-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">Compact Density</div>
                        <div className="text-xs text-gray-500">Reduce spacing</div>
                      </div>
                    </div>
                    <button
                      onClick={() => updateSettings("denseMode", !settings.denseMode)}
                      className={`text-2xl ${
                        settings.denseMode ? "text-orange-500 dark:text-orange-400" : "text-gray-400 dark:text-gray-600"
                      }`}
                    >
                      {settings.denseMode ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
