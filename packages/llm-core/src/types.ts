// 核心类型定义

export type Role = "user" | "model";

export interface Attachment {
  id: string;
  file?: File;
  previewUrl: string;
  type: "image" | "file";
  status?: "uploading" | "uploaded" | "error";
}

export interface SendContext {
  input: string;
  attachments: Attachment[];
  isStreaming: boolean;
  [key: string]: any;
}

export type SendValidator = (context: SendContext) => boolean;

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  isThinking?: boolean;
  modelUsed?: string;
  thoughtProcess?: string;
  attachments?: Attachment[];
  childrenIds?: string[];
  currentChildIndex?: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  date: string;
}

export interface TriggerItem {
  id: string;
  label: string;
  icon?: any;
  description?: string;
  prompt?: string;
}

export interface UserSettings {
  theme: "light" | "dark";
  mode: "general" | "developer" | "writer";
  enableThinking: boolean;
  enableTools: boolean;
  denseMode: boolean;
  safetyLevel: "low" | "medium" | "high";
  protocol: "mock" | "sse" | "websocket";
  modelId?: string;
  language: "en" | "zh-CN";
}

export interface StreamRequest {
  modelId: string;
  messages: Message[];
  config: { temperature?: number; useThinking?: boolean };
}

export interface StreamCallbacks {
  onStart?: () => void;
  onThinking?: (token: string) => void;
  onContent?: (token: string) => void;
  onEnd?: () => void;
  onError?: (err: Error) => void;
}
