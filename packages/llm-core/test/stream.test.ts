import { describe, expect, it, vi } from "vitest";
import { MockStreamAdapter } from "../src/stream";
import type { StreamCallbacks, StreamRequest } from "../src/types";

describe("MockStreamAdapter", () => {
  it("should simulate streaming response", async () => {
    const adapter = new MockStreamAdapter();
    const callbacks: StreamCallbacks = {
      onStart: vi.fn(),
      onContent: vi.fn(),
      onThinking: vi.fn(),
      onEnd: vi.fn(),
      onError: vi.fn()
    };

    const request: StreamRequest = {
      messages: [{ role: "user", content: "Hello" }],
      config: {
        modelId: "gpt-4",
        temperature: 0.7,
        useThinking: false
      },
      modelId: "gpt-4"
    };

    adapter.connect(request, callbacks);

    // Wait for the mock delay (600ms + generation time ~2000ms)
    await new Promise((r) => setTimeout(r, 4000));

    expect(callbacks.onStart).toHaveBeenCalled();
    expect(callbacks.onContent).toHaveBeenCalled();
    expect(callbacks.onEnd).toHaveBeenCalled();
  }, 10000); // Increase test timeout

  it("should simulate thinking process when enabled", async () => {
    const adapter = new MockStreamAdapter();
    const callbacks: StreamCallbacks = {
      onStart: vi.fn(),
      onContent: vi.fn(),
      onThinking: vi.fn(),
      onEnd: vi.fn(),
      onError: vi.fn()
    };

    const request: StreamRequest = {
      messages: [{ role: "user", content: "Solve this" }],
      config: {
        modelId: "gpt-4",
        temperature: 0.7,
        useThinking: true
      },
      modelId: "gpt-4"
    };

    adapter.connect(request, callbacks);

    // Wait for thinking (~3000ms) + response (~2000ms) + overhead
    await new Promise((r) => setTimeout(r, 8000));

    expect(callbacks.onStart).toHaveBeenCalled();
    expect(callbacks.onThinking).toHaveBeenCalled();
    expect(callbacks.onContent).toHaveBeenCalled();
    expect(callbacks.onEnd).toHaveBeenCalled();
  }, 15000); // Increase test timeout

  it("should stop streaming when disconnected", async () => {
    const adapter = new MockStreamAdapter();
    const callbacks: StreamCallbacks = {
      onStart: vi.fn(),
      onContent: vi.fn(),
      onEnd: vi.fn()
    };

    const request: StreamRequest = {
      messages: [{ role: "user", content: "Long response" }],
      config: {
        modelId: "gpt-4",
        temperature: 0.7,
        useThinking: false
      },
      modelId: "gpt-4"
    };

    adapter.connect(request, callbacks);

    // Disconnect immediately
    adapter.disconnect();

    await new Promise((r) => setTimeout(r, 1000));

    expect(callbacks.onEnd).not.toHaveBeenCalled();
  });
});
