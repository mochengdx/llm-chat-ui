import { CheckCircleFilled, CloseCircleFilled, DesktopOutlined, MoonOutlined, SunOutlined } from "@ant-design/icons";
import type { UserSettings } from "@llm/core";
import { memo } from "react";
import { useTranslation } from "../../../hooks/useTranslation";
import styles from "./InterfaceTab.module.less";

interface InterfaceTabProps {
  settings: UserSettings;
  updateSettings: (k: keyof UserSettings, v: any) => void;
}

export const InterfaceTab = memo(({ settings, updateSettings }: InterfaceTabProps) => {
  const { t } = useTranslation(settings);

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <label className={styles.label}>{t.settings.interfaceTab.title}</label>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            {settings.theme === "dark" ? (
              <MoonOutlined className={`${styles.icon} ${styles.purple}`} />
            ) : (
              <SunOutlined className={`${styles.icon} ${styles.yellow}`} />
            )}
            <div>
              <div className={styles.cardTitle}>{t.settings.interfaceTab.theme.title}</div>
              <div className={styles.cardDesc}>{t.settings.interfaceTab.theme.desc}</div>
            </div>
          </div>
          <button
            onClick={() => updateSettings("theme", settings.theme === "dark" ? "light" : "dark")}
            className={`${styles.toggleButton} ${
              settings.theme === "dark" ? `${styles.active} ${styles.purple}` : styles.inactive
            }`}
          >
            {settings.theme === "dark" ? (
              <CheckCircleFilled style={{ fontSize: 24 }} />
            ) : (
              <CloseCircleFilled style={{ fontSize: 24 }} />
            )}
          </button>
        </div>
        <div className={styles.card}>
          <div className={styles.cardContent}>
            <DesktopOutlined className={`${styles.icon} ${styles.orange}`} />
            <div>
              <div className={styles.cardTitle}>{t.settings.interfaceTab.density.title}</div>
              <div className={styles.cardDesc}>{t.settings.interfaceTab.density.desc}</div>
            </div>
          </div>
          <button
            onClick={() => updateSettings("denseMode", !settings.denseMode)}
            className={`${styles.toggleButton} ${
              settings.denseMode ? `${styles.active} ${styles.orange}` : styles.inactive
            }`}
          >
            {settings.denseMode ? (
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
