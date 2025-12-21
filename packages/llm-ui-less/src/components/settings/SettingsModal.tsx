import { AppstoreOutlined, BgColorsOutlined, CloseOutlined, SettingOutlined } from "@ant-design/icons";
import type { UserSettings } from "@llm/core";
import { useState } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import styles from "./SettingsModal.module.less";
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
  const { t } = useTranslation(settings);
  const tabs = [
    { id: "general", label: t.settings.general, icon: <SettingOutlined style={{ fontSize: 16 }} /> },
    { id: "features", label: t.settings.features, icon: <AppstoreOutlined style={{ fontSize: 16 }} /> },
    { id: "interface", label: t.settings.interface, icon: <BgColorsOutlined style={{ fontSize: 16 }} /> }
  ];
  const [activeTab, setActiveTab] = useState("general");

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.sidebar}>
          <h2 className={styles.sidebarTitle}>{t.common.settings}</h2>
          <div className={`${styles.tabs} no-scrollbar`}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : styles.inactive}`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className={styles.content}>
          <div className={styles.header}>
            <h3 className={styles.headerTitle}>{tabs.find((t) => t.id === activeTab)?.label}</h3>
            <button onClick={onClose} className={styles.closeButton}>
              <CloseOutlined style={{ fontSize: 20 }} />
            </button>
          </div>
          <div className={`${styles.body} custom-scrollbar`}>
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
