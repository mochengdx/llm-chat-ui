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

## Extension Capabilities

The chat interface is highly extensible, allowing developers to inject custom React components directly into the chat stream using Markdown Directives.

### Custom Component Injection

You can register custom components in your application and trigger them via specific Markdown syntax `::component-name[content]{prop="value"}`.

#### Built-in Examples

1.  **User Profile Card** (`::user-profile`) Displays a rich user profile card.

    ```markdown
    ::user-profile[User Bio Content]{name="John Doe" role="Developer" avatar="https://example.com/avatar.png" bio="Full stack developer"}
    ```

2.  **Enhanced Image** (`::image-plus`) Renders an image with title, description, and link.

    ```markdown
    ::image-plus[Description inside]{src="https://example.com/image.png" name="Image Name" info="Some info" link="https://example.com"}
    ```

3.  **Data List** (`::data-list`) Renders a structured list from JSON data.
    ```markdown
    ::data-list[Project Status Overview]{title="Q4 Deliverables" data='[{"title": "Frontend Migration", "status": "Done", "desc": "Migrated to React 18"}, {"title": "Backend API", "status": "In Progress", "desc": "Implementing GraphQL endpoints"}]'}
    ```

### Prompt DSL (Capsule/Chip UI)

The chat interface supports a "Prompt DSL" feature using the `#` trigger. This allows users to quickly insert predefined prompt templates or context modifiers.

- **Trigger**: Type `#` in the input box to see a list of available triggers.
- **Capsule UI**: Selected triggers are displayed as visual "capsules" or "chips" above the input area, keeping the input text clean.
- **Execution**: When the message is sent, the content associated with the active tags is automatically prepended to the user's message.

Example Triggers:

- `#gen-image`: Adds an image generation instruction.
- `#search`: Adds a web search instruction.

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
