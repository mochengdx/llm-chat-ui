import type { UserSettings } from "@llm/core";
import { Monitor, Moon, Sun, ToggleLeft, ToggleRight } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "../../../hooks/useTranslation";

interface InterfaceTabProps {
  settings: UserSettings;
  updateSettings: (k: keyof UserSettings, v: any) => void;
}

export const InterfaceTab = memo(({ settings, updateSettings }: InterfaceTabProps) => {
  const { t } = useTranslation(settings);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {t.settings.interfaceTab.title}
        </label>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#28292a] rounded-xl border border-gray-200 dark:border-[#3c4043]">
          <div className="flex items-center gap-3">
            {settings.theme === "dark" ? (
              <Moon size={20} className="text-purple-500 dark:text-purple-400" />
            ) : (
              <Sun size={20} className="text-yellow-500 dark:text-yellow-400" />
            )}
            <div>
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {t.settings.interfaceTab.theme.title}
              </div>
              <div className="text-xs text-gray-500">{t.settings.interfaceTab.theme.desc}</div>
            </div>
          </div>
          <button
            onClick={() => updateSettings("theme", settings.theme === "dark" ? "light" : "dark")}
            className={`text-2xl ${
              settings.theme === "dark" ? "text-purple-500 dark:text-purple-400" : "text-gray-400 dark:text-gray-600"
            }`}
          >
            {settings.theme === "dark" ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
          </button>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#28292a] rounded-xl border border-gray-200 dark:border-[#3c4043]">
          <div className="flex items-center gap-3">
            <Monitor size={20} className="text-orange-500 dark:text-orange-400" />
            <div>
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {t.settings.interfaceTab.density.title}
              </div>
              <div className="text-xs text-gray-500">{t.settings.interfaceTab.density.desc}</div>
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
  );
});
