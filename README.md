# Simple LLM Chat

A modern, responsive, and feature-rich LLM chat interface built with React, Tailwind CSS, and TypeScript. This monorepo project provides both PC and Mobile applications with a unified core and UI library.

## Features

- **Multi-Platform Support**:
  - **PC Web**: Full-featured desktop interface with sidebar, settings, and artifact panel.
  - **Mobile Web**: Optimized mobile experience with touch-friendly controls and responsive layout.
- **Advanced Streaming**:
  - Real-time response streaming.
  - Support for Server-Sent Events (SSE) and WebSocket protocols.
  - Extensible `StreamAdapter` architecture.
- **Rich Content Rendering**:
  - **Markdown**: Full Markdown support including tables, lists, and formatting.
  - **Code Highlighting**: Syntax highlighting for code blocks with copy functionality.
  - **Artifacts**: Dedicated panel for viewing and managing generated code or content.
- **Thinking Process**: Visualizes the model's "Chain of Thought" or reasoning process (expandable/collapsible).
- **Customizable Settings**:
  - Theme switching (Light/Dark mode).
  - Model selection.
  - Usage modes (General, Developer, Creative).
- **Developer Friendly**:
  - **Monorepo**: Managed with pnpm workspaces for modular development.
  - **Typed**: Built with TypeScript for type safety.
  - **Modern Stack**: React, Vite, Tailwind CSS, Zustand.

## Project Structure

This project is organized as a monorepo:

- **apps/**
  - `pc`: The desktop web application.
  - `mobile`: The mobile web application.
- **packages/**
  - `core`: Core business logic, types, and streaming adapters.
  - `ui`: Shared UI components (Chat interface, Markdown renderer, Settings).
  - `store`: State management (Zustand stores).
  - `utils`: Shared utility functions.

## Getting Started

### Prerequisites

- Node.js (v18+)
- pnpm (v8+)

### Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd llm-chat-ui
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

To start the development servers:

- **PC App**:

  ```bash
  pnpm dev:pc
  ```

- **Mobile App**:
  ```bash
  pnpm dev:mobile
  ```

### Building

To build all packages and applications:

```bash
pnpm build:all
```

To build specific targets:

```bash
pnpm build:pc      # Build PC app
pnpm build:mobile  # Build Mobile app
pnpm build:ui      # Build UI package
```

## License

MIT
