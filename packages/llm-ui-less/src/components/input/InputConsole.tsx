import { Attachment, TriggerItem, UserSettings } from "@llm/core";
import React, { RefObject } from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { ActiveTags } from "./console/ActiveTags";
import { InputAttachments } from "./console/InputAttachments";
import { InputHeader } from "./console/InputHeader";
import { InputSuggestions } from "./console/InputSuggestions";
import { InputTextArea } from "./console/InputTextArea";
import { InputToolbar } from "./console/InputToolbar";
import styles from "./InputConsole.module.less";

interface InputConsoleProps {
  input: string;
  setInput: (val: string) => void;
  isInputExpanded: boolean;
  setIsInputExpanded: (val: boolean) => void;
  attachments: Attachment[];
  removeAttachment: (id: string) => void;
  activeTags?: TriggerItem[];
  removeTag?: (id: string) => void;
  triggerType: "@" | "#" | null;
  triggerQuery: string;
  handleTriggerSelect: (item: TriggerItem) => void;
  getFilteredTriggers: () => TriggerItem[];
  isPlusMenuOpen: boolean;
  setPlusMenuOpen: (val: boolean) => void;
  isToolsMenuOpen: boolean;
  setToolsMenuOpen: (val: boolean) => void;
  isModelDropdownOpen: boolean;
  setModelDropdownOpen: (val: boolean) => void;
  selectedModel: { id: string; name: string; icon: React.ReactNode; description: string };
  setSelectedModel: (model: any) => void;
  availableModels: any[];
  isListening: boolean;
  setIsListening: (val: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSend: (txt?: string) => void;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  settings: UserSettings;
  inputRef: RefObject<HTMLTextAreaElement>;
  fileInputRef: RefObject<HTMLInputElement>;
  plusMenuRef: RefObject<HTMLDivElement>;
  toolsMenuRef: RefObject<HTMLDivElement>;
  dropdownRef: RefObject<HTMLDivElement>;
  isHome: boolean;
  showCanvasBadge: boolean;
  setShowCanvasBadge: (val: boolean) => void;
  isStreaming?: boolean;
  onStop?: () => void;
}

const InputConsole: React.FC<InputConsoleProps> = ({
  input,
  setInput,
  isInputExpanded,
  setIsInputExpanded,
  attachments,
  removeAttachment,
  activeTags,
  removeTag,
  triggerType,
  triggerQuery,
  handleTriggerSelect,
  getFilteredTriggers,
  isPlusMenuOpen,
  setPlusMenuOpen,
  isToolsMenuOpen,
  setToolsMenuOpen,
  isModelDropdownOpen,
  setModelDropdownOpen,
  selectedModel,
  setSelectedModel,
  availableModels,
  isListening,
  setIsListening,
  handleInputChange,
  handleSend,
  handleFileUpload,
  settings,
  inputRef,
  fileInputRef,
  plusMenuRef,
  toolsMenuRef,
  dropdownRef,
  isHome,
  showCanvasBadge,
  setShowCanvasBadge,
  isStreaming,
  onStop
}) => {
  const { t } = useTranslation(settings);

  return (
    <div
      className={`${styles.container} ${
        isInputExpanded ? styles.expanded : `${styles.collapsed} ${isHome ? styles.home : styles.bottom}`
      }`}
    >
      <div
        className={`${styles.innerContainer} ${isInputExpanded ? styles.expanded : ""} ${
          settings.denseMode ? styles.dense : ""
        }`}
      >
        <InputHeader isExpanded={isInputExpanded} onCollapse={() => setIsInputExpanded(false)} t={t} />

        {/* Active Tags Area */}
        <ActiveTags activeTags={activeTags || []} onRemove={removeTag || (() => {})} />

        <InputSuggestions
          triggerType={triggerType}
          suggestions={getFilteredTriggers()}
          onSelect={handleTriggerSelect}
          t={t}
        />

        <InputAttachments attachments={attachments} onRemove={removeAttachment} />

        <div className={`${styles.inputBox} ${isInputExpanded ? styles.expanded : ""}`}>
          <InputTextArea
            input={input}
            onChange={handleInputChange}
            onSend={() => handleSend()}
            inputRef={inputRef}
            isExpanded={isInputExpanded}
            onExpand={() => setIsInputExpanded(true)}
            denseMode={settings.denseMode}
            triggerType={triggerType}
            t={t}
          />

          <InputToolbar
            isPlusMenuOpen={isPlusMenuOpen}
            setPlusMenuOpen={setPlusMenuOpen}
            plusMenuRef={plusMenuRef}
            fileInputRef={fileInputRef}
            onFileUpload={handleFileUpload}
            enableTools={settings.enableTools}
            isToolsMenuOpen={isToolsMenuOpen}
            setToolsMenuOpen={setToolsMenuOpen}
            toolsMenuRef={toolsMenuRef}
            selectedModel={selectedModel}
            setSelectedModel={setSelectedModel}
            availableModels={availableModels}
            isModelDropdownOpen={isModelDropdownOpen}
            setModelDropdownOpen={setModelDropdownOpen}
            dropdownRef={dropdownRef}
            isListening={isListening}
            setIsListening={setIsListening}
            input={input}
            hasAttachments={attachments.length > 0}
            onSend={() => handleSend()}
            isStreaming={isStreaming}
            onStop={onStop}
            t={t}
          />
        </div>
      </div>
    </div>
  );
};

export default InputConsole;
