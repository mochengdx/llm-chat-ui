# @llm/utils

Common utility functions and helpers for the LLM Chat application.

## Features

- **String Utilities**: URL extraction, validation, and manipulation.
- **Type Helpers**: Common TypeScript utility types.
- **Shared Logic**: Reusable logic across different packages.

## Installation

```bash
pnpm add @llm/utils
```

## Usage

```typescript
import { extractUrls } from "@llm/utils";

const urls = extractUrls("Check this https://example.com");
```
