import {
  Check,
  ChevronDown,
  FileCode,
  Globe,
  HardDrive,
  Image as ImageIcon,
  Layout,
  Mic,
  Plus,
  Send,
  Square,
  Video,
  Wrench
} from "lucide-react";
import type { RefObject } from "react";
import { memo } from "react";

import type { Translations } from "../../../locales/en";

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
      <div className="flex items-center justify-between px-4 pb-3 pt-1">
        <div className="flex items-center gap-2">
          <div className="relative" ref={plusMenuRef}>
            <button
              onClick={() => setPlusMenuOpen(!isPlusMenuOpen)}
              className="p-2 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3c4043] hover:text-gray-900 dark:hover:text-white rounded-full transition-all"
            >
              <Plus size={18} />
            </button>
            {isPlusMenuOpen && (
              <div className="absolute bottom-14 left-0 w-60 bg-white dark:bg-[#252627] border border-gray-200 dark:border-[#3c4043] rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 animate-scale-up">
                <label className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-700 dark:text-gray-300 text-sm transition-colors cursor-pointer">
                  <input type="file" className="hidden" onChange={onFileUpload} ref={fileInputRef} />
                  <span className="text-gray-500 dark:text-gray-400">
                    <HardDrive size={18} />
                  </span>
                  <span>{t.input.uploadFiles}</span>
                </label>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-700 dark:text-gray-300 text-sm transition-colors text-left">
                  <span className="text-gray-500 dark:text-gray-400">
                    <Layout size={18} />
                  </span>
                  <span>{t.input.addFromDrive}</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-700 dark:text-gray-300 text-sm transition-colors text-left">
                  <span className="text-gray-500 dark:text-gray-400">
                    <ImageIcon size={18} />
                  </span>
                  <span>{t.input.photos}</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-700 dark:text-gray-300 text-sm transition-colors text-left">
                  <span className="text-gray-500 dark:text-gray-400">
                    <FileCode size={18} />
                  </span>
                  <span>{t.input.importCode}</span>
                </button>
              </div>
            )}
          </div>
          {enableTools && (
            <div className="relative" ref={toolsMenuRef}>
              <button
                onClick={() => setToolsMenuOpen(!isToolsMenuOpen)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${isToolsMenuOpen ? "bg-gray-200 dark:bg-[#3c4043] text-black dark:text-white" : "bg-[#dde3ea] dark:bg-[#28292a] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3c4043] hover:text-black dark:hover:text-white"}`}
              >
                <Wrench size={14} />
                <span>{t.input.tools}</span>
              </button>
              {isToolsMenuOpen && (
                <div className="absolute bottom-14 left-0 w-64 bg-white dark:bg-[#252627] border border-gray-200 dark:border-[#3c4043] rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 animate-scale-up">
                  {[
                    { icon: <Globe size={16} />, label: t.chat.chips.deepResearch },
                    { icon: <Video size={16} />, label: t.input.createVideos }
                  ].map((item, idx) => (
                    <button
                      key={idx}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-700 dark:text-gray-300 text-sm transition-colors text-left"
                    >
                      <span className="text-gray-500 dark:text-gray-400">{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setModelDropdownOpen(!isModelDropdownOpen)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${selectedModel.id === "thinking" ? "bg-[#e8f0fe] dark:bg-[#18232c] border-blue-200 dark:border-[#294254] text-blue-700 dark:text-[#a8c7fa]" : "bg-[#dde3ea] dark:bg-[#28292a] border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3c4043]"}`}
            >
              {selectedModel.icon}
              <span>{selectedModel.name}</span>
              <ChevronDown size={12} className="opacity-70" />
            </button>
            {isModelDropdownOpen && (
              <div className="absolute bottom-12 right-0 w-72 bg-white dark:bg-[#252627] border border-gray-200 dark:border-[#3c4043] rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 animate-scale-up origin-bottom-right">
                <div className="px-3 py-2 text-xs font-medium text-gray-500">{t.input.chooseModel}</div>
                {availableModels.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      setSelectedModel(model);
                      setModelDropdownOpen(false);
                    }}
                    className="flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-[#3c4043] transition-colors text-left group/item"
                  >
                    <div className="mt-1">{model.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-sm font-medium ${selectedModel.id === model.id ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"}`}
                        >
                          {model.name}
                        </span>
                        {selectedModel.id === model.id && (
                          <Check size={14} className="text-blue-500 dark:text-blue-400" />
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">{model.description}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setIsListening(!isListening)}
            className={`p-2 rounded-full transition-colors ${isListening ? "bg-red-500 text-white animate-pulse" : "text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3c4043]"}`}
          >
            {isListening ? (
              <div className="flex gap-0.5 items-center justify-center h-5 w-5">
                <span className="w-1 h-3 bg-white animate-wave"></span>
                <span className="w-1 h-5 bg-white animate-wave delay-75"></span>
                <span className="w-1 h-3 bg-white animate-wave delay-150"></span>
              </div>
            ) : (
              <Mic size={20} />
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
            className={`p-2 rounded-full transition-colors ${
              isStreaming
                ? "bg-gray-200 dark:bg-[#3c4043] text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#4a4d50]"
                : canSend
                  ? "bg-blue-600 dark:bg-[#a8c7fa] text-white dark:text-[#0b1219] hover:bg-blue-700 dark:hover:bg-white"
                  : "bg-[#dde3ea] dark:bg-[#3c4043] text-gray-400 dark:text-gray-500 cursor-not-allowed"
            }`}
          >
            {isStreaming ? <Square size={18} className="fill-current" /> : <Send size={18} className="ml-0.5" />}
          </button>
        </div>
      </div>
    );
  }
);
