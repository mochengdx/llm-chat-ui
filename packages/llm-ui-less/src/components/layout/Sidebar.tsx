import {
  MenuOutlined,
  MessageOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SettingOutlined
} from "@ant-design/icons";
import type { UserSettings } from "@llm/core";
import React from "react";
import { useTranslation } from "../../hooks/useTranslation";
import styles from "./Sidebar.module.less";

const SidebarMain: React.FC<{
  isOpen: boolean;
  sessions: { id: string; title: string }[];
  currentSessionId: string | null;
  onNewChat: () => void;
  onSelect: (id: string) => void;
  onToggle: () => void;
  onOpenSettings: () => void;
  settings: UserSettings;
}> = ({ isOpen, sessions, currentSessionId, onNewChat, onSelect, onToggle, onOpenSettings, settings }) => {
  const { t } = useTranslation(settings);

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : ""}`}>
      <div className={styles.header}>
        <button onClick={onToggle} className={styles.toggleButton}>
          <MenuOutlined style={{ fontSize: 20 }} />
        </button>
      </div>
      <div className={styles.newChatContainer}>
        <button onClick={onNewChat} className={styles.newChatButton}>
          <PlusOutlined style={{ fontSize: 18 }} />
          <span>{t.sidebar.newChat}</span>
        </button>
      </div>

      <div className={`${styles.sessionList} custom-scrollbar`}>
        <div className={styles.sessionListTitle}>{t.sidebar.recent}</div>
        {sessions.map((session) => (
          <button
            key={session.id}
            onClick={() => onSelect(session.id)}
            className={`${styles.sessionItem} ${currentSessionId === session.id ? styles.active : ""}`}
          >
            <MessageOutlined
              style={{ fontSize: 16 }}
              className={`${styles.sessionIcon} ${currentSessionId === session.id ? styles.active : ""}`}
            />
            <span className={styles.sessionTitle}>{session.title}</span>
          </button>
        ))}
      </div>

      <div className={styles.footer}>
        <button className={styles.footerButton}>
          <QuestionCircleOutlined style={{ fontSize: 18 }} />
          <span>{t.sidebar.help}</span>
        </button>
        <button onClick={onOpenSettings} className={styles.footerButton}>
          <SettingOutlined style={{ fontSize: 18 }} />
          <span>{t.common.settings}</span>
        </button>
        <div className={styles.location}>
          <div className={styles.locationDot}></div>
          <span>{t.common.location}</span>
        </div>
      </div>
    </div>
  );
};

export default SidebarMain;
