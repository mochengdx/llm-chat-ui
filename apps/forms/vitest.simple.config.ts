import { defineConfig } from "vitest/config";

// Simple Vitest config that avoids loading the project's Vite config (which
// can import ESM-only plugins and break Node require). This file keeps a
// minimal test environment (jsdom) for DOM-related tests.
export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["src/**/__tests__/**"],
    globals: true
  }
});
