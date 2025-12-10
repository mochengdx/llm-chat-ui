import type { ChatSession, Message, UserSettings } from "@llm/core";
interface StoreState {
    sessions: ChatSession[];
    currentSessionId: string | null;
    messages: Message[];
    settings: UserSettings;
    setSessions: (sessions: ChatSession[]) => void;
    setCurrentSessionId: (id: string | null) => void;
    setMessages: (messages: Message[]) => void;
    setSettings: (settings: UserSettings) => void;
}
export declare const useLLMStore: import("zustand").UseBoundStore<Omit<import("zustand").StoreApi<StoreState>, "persist"> & {
    persist: {
        setOptions: (options: Partial<import("zustand/middleware").PersistOptions<StoreState, StoreState>>) => void;
        clearStorage: () => void;
        rehydrate: () => Promise<void> | void;
        hasHydrated: () => boolean;
        onHydrate: (fn: (state: StoreState) => void) => () => void;
        onFinishHydration: (fn: (state: StoreState) => void) => () => void;
        getOptions: () => Partial<import("zustand/middleware").PersistOptions<StoreState, StoreState>>;
    };
}>;
export {};
//# sourceMappingURL=index.d.ts.map