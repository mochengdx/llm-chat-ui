import type { UserSettings } from "@llm/core";
import { memo } from "react";
import { useTranslation } from "../../../hooks/useTranslation";

interface GeneralTabProps {
  settings: UserSettings;
  updateSettings: (k: keyof UserSettings, v: any) => void;
}

export const GeneralTab = memo(({ settings, updateSettings }: GeneralTabProps) => {
  const { t } = useTranslation(settings);

  return (
    <div className="space-y-6">
      {/* Language Selection */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {t.settings.language}
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: "en", label: "English" },
            { id: "zh-CN", label: "简体中文" }
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => updateSettings("language", lang.id)}
              className={`p-3 rounded-xl border text-center transition-all ${
                settings.language === lang.id
                  ? "bg-blue-50 dark:bg-[#004a77] border-blue-200 dark:border-[#7fcfff] text-blue-700 dark:text-[#c2e7ff]"
                  : "bg-gray-50 dark:bg-[#28292a] border-gray-200 dark:border-[#3c4043] text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500"
              }`}
            >
              <span className="font-medium text-sm">{lang.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {t.settings.usageMode}
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: "general", ...t.settings.modes.general },
            { id: "developer", ...t.settings.modes.developer },
            { id: "writer", ...t.settings.modes.creative }
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
  );
});
