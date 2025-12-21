import React from "react";
import styles from "./AppShell.module.less";

const LayoutMain: React.FC<{
  sidebar: React.ReactNode;
  header: React.ReactNode;
  main: React.ReactNode;
  footer?: React.ReactNode;
}> = ({ sidebar, header, main, footer }) => (
  <div className={styles.container}>
    <aside className={styles.sidebar}>{sidebar}</aside>
    <div className={styles.mainContent}>
      <header className={styles.header}>{header}</header>
      <main className={styles.main}>{main}</main>
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </div>
  </div>
);

export default LayoutMain;
