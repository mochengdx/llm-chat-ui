# @llm/store

State management and persistence layer for the LLM Chat application, built with Zustand.

## Features

- **State Management**: Centralized state for chat sessions, messages, and settings using Zustand.
- **Persistence**: Automatically persists state to IndexedDB using `idb-keyval`.
- **Reactivity**: Efficient updates and re-renders for UI components.

## Installation

```bash
pnpm add @llm/store
```

## Usage

```typescript
import { useChatStore } from "@llm/store";

const { messages, sendMessage } = useChatStore();
```
