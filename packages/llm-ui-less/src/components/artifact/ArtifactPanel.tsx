import { CloseOutlined, CodeOutlined, PlayCircleOutlined } from "@ant-design/icons";
import React from "react";
import { Translations } from "../../locales/en";
import styles from "./ArtifactPanel.module.less";

interface ArtifactPanelProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  t: Translations;
}

const ArtifactPanel: React.FC<ArtifactPanelProps> = ({ isOpen, onClose, content, t }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <CodeOutlined style={{ fontSize: 18 }} className={styles.headerIcon} />
          <span className={styles.headerText}>{t.artifact.code}</span>
        </div>
        <button onClick={onClose} className={styles.closeButton}>
          <CloseOutlined style={{ fontSize: 18 }} />
        </button>
      </div>
      <div className={`${styles.content} custom-scrollbar`}>
        <pre className={styles.codeBlock}>{content}</pre>
      </div>
      <div className={styles.footer}>
        <button className={styles.runButton}>
          <PlayCircleOutlined style={{ fontSize: 16 }} /> {t.artifact.run}
        </button>
      </div>
    </div>
  );
};

export default ArtifactPanel;
