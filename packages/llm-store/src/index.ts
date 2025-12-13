import type { ChatSession, Message, UserSettings } from "@llm/core";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface StoreState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  messages: Message[];
  settings: UserSettings;
  setSessions: (sessions: ChatSession[] | ((prev: ChatSession[]) => ChatSession[])) => void;
  setCurrentSessionId: (id: string | null) => void;
  setMessages: (messages: Message[] | ((prev: Message[]) => Message[])) => void;
  setSettings: (settings: UserSettings | ((prev: UserSettings) => UserSettings)) => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: "dark",
  language: "en",
  mode: "developer",
  enableThinking: true,
  enableTools: true,
  denseMode: false,
  safetyLevel: "medium",
  protocol: "mock"
};

export const useLLMStore = create<StoreState>()(
  persist(
    (set) => ({
      sessions: [],
      currentSessionId: null,
      messages: [],
      settings: DEFAULT_SETTINGS,
      setSessions: (sessions) =>
        set((state) => ({
          sessions: typeof sessions === "function" ? (sessions as Function)(state.sessions) : sessions
        })),
      setCurrentSessionId: (id) => set({ currentSessionId: id }),
      setMessages: (messages) =>
        set((state) => ({
          messages: typeof messages === "function" ? (messages as Function)(state.messages) : messages
        })),
      setSettings: (settings) =>
        set((state) => ({
          settings: typeof settings === "function" ? (settings as Function)(state.settings) : settings
        }))
    }),
    {
      name: "llm-chat-store",
      getStorage: () => localStorage // 可替换为 indexdb 封装 或是 服务端存储
    }
  )
);
