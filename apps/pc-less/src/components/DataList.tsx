import React, { useMemo } from "react";
import styles from "./DataList.module.less";

/**
 * DataList Component
 *
 * Usage Example:
 * ::data-list[Project Status Overview]{title="Q4 Deliverables" data='[{"title": "Frontend Migration", "status": "Done", "desc": "Migrated to React 18"}, {"title": "Backend API", "status": "In Progress", "desc": "Implementing GraphQL endpoints"}, {"title": "Documentation", "status": "Pending", "desc": "Update API docs"}]'}
 */
interface DataListProps {
  title?: string;
  data?: string; // Expecting JSON string array
  children?: React.ReactNode;
  [key: string]: any;
}

export const DataList: React.FC<DataListProps> = ({ title = "Data List", data = "[]", children }) => {
  const items = useMemo(() => {
    try {
      // Handle potential single quotes or unquoted keys if user writes loose JSON (though standard JSON is strict)
      // For now, assume standard JSON.
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn("DataList: Failed to parse data JSON", e);
      return [];
    }
  }, [data]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        <span className={styles.count}>{items.length}</span>
      </div>

      <div className={styles.list}>
        {items.map((item, idx) => (
          <div key={idx} className={styles.item}>
            <div className={styles.index}>{idx + 1}</div>
            <div className={styles.content}>
              <div className={styles.itemTitle}>{item.title || item.name || item.label || "Item"}</div>
              {item.desc && <div className={styles.itemDesc}>{item.desc}</div>}
            </div>
            {item.status && <div className={styles.status}>{item.status}</div>}
          </div>
        ))}
        {items.length === 0 && <div className={styles.empty}>No data to display</div>}
      </div>
      {children && <div className={styles.footer}>{children}</div>}
    </div>
  );
};
