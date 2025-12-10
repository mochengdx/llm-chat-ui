import { Copy, Maximize2 } from "lucide-react";
import React, { memo } from "react";

const SimpleMarkdown = memo(
  ({ content, onCodeBlockFound }: { content: string; onCodeBlockFound?: (code: string) => void }) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return (
      <div className="markdown-body text-[15px] md:text-[16px] leading-7 font-light text-gray-800 dark:text-gray-200">
        {parts.map((part, index) => {
          if (part.startsWith("```")) {
            const lines = part.split("\n");
            const lang = lines[0].replace("```", "").trim();
            const code = lines.slice(1, -1).join("\n");
            return (
              <div
                key={index}
                className="my-4 rounded-xl overflow-hidden bg-gray-50 dark:bg-[#1e1f20] border border-gray-200 dark:border-[#3c4043] group relative"
              >
                <div className="flex justify-between items-center px-4 py-2 bg-gray-200 dark:bg-[#2d2e30] text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-mono">{lang || "code"}</span>
                  <div className="flex items-center gap-2">
                    {onCodeBlockFound && (
                      <button
                        onClick={() => onCodeBlockFound(code)}
                        className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                      >
                        <Maximize2 size={12} />
                        <span>Open Canvas</span>
                      </button>
                    )}
                    <div className="flex items-center gap-2 cursor-pointer hover:text-gray-900 dark:hover:text-white transition-colors">
                      <Copy size={12} />
                      <span>Copy</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="font-mono text-sm text-blue-700 dark:text-[#a8c7fa]">
                    <code>{code}</code>
                  </pre>
                </div>
              </div>
            );
          }
          const textParts = part.split(/(\*\*.*?\*\*)/g);
          return (
            <span key={index}>
              {textParts.map((t, i) => {
                if (t.startsWith("**") && t.endsWith("**"))
                  return (
                    <strong key={i} className="font-medium text-gray-900 dark:text-gray-100">
                      {t.slice(2, -2)}
                    </strong>
                  );
                return t.split("\n").map((line, j) => (
                  <React.Fragment key={`${i}-${j}`}>
                    {line}
                    {j < t.split("\n").length - 1 && <br />}
                  </React.Fragment>
                ));
              })}
            </span>
          );
        })}
      </div>
    );
  }
);

export default SimpleMarkdown;
