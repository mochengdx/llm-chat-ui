import type { Attachment, TriggerItem, UserSettings } from "@llm/core";
import type { RefObject } from "react";
import React from "react";
import { useTranslation } from "../../hooks/useTranslation";
import { ActiveTags } from "./console/ActiveTags";
import { InputHeader } from "./console/InputHeader";
import { InputSuggestions } from "./console/InputSuggestions";
import { InputTextArea } from "./console/InputTextArea";
import { InputToolbar } from "./console/InputToolbar";

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
  setInput: _setInput,
  isInputExpanded,
  setIsInputExpanded,
  attachments,
  removeAttachment: _removeAttachment,
  activeTags,
  removeTag,
  triggerType,
  triggerQuery: _triggerQuery,
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
  showCanvasBadge: _showCanvasBadge,
  setShowCanvasBadge: _setShowCanvasBadge,
  isStreaming,
  onStop
}) => {
  const { t } = useTranslation(settings);

  return (
    <div
      className={`
        transition-all duration-500 ease-in-out z-20 
        ${
          isInputExpanded
            ? "absolute inset-0 bg-white dark:bg-[#131314] flex flex-col p-4"
            : `absolute left-0 w-full px-4 ${isHome ? "top-[50%] -translate-y-1/2" : "bottom-0 pb-6 pt-10 bg-gradient-to-t from-white dark:from-[#131314] via-white dark:via-[#131314] to-transparent pointer-events-none"}`
        }
    `}
    >
      <div
        className={`pointer-events-auto mx-auto relative group flex flex-col ${isInputExpanded ? "h-full" : ""} ${settings.denseMode ? "max-w-4xl" : "max-w-3xl"}`}
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

        <div
          className={`bg-[#f0f4f9] dark:bg-[#1e1f20] rounded-[28px] border border-gray-200 dark:border-[#3c4043] shadow-lg flex flex-col transition-colors focus-within:bg-white dark:focus-within:bg-[#252627] focus-within:border-gray-300 dark:focus-within:border-[#5e5f61] ${isInputExpanded ? "w-full flex-1" : ""}`}
        >
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
