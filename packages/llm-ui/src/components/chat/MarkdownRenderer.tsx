import { Copy, Maximize2 } from "lucide-react";
import { memo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import { Translations } from "../../locales/en";
import remarkDirectiveRehype from "./plugins/remarkDirectiveRehype";
import { RENDERER_REGISTRY } from "./renderers";
import { ChatExtensions } from "./renderers/types";

/**
 * MarkdownRenderer Component
 * Markdown 渲染组件
 *
 * Uses react-markdown to render Markdown content with support for GFM (GitHub Flavored Markdown)
 * and syntax highlighting for code blocks.
 * 使用 react-markdown 渲染 Markdown 内容，支持 GFM（GitHub 风格 Markdown）和代码块语法高亮。
 */
const MarkdownRenderer = memo(
  ({
    content,
    onCodeBlockFound,
    extensions,
    t,
    onSend
  }: {
    content: string;
    onCodeBlockFound?: (code: string) => void;
    extensions?: ChatExtensions;
    t?: Translations;
    onSend?: (message: string) => void;
  }) => {
    return (
      <div className="markdown-body text-[15px] md:text-[16px] leading-7 font-light text-gray-800 dark:text-gray-200">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkDirective, remarkDirectiveRehype]}
          components={{
            // Generic handler for custom directives from extensions
            ...Object.keys(extensions?.directiveComponents || {}).reduce(
              (acc, key) => {
                acc[key] = ({ node, ...props }: { node: any; [key: string]: any }) => {
                  const Component = extensions!.directiveComponents![key];
                  return <Component node={node} {...props} onSend={onSend} />;
                };
                return acc;
              },
              {} as Record<string, React.FC<any>>
            ),
            code({
              node,
              inline,
              className,
              children,
              ...props
            }: {
              node?: any;
              inline?: boolean;
              className?: string;
              children?: React.ReactNode;
            } & React.HTMLAttributes<HTMLElement>) {
              const match = /language-(\w+)/.exec(className || "");
              const codeContent = String(children).replace(/\n$/, "");
              const isMultiLine = !inline && match;
              const language = match?.[1]?.toLowerCase();

              // Check for custom renderer from extensions first
              if (isMultiLine && language && extensions?.codeBlockRenderers?.[language]) {
                const Renderer = extensions.codeBlockRenderers[language];
                return <Renderer content={codeContent} language={language} t={t} onSend={onSend} />;
              }

              // Check for built-in custom renderer
              if (isMultiLine && language && RENDERER_REGISTRY[language]) {
                const Renderer = RENDERER_REGISTRY[language];
                return <Renderer content={codeContent} language={language} t={t} onSend={onSend} />;
              }

              if (!isMultiLine) {
                return (
                  <code
                    className={`${className} bg-gray-100 dark:bg-[#2d2e30] px-1.5 py-0.5 rounded text-sm`}
                    {...props}
                  >
                    {children}
                  </code>
                );
              }

              return (
                <div className="my-4 rounded-xl overflow-hidden bg-gray-50 dark:bg-[#1e1f20] border border-gray-200 dark:border-[#3c4043] group relative">
                  <div className="flex justify-between items-center px-4 py-2 bg-gray-200 dark:bg-[#2d2e30] text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-mono">{match?.[1] || "code"}</span>
                    <div className="flex items-center gap-2">
                      {onCodeBlockFound && (
                        <button
                          onClick={() => onCodeBlockFound(codeContent)}
                          className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                          title={t?.common.openCanvas || "Open Canvas"}
                        >
                          <Maximize2 size={12} />
                          <span className="hidden sm:inline">{t?.common.openCanvas || "Open Canvas"}</span>
                        </button>
                      )}
                      <button
                        onClick={() => navigator.clipboard.writeText(codeContent)}
                        className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                        title={t?.common.copyCode || "Copy Code"}
                      >
                        <Copy size={12} />
                        <span className="hidden sm:inline">{t?.common.copy || "Copy"}</span>
                      </button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <SyntaxHighlighter
                      // Cast to any to satisfy differing style type definitions between
                      // react-syntax-highlighter and the imported theme object.
                      style={vscDarkPlus as any}
                      language={match?.[1]}
                      PreTag="div"
                      customStyle={{ margin: 0, padding: "1rem", background: "transparent" }}
                      {...props}
                    >
                      {codeContent}
                    </SyntaxHighlighter>
                  </div>
                </div>
              );
            },
            // Custom rendering for images to ensure they are responsive
            // 自定义图片渲染以确保响应式
            img({ node, ...props }) {
              return <img {...props} className="max-w-full h-auto rounded-lg my-2 shadow-sm" />;
            },
            // Custom rendering for links to open in new tab
            // 自定义链接渲染以在新标签页打开
            a({ node, ...props }) {
              return (
                <a
                  {...props}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                />
              );
            },
            // Custom rendering for tables
            // 自定义表格渲染
            table({ node, ...props }) {
              return (
                <div className="overflow-x-auto my-4">
                  <table
                    className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg"
                    {...props}
                  />
                </div>
              );
            },
            th({ node, ...props }) {
              return (
                <th
                  className="px-3 py-2 bg-gray-50 dark:bg-[#2d2e30] text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                  {...props}
                />
              );
            },
            td({ node, ...props }) {
              return (
                <td
                  className="px-3 py-2 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700"
                  {...props}
                />
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }
);

export default MarkdownRenderer;
