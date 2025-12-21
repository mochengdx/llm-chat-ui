import type { UserSettings } from "@llm/core";
import { Brain, ToggleLeft, ToggleRight, Wrench } from "lucide-react";
import { memo } from "react";
import { useTranslation } from "../../../hooks/useTranslation";

interface FeaturesTabProps {
  settings: UserSettings;
  updateSettings: (k: keyof UserSettings, v: any) => void;
}

export const FeaturesTab = memo(({ settings, updateSettings }: FeaturesTabProps) => {
  const { t } = useTranslation(settings);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <label className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {t.settings.featuresTab.title}
        </label>

        {/* Thinking Process Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#28292a] rounded-xl border border-gray-200 dark:border-[#3c4043]">
          <div className="flex items-center gap-3">
            <Brain size={20} className="text-blue-500 dark:text-blue-400" />
            <div>
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {t.settings.featuresTab.thinking.title}
              </div>
              <div className="text-xs text-gray-500">{t.settings.featuresTab.thinking.desc}</div>
            </div>
          </div>
          <button
            onClick={() => updateSettings("enableThinking", !settings.enableThinking)}
            className={`text-2xl ${
              settings.enableThinking ? "text-blue-500 dark:text-blue-400" : "text-gray-400 dark:text-gray-600"
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
              <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {t.settings.featuresTab.tools.title}
              </div>
              <div className="text-xs text-gray-500">{t.settings.featuresTab.tools.desc}</div>
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
  );
});
