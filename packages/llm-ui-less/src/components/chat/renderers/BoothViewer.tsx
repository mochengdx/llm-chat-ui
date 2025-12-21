import { CodeSandboxOutlined, FullscreenOutlined, ReloadOutlined, ZoomInOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import styles from "./BoothViewer.module.less";
import type { CodeBlockRendererProps } from "./types";

export const BoothViewer: React.FC<CodeBlockRendererProps> = ({ content, t }) => {
  // Assume content is a URL or a JSON config. For simplicity, let's treat it as a URL if it starts with http
  // otherwise treat it as a description.
  const isUrl = content.trim().startsWith("http");
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading
  React.useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={styles.container}>
      {/* Header / Toolbar */}
      <div className={styles.header}>
        <div className={styles.title}>
          <CodeSandboxOutlined style={{ fontSize: 16, color: "#60a5fa" }} />
          <span>{t?.chat.booth.title || "3D Viewer"}</span>
        </div>
        <div className={styles.controls}>
          <button className={styles.controlButton}>
            <ReloadOutlined style={{ fontSize: 14 }} />
          </button>
          <button className={styles.controlButton}>
            <ZoomInOutlined style={{ fontSize: 14 }} />
          </button>
          <button className={styles.controlButton}>
            <FullscreenOutlined style={{ fontSize: 14 }} />
          </button>
        </div>
      </div>

      {/* Main Viewport Area */}
      <div className={styles.viewport}>
        {/* Grid Background Effect */}
        <div className={styles.grid} />

        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} />
            <span className={styles.loadingText}>{t?.chat.booth.loading || "LOADING MODEL..."}</span>
          </div>
        ) : (
          <div className={styles.content}>
            {/* Placeholder 3D Object Representation */}
            <div className={styles.modelPlaceholder}>
              <div className={styles.placeholderRing1} />
              <div className={styles.placeholderRing2} />
              <div className={styles.placeholderIcon}>
                <CodeSandboxOutlined style={{ fontSize: 48 }} />
              </div>
            </div>

            <div className={styles.info}>
              <p className={styles.modelName}>{t?.chat.booth.modelName || "Exhibition Booth Model"}</p>
              <p className={styles.modelSource}>
                {isUrl ? content.trim() : t?.chat.booth.source || "Model Source: Generated"}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className={styles.footer}>
        <span>{t?.chat.booth.webgl || "WebGL 2.0 Enabled"}</span>
        <span>{t?.chat.booth.size || "1.2MB • GLB"}</span>
      </div>
    </div>
  );
};
