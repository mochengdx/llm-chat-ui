# @llm/store (简体中文)

基于 Zustand 构建的 LLM 聊天应用状态管理与持久化层。

## 功能特性

- **状态管理**: 使用 Zustand 集中管理聊天会话、消息和设置状态。
- **持久化**: 使用 `idb-keyval` 自动将状态持久化到 IndexedDB。
- **响应式**: 高效的更新机制，确保 UI 组件及时重新渲染。

## 安装

```bash
pnpm add @llm/store
```

## 使用

```typescript
import { useChatStore } from "@llm/store";

const { messages, sendMessage } = useChatStore();
```
