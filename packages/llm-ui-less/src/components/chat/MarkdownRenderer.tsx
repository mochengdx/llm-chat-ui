import { CopyOutlined, ExpandOutlined } from "@ant-design/icons";
import { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkDirective from "remark-directive";
import remarkGfm from "remark-gfm";
import { Translations } from "../../locales/en";
import styles from "./MarkdownRenderer.module.less";
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
    const components = useMemo(() => {
      const directiveComponents = extensions?.directiveComponents || {};

      return {
        // Generic handler for custom directives from extensions
        ...Object.keys(directiveComponents).reduce(
          (acc, key) => {
            acc[key] = ({ node, ...props }: { node: any; [key: string]: any }) => {
              const Component = directiveComponents[key];
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
              <code className={`${className} ${styles.inlineCode}`} {...props}>
                {children}
              </code>
            );
          }

          return (
            <div className={`${styles.codeBlock} group`}>
              <div className={styles.codeHeader}>
                <span className={styles.language}>{match?.[1] || "code"}</span>
                <div className={styles.actions}>
                  {onCodeBlockFound && (
                    <button
                      onClick={() => onCodeBlockFound(codeContent)}
                      className={styles.actionButton}
                      title={t?.common.openCanvas || "Open Canvas"}
                    >
                      <ExpandOutlined style={{ fontSize: 12 }} />
                      <span className={styles.actionText}>{t?.common.openCanvas || "Open Canvas"}</span>
                    </button>
                  )}
                  <button
                    onClick={() => navigator.clipboard.writeText(codeContent)}
                    className={styles.actionButton}
                    title={t?.common.copyCode || "Copy Code"}
                  >
                    <CopyOutlined style={{ fontSize: 12 }} />
                    <span className={styles.actionText}>{t?.common.copy || "Copy"}</span>
                  </button>
                </div>
              </div>
              <div className={styles.codeContent}>
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
        img({ node, ...props }: any) {
          return <img {...props} className={styles.image} />;
        },
        // Custom rendering for links to open in new tab
        // 自定义链接渲染以在新标签页打开
        a({ node, ...props }: any) {
          return <a {...props} target="_blank" rel="noopener noreferrer" className={styles.link} />;
        },
        // Custom rendering for tables
        // 自定义表格渲染
        table({ node, ...props }: any) {
          return (
            <div className={styles.tableWrapper}>
              <table className={styles.table} {...props} />
            </div>
          );
        },
        th({ node, ...props }: any) {
          return <th className={styles.th} {...props} />;
        },
        td({ node, ...props }: any) {
          return <td className={styles.td} {...props} />;
        }
      };
    }, [extensions, t, onSend, onCodeBlockFound]);

    return (
      <div className={`${styles.container} markdown-body`}>
        <ReactMarkdown remarkPlugins={[remarkGfm, remarkDirective, remarkDirectiveRehype]} components={components}>
          {content}
        </ReactMarkdown>
      </div>
    );
  }
);

export default MarkdownRenderer;
