import { StreamCallbacks, StreamClient, StreamRequest } from "@llm/core";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseLLMStreamParams {
  streamClient: StreamClient;
  onComplete?: (fullContent: string, fullReasoning: string) => void;
  onError?: (error: Error) => void;
}

export function useLLMStream({ streamClient, onComplete, onError }: UseLLMStreamParams) {
  const [content, setContent] = useState("");
  const [reasoning, setReasoning] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Keep track of the latest content/reasoning for onComplete callback
  const contentRef = useRef("");
  const reasoningRef = useRef("");

  const stop = useCallback(() => {
    streamClient.abort();
    setIsStreaming(false);
  }, [streamClient]);

  const trigger = useCallback(
    (request: StreamRequest, callbacks?: Partial<StreamCallbacks>) => {
      // Reset state
      setContent("");
      setReasoning("");
      setError(null);
      setIsStreaming(true);
      contentRef.current = "";
      reasoningRef.current = "";

      // Abort any previous stream
      streamClient.abort();

      streamClient.stream(request, {
        onStart: () => {
          setIsStreaming(true);
          callbacks?.onStart?.();
        },
        onThinking: (token) => {
          setReasoning((prev) => {
            const next = prev + token;
            reasoningRef.current = next;
            return next;
          });
          callbacks?.onThinking?.(token);
        },
        onContent: (token) => {
          setContent((prev) => {
            const next = prev + token;
            contentRef.current = next;
            return next;
          });
          callbacks?.onContent?.(token);
        },
        onEnd: () => {
          setIsStreaming(false);
          onComplete?.(contentRef.current, reasoningRef.current);
          callbacks?.onEnd?.();
        },
        onError: (err) => {
          console.error("Stream Error:", err);
          setError(err);
          setIsStreaming(false);
          onError?.(err);
          callbacks?.onError?.(err);
        }
      });
    },
    [streamClient, onComplete, onError]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
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
