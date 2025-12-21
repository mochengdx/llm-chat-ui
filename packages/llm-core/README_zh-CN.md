# @llm/core (简体中文)

LLM 聊天应用的核心类型、协议与流式服务适配器。

## 功能特性

- **类型定义**: 聊天消息、会话和配置的共享 TypeScript 接口定义。
- **流式适配器**: 用于处理 LLM 流式响应（SSE, WebSocket）的抽象基类和实现。
- **协议规范**: 定义 UI 与 LLM 后端之间的通信契约。

## 安装

```bash
pnpm add @llm/core
```

## 使用

```typescript
import { StreamAdapter, ChatMessage } from "@llm/core";
// ...
```
