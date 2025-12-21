import React from "react";
import styles from "./Header.module.less";

const HeaderMain: React.FC<{ onSettings: () => void }> = ({ onSettings }) => (
  <div className={styles.container}>
    <h1 className={styles.title}>LLM Chat</h1>
    <button onClick={onSettings} className={styles.settingsButton}>
      Settings
    </button>
  </div>
);

export default HeaderMain;
