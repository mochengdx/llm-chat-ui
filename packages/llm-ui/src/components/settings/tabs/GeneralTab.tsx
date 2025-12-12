import { UserSettings } from "@llm/core";
import { memo } from "react";

interface GeneralTabProps {
  settings: UserSettings;
  updateSettings: (k: keyof UserSettings, v: any) => void;
}

export const GeneralTab = memo(({ settings, updateSettings }: GeneralTabProps) => {
  return (
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
  );
});
