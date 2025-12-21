import { BulbOutlined, CheckCircleFilled, CloseCircleFilled, ToolOutlined } from "@ant-design/icons";
import { UserSettings } from "@llm/core";
import { memo } from "react";
import { useTranslation } from "../../../hooks/useTranslation";
import styles from "./FeaturesTab.module.less";

interface FeaturesTabProps {
  settings: UserSettings;
  updateSettings: (k: keyof UserSettings, v: any) => void;
}

export const FeaturesTab = memo(({ settings, updateSettings }: FeaturesTabProps) => {
  const { t } = useTranslation(settings);

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <label className={styles.label}>{t.settings.featuresTab.title}</label>

        {/* Thinking Process Toggle */}
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <BulbOutlined className={`${styles.icon} ${styles.blue}`} />
            <div>
              <div className={styles.cardTitle}>{t.settings.featuresTab.thinking.title}</div>
              <div className={styles.cardDesc}>{t.settings.featuresTab.thinking.desc}</div>
            </div>
          </div>
          <button
            onClick={() => updateSettings("enableThinking", !settings.enableThinking)}
            className={`${styles.toggleButton} ${settings.enableThinking ? styles.active : styles.inactive}`}
          >
            {settings.enableThinking ? (
              <CheckCircleFilled style={{ fontSize: 24 }} />
            ) : (
              <CloseCircleFilled style={{ fontSize: 24 }} />
            )}
          </button>
        </div>

        {/* Advanced Tools Toggle */}
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <ToolOutlined className={`${styles.icon} ${styles.green}`} />
            <div>
              <div className={styles.cardTitle}>{t.settings.featuresTab.tools.title}</div>
              <div className={styles.cardDesc}>{t.settings.featuresTab.tools.desc}</div>
            </div>
          </div>
          <button
            onClick={() => updateSettings("enableTools", !settings.enableTools)}
            className={`${styles.toggleButton} ${
              settings.enableTools ? `${styles.active} ${styles.green}` : styles.inactive
            }`}
          >
            {settings.enableTools ? (
              <CheckCircleFilled style={{ fontSize: 24 }} />
            ) : (
              <CloseCircleFilled style={{ fontSize: 24 }} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
});
