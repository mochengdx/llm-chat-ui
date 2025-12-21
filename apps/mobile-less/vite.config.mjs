import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@llm/core": path.resolve(__dirname, "../../packages/llm-core"),
      "@llm/store": path.resolve(__dirname, "../../packages/llm-store"),
      "@llm/ui": path.resolve(__dirname, "../../packages/llm-ui"),
      "@llm/ui-less": path.resolve(__dirname, "../../packages/llm-ui-less")
    }
  }
});
