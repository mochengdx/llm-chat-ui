import type { StreamCallbacks, StreamClient, StreamRequest } from "@llm/core";
import { useCallback, useEffect, useRef, useState } from "react";

export type StreamFlushMode = "raf" | "immediate";

interface UseLLMStreamParams {
  streamClient: StreamClient;
  onComplete?: (fullContent: string, fullReasoning: string) => void;
  onError?: (error: Error) => void;
  /**
   * Control how frequently the hook flushes streaming tokens into React state.
   * - "raf" (default): batches updates via requestAnimationFrame
   * - "immediate": flushes on every token (mainly for debugging)
   */
  flushMode?: StreamFlushMode;
}

export function useLLMStream({ streamClient, onComplete, onError, flushMode = "raf" }: UseLLMStreamParams) {
  const [content, setContent] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Keep track of the latest content/reasoning for onComplete callback
  const contentRef = useRef("");
  const reasoningRef = useRef("");

  // Batch state updates to avoid token-level setState jitter
  const pendingContentPartsRef = useRef<string[]>([]);
  const pendingReasoningPartsRef = useRef<string[]>([]);
  const flushedContentRef = useRef("");
  const flushedReasoningRef = useRef("");
  const rafIdRef = useRef<number | null>(null);
  const flushScheduledRef = useRef(false);

  const cancelScheduledFlush = useCallback(() => {
    if (rafIdRef.current != null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    flushScheduledRef.current = false;
  }, []);

  const flushSync = useCallback(() => {
    cancelScheduledFlush();

    if (pendingReasoningPartsRef.current.length > 0) {
      const delta = pendingReasoningPartsRef.current.join("");
      pendingReasoningPartsRef.current = [];
      flushedReasoningRef.current += delta;
      reasoningRef.current = flushedReasoningRef.current;
      setReasoning(flushedReasoningRef.current);
    }

    if (pendingContentPartsRef.current.length > 0) {
      const delta = pendingContentPartsRef.current.join("");
      pendingContentPartsRef.current = [];
      flushedContentRef.current += delta;
      contentRef.current = flushedContentRef.current;
      setContent(flushedContentRef.current);
    }
  }, [cancelScheduledFlush]);

  const scheduleFlush = useCallback(() => {
    if (flushMode === "immediate") {
      flushSync();
      return;
    }

    if (flushScheduledRef.current) return;
    flushScheduledRef.current = true;
    rafIdRef.current = requestAnimationFrame(() => {
      flushScheduledRef.current = false;
      rafIdRef.current = null;
      flushSync();
    });
  }, [flushMode, flushSync]);

  const stop = useCallback(() => {
    streamClient.abort();
    // Ensure last tokens are flushed before we stop
    flushSync();
    setIsStreaming(false);
  }, [streamClient, flushSync]);

  const trigger = useCallback(
    (request: StreamRequest, callbacks?: Partial<StreamCallbacks>) => {
      // Reset state
      setContent("");
      setReasoning("");
      setError(null);
      setIsStreaming(true);
      contentRef.current = "";
      reasoningRef.current = "";
      flushedContentRef.current = "";
      flushedReasoningRef.current = "";
      pendingContentPartsRef.current = [];
      pendingReasoningPartsRef.current = [];
      cancelScheduledFlush();

      // Abort any previous stream
      streamClient.abort();

      streamClient.stream(request, {
        onStart: () => {
          setIsStreaming(true);
          callbacks?.onStart?.();
        },
        onThinking: (token) => {
          pendingReasoningPartsRef.current.push(token);
          scheduleFlush();
          callbacks?.onThinking?.(token);
        },
        onContent: (token) => {
          pendingContentPartsRef.current.push(token);
          scheduleFlush();
          callbacks?.onContent?.(token);
        },
        onEnd: () => {
          flushSync();
          setIsStreaming(false);
          onComplete?.(contentRef.current, reasoningRef.current);
          callbacks?.onEnd?.();
        },
        onError: (err) => {
          console.error("Stream Error:", err);
          flushSync();
          setError(err);
          setIsStreaming(false);
          onError?.(err);
          callbacks?.onError?.(err);
        }
      });
    },
    [streamClient, onComplete, onError, cancelScheduledFlush, flushSync, scheduleFlush]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancelScheduledFlush();
      streamClient.abort();
    };
  }, [streamClient]);

  return {
    content,
    reasoning,
    isStreaming,
    error,
    trigger,
    stop
  };
}
