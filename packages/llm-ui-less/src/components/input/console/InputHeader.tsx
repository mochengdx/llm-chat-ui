import { CompressOutlined } from "@ant-design/icons";
import { memo } from "react";
import type { Translations } from "../../../locales/en";
import styles from "./InputHeader.module.less";

interface InputHeaderProps {
  isExpanded: boolean;
  onCollapse: () => void;
  t: Translations;
}

export const InputHeader = memo(({ isExpanded, onCollapse, t }: InputHeaderProps) => {
  if (!isExpanded) return null;

  return (
    <div className={styles.container}>
      <span className={styles.title}>{t.input.fullScreen}</span>
      <button onClick={onCollapse} className={styles.collapseButton}>
        <CompressOutlined style={{ fontSize: 20 }} />
      </button>
    </div>
  );
});
