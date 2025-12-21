# @llm/core

Core types, protocols, and stream adapters for the LLM Chat application.

## Features

- **Type Definitions**: Shared TypeScript interfaces for chat messages, sessions, and configurations.
- **Stream Adapters**: Abstract base classes and implementations for handling LLM streaming responses (SSE, WebSocket).
- **Protocol Specifications**: Defines the communication contract between the UI and the LLM backend.

## Installation

```bash
pnpm add @llm/core
```

## Usage

```typescript
import { StreamAdapter, ChatMessage } from "@llm/core";
// ...
```
