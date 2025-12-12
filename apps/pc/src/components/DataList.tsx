import React, { useMemo } from "react";

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
    <div className="my-4 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm max-w-md">
      <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <h3 className="font-medium text-gray-900 dark:text-gray-100">{title}</h3>
        <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>

      <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="p-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-medium text-sm shrink-0">
              {idx + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                {item.title || item.name || item.label || "Item"}
              </div>
              {(item.desc || item.description || item.subtitle) && (
                <div className="text-xs text-gray-500 truncate">{item.desc || item.description || item.subtitle}</div>
              )}
            </div>
            {item.status && (
              <span
                className={`text-xs px-2 py-1 rounded ${
                  item.status === "Done" || item.status === "Completed"
                    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                {item.status}
              </span>
            )}
          </div>
        ))}
        {items.length === 0 && <div className="p-6 text-center text-gray-500 text-sm">No data to display</div>}
      </div>
      {children && (
        <div className="p-3 bg-gray-50 dark:bg-gray-900/30 text-sm text-gray-600 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700">
          {children}
        </div>
      )}
    </div>
  );
};
