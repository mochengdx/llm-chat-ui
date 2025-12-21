import { UserSettings } from "@llm/core";
import { memo } from "react";
import { useTranslation } from "../../../hooks/useTranslation";
import styles from "./GeneralTab.module.less";

interface GeneralTabProps {
  settings: UserSettings;
  updateSettings: (k: keyof UserSettings, v: any) => void;
}

export const GeneralTab = memo(({ settings, updateSettings }: GeneralTabProps) => {
  const { t } = useTranslation(settings);

  return (
    <div className={styles.container}>
      {/* Language Selection */}
      <div className={styles.section}>
        <label className={styles.label}>{t.settings.language}</label>
        <div className={styles.grid}>
          {[
            { id: "en", label: "English" },
            { id: "zh-CN", label: "简体中文" }
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => updateSettings("language", lang.id)}
              className={`${styles.optionButton} ${settings.language === lang.id ? styles.active : styles.inactive}`}
            >
              <span className={styles.buttonLabel}>{lang.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <label className={styles.label}>{t.settings.usageMode}</label>
        <div className={styles.modeGrid}>
          {[
            { id: "general", ...t.settings.modes.general },
            { id: "developer", ...t.settings.modes.developer },
            { id: "writer", ...t.settings.modes.creative }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => updateSettings("mode", mode.id)}
              className={`${styles.modeButton} ${settings.mode === mode.id ? styles.active : styles.inactive}`}
            >
              <div className={styles.buttonLabel}>{mode.label}</div>
              <div className={styles.buttonDesc}>{mode.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
});
