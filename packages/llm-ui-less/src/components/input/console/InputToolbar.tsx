import {
  AudioOutlined,
  CheckOutlined,
  DownOutlined,
  FileTextOutlined,
  GlobalOutlined,
  HddOutlined,
  LayoutOutlined,
  PictureOutlined,
  PlusOutlined,
  SendOutlined,
  StopOutlined,
  ToolOutlined,
  VideoCameraOutlined
} from "@ant-design/icons";
import type { RefObject } from "react";
import { memo } from "react";

import type { Translations } from "../../../locales/en";
import styles from "./InputToolbar.module.less";

interface InputToolbarProps {
  isPlusMenuOpen: boolean;
  setPlusMenuOpen: (val: boolean) => void;
  plusMenuRef: RefObject<HTMLDivElement>;
  fileInputRef: RefObject<HTMLInputElement>;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;

  enableTools?: boolean;
  isToolsMenuOpen: boolean;
  setToolsMenuOpen: (val: boolean) => void;
  toolsMenuRef: RefObject<HTMLDivElement>;

  selectedModel: { id: string; name: string; icon: React.ReactNode; description: string };
  setSelectedModel: (model: any) => void;
  availableModels: any[];
  isModelDropdownOpen: boolean;
  setModelDropdownOpen: (val: boolean) => void;
  dropdownRef: RefObject<HTMLDivElement>;

  isListening: boolean;
  setIsListening: (val: boolean) => void;

  input: string;
  hasAttachments: boolean;
  canSend: boolean;
  onSend: () => void;
  isStreaming?: boolean;
  onStop?: () => void;
  t: Translations;
}

export const InputToolbar = memo(
  ({
    isPlusMenuOpen,
    setPlusMenuOpen,
    plusMenuRef,
    fileInputRef,
    onFileUpload,
    enableTools,
    isToolsMenuOpen,
    setToolsMenuOpen,
    toolsMenuRef,
    selectedModel,
    setSelectedModel,
    availableModels,
    isModelDropdownOpen,
    setModelDropdownOpen,
    dropdownRef,
    isListening,
    setIsListening,
    input,
    hasAttachments,
    canSend,
    onSend,
    isStreaming,
    onStop,
    t
  }: InputToolbarProps) => {
    return (
      <div className={styles.container}>
        <div className={styles.leftGroup}>
          <div className={styles.relativeContainer} ref={plusMenuRef}>
            <button onClick={() => setPlusMenuOpen(!isPlusMenuOpen)} className={styles.iconButton}>
              <PlusOutlined style={{ fontSize: 18 }} />
            </button>
            {isPlusMenuOpen && (
              <div className={`${styles.menu} ${styles.plusMenu}`}>
                <label className={styles.menuItem}>
                  <input type="file" className={styles.hiddenInput} onChange={onFileUpload} ref={fileInputRef} />
                  <span className={styles.menuIcon}>
                    <HddOutlined style={{ fontSize: 18 }} />
                  </span>
                  <span>{t.input.uploadFiles}</span>
                </label>
                <button className={styles.menuItem}>
                  <span className={styles.menuIcon}>
                    <LayoutOutlined style={{ fontSize: 18 }} />
                  </span>
                  <span>{t.input.addFromDrive}</span>
                </button>
                <button className={styles.menuItem}>
                  <span className={styles.menuIcon}>
                    <PictureOutlined style={{ fontSize: 18 }} />
                  </span>
                  <span>{t.input.photos}</span>
                </button>
                <button className={styles.menuItem}>
                  <span className={styles.menuIcon}>
                    <FileTextOutlined style={{ fontSize: 18 }} />
                  </span>
                  <span>{t.input.importCode}</span>
                </button>
              </div>
            )}
          </div>
          {enableTools && (
            <div className={styles.relativeContainer} ref={toolsMenuRef}>
              <button
                onClick={() => setToolsMenuOpen(!isToolsMenuOpen)}
                className={`${styles.pillButton} ${isToolsMenuOpen ? styles.active : styles.inactive}`}
              >
                <ToolOutlined style={{ fontSize: 14 }} />
                <span>{t.input.tools}</span>
              </button>
              {isToolsMenuOpen && (
                <div className={`${styles.menu} ${styles.toolsMenu}`}>
                  {[
                    { icon: <GlobalOutlined style={{ fontSize: 16 }} />, label: t.chat.chips.deepResearch },
                    { icon: <VideoCameraOutlined style={{ fontSize: 16 }} />, label: t.input.createVideos }
                  ].map((item, idx) => (
                    <button key={idx} className={styles.menuItem}>
                      <span className={styles.menuIcon}>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className={styles.rightGroup}>
          <div className={styles.relativeContainer} ref={dropdownRef}>
            <button
              onClick={() => setModelDropdownOpen(!isModelDropdownOpen)}
              className={`${styles.modelButton} ${selectedModel.id === "thinking" ? styles.thinking : styles.default}`}
            >
              {selectedModel.icon}
              <span>{selectedModel.name}</span>
              <DownOutlined style={{ fontSize: 12, opacity: 0.7 }} />
            </button>
            {isModelDropdownOpen && (
              <div className={`${styles.menu} ${styles.modelMenu}`}>
                <div className={styles.menuHeader}>{t.input.chooseModel}</div>
                {availableModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model);
                      setModelDropdownOpen(false);
                    }}
                    className={`${styles.modelItem} group/item`}
                  >
                    <div className={styles.marginTop1}>{model.icon}</div>
                    <div className={styles.flex1}>
                      <div className={styles.flexRowBetween}>
                        <span className={`${styles.modelName} ${selectedModel.id === model.id ? styles.selected : ""}`}>
                          {model.name}
                        </span>
                        {selectedModel.id === model.id && (
                          <CheckOutlined style={{ fontSize: 14 }} className={styles.checkIcon} />
                        )}
                      </div>
                      <div className={styles.modelDesc}>{model.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setIsListening(!isListening)}
            className={`${styles.micButton} ${isListening ? styles.listening : styles.idle}`}
          >
            {isListening ? (
              <div className={styles.waveContainer}>
                <span className={styles.waveBar}></span>
                <span className={`${styles.waveBar} ${styles.delay75}`}></span>
                <span className={`${styles.waveBar} ${styles.delay150}`}></span>
              </div>
            ) : (
              <AudioOutlined style={{ fontSize: 20 }} />
            )}
          </button>
          <button
            onClick={() => {
              if (isStreaming && onStop) {
                onStop();
              } else {
                onSend();
              }
            }}
            disabled={!isStreaming && !canSend}
            className={`${styles.sendButton} ${
              isStreaming ? styles.streaming : canSend ? styles.active : styles.disabled
            }`}
          >
            {isStreaming ? (
              <StopOutlined style={{ fontSize: 18 }} />
            ) : (
              <SendOutlined style={{ fontSize: 18, marginLeft: 2 }} />
            )}
          </button>
        </div>
      </div>
    );
  }
);
