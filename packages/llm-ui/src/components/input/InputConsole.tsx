import { Attachment, TriggerItem, UserSettings } from "@llm/core";
import {
  AtSign,
  Check,
  ChevronDown,
  FileCode,
  FileText,
  Globe,
  HardDrive,
  Hash,
  Image as ImageIcon,
  Layout,
  Maximize2,
  Mic,
  Minimize2,
  Plus,
  Send,
  Video,
  Wrench,
  X
} from "lucide-react";
import React, { RefObject } from "react";

interface InputConsoleProps {
  input: string;
  setInput: (val: string) => void;
  isInputExpanded: boolean;
  setIsInputExpanded: (val: boolean) => void;
  attachments: Attachment[];
  removeAttachment: (id: string) => void;
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
}

const InputConsole: React.FC<InputConsoleProps> = ({
  input,
  setInput,
  isInputExpanded,
  setIsInputExpanded,
  attachments,
  removeAttachment,
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
  setShowCanvasBadge
}) => {
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
        {isInputExpanded && (
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg font-medium">Edit Message</span>
            <button
              onClick={() => setIsInputExpanded(false)}
              className="p-2 hover:bg-gray-200 dark:hover:bg-[#3c4043] rounded-full"
            >
              <Minimize2 size={20} />
            </button>
          </div>
        )}

        {triggerType && (
          <div className="absolute bottom-full left-4 mb-2 w-64 bg-white dark:bg-[#252627] border border-gray-200 dark:border-[#3c4043] rounded-xl shadow-2xl p-1 z-50 flex flex-col gap-0.5 animate-scale-up overflow-hidden">
            <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-200 dark:border-[#3c4043]/50 flex items-center gap-2">
              {triggerType === "@" ? <AtSign size={12} /> : <Hash size={12} />}
              <span>{triggerType === "@" ? "Mention" : "Tag"}</span>
            </div>
            <div className="max-h-48 overflow-y-auto custom-scrollbar p-1">
              {getFilteredTriggers().map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleTriggerSelect(item)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-700 dark:text-gray-300 text-sm transition-colors text-left"
                >
                  <div className="shrink-0">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 dark:text-gray-200">{item.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        <div
          className={`bg-[#f0f4f9] dark:bg-[#1e1f20] rounded-[28px] border border-gray-200 dark:border-[#3c4043] shadow-lg flex flex-col transition-colors focus-within:bg-white dark:focus-within:bg-[#252627] focus-within:border-gray-300 dark:focus-within:border-[#5e5f61] ${isInputExpanded ? "w-full flex-1" : ""}`}
        >
          {attachments.length > 0 && (
            <div className="flex gap-3 px-4 pt-3 overflow-x-auto">
              {attachments.map((att) => (
                <div key={att.id} className="relative group/preview">
                  <div className="h-16 w-16 rounded-lg overflow-hidden border border-gray-300 dark:border-[#3c4043] flex items-center justify-center bg-gray-100 dark:bg-[#1e1f20]">
                    {att.type === "image" ? (
                      <img src={att.previewUrl} className="h-full w-full object-cover" />
                    ) : (
                      <FileText size={24} className="text-gray-500" />
                    )}
                  </div>
                  <button
                    onClick={() => removeAttachment(att.id)}
                    className="absolute -top-1 -right-1 bg-gray-800 text-white rounded-full p-0.5 shadow-md opacity-0 group-hover/preview:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div
            className={`flex items-start w-full px-4 ${isInputExpanded ? "flex-1 py-4" : settings.denseMode ? "py-2 min-h-[48px]" : "py-3 min-h-[56px]"}`}
          >
            {/* {settings.denseMode && showCanvasBadge && !isInputExpanded && (
              <div className="shrink-0 flex items-center gap-1 bg-[#dde3ea] dark:bg-[#28292a] border border-gray-300 dark:border-[#3c4043] rounded-lg px-2 py-1 mr-2 mt-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-[#333]">
                <Maximize2 size={12} className="text-gray-500 dark:text-gray-400" />
                <span className="text-xs text-gray-600 dark:text-gray-300">Canvas</span>
                <button
                  onClick={() => setShowCanvasBadge(false)}
                  className="ml-1 hover:text-black dark:hover:text-white text-gray-400 dark:text-gray-500"
                >
                  <X size={10} />
                </button>
              </div>
            )} */}
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !triggerType) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Ask Simple LLM Chat..."
              className="flex-1 bg-transparent border-none outline-none text-gray-800 dark:text-[#e3e3e3] placeholder-gray-500 text-base resize-none custom-scrollbar h-full w-full"
              style={{
                minHeight: isInputExpanded ? "100%" : "24px",
                maxHeight: isInputExpanded ? "none" : "200px"
              }}
            />
            {!isInputExpanded && (
              <button
                onClick={() => setIsInputExpanded(true)}
                className="ml-2 mt-1 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                title="Full screen edit"
              >
                <Maximize2 size={14} />
              </button>
            )}
          </div>

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
                      <input type="file" className="hidden" onChange={handleFileUpload} ref={fileInputRef} />
                      <span className="text-gray-500 dark:text-gray-400">
                        <HardDrive size={18} />
                      </span>
                      <span>Upload files</span>
                    </label>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-700 dark:text-gray-300 text-sm transition-colors text-left">
                      <span className="text-gray-500 dark:text-gray-400">
                        <Layout size={18} />
                      </span>
                      <span>Add from Drive</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-700 dark:text-gray-300 text-sm transition-colors text-left">
                      <span className="text-gray-500 dark:text-gray-400">
                        <ImageIcon size={18} />
                      </span>
                      <span>Photos</span>
                    </button>
                    <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-[#3c4043] text-gray-700 dark:text-gray-300 text-sm transition-colors text-left">
                      <span className="text-gray-500 dark:text-gray-400">
                        <FileCode size={18} />
                      </span>
                      <span>Import code</span>
                    </button>
                  </div>
                )}
              </div>
              {settings.enableTools && (
                <div className="relative" ref={toolsMenuRef}>
                  <button
                    onClick={() => setToolsMenuOpen(!isToolsMenuOpen)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${isToolsMenuOpen ? "bg-gray-200 dark:bg-[#3c4043] text-black dark:text-white" : "bg-[#dde3ea] dark:bg-[#28292a] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#3c4043] hover:text-black dark:hover:text-white"}`}
                  >
                    <Wrench size={14} />
                    <span>Tools</span>
                  </button>
                  {isToolsMenuOpen && (
                    <div className="absolute bottom-14 left-0 w-64 bg-white dark:bg-[#252627] border border-gray-200 dark:border-[#3c4043] rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 animate-scale-up">
                      {[
                        { icon: <Globe size={16} />, label: "Deep Research" },
                        { icon: <Video size={16} />, label: "Create videos" }
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
                    <div className="px-3 py-2 text-xs font-medium text-gray-500">Choose your model</div>
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
                onClick={() => handleSend()}
                className={`p-2 rounded-full transition-colors ${input.trim() || attachments.length ? "bg-blue-600 dark:bg-[#a8c7fa] text-white dark:text-[#0b1219] hover:bg-blue-700 dark:hover:bg-white" : "bg-[#dde3ea] dark:bg-[#3c4043] text-gray-400 dark:text-gray-500 cursor-not-allowed"}`}
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InputConsole;
