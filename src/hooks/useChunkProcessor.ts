"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  processInChunks,
  processInChunksAsync,
  type ChunkOptions,
} from "@/lib/performance/chunk-processor";

interface UseChunkProcessorOptions extends Omit<ChunkOptions, "signal" | "onProgress"> {
  /**
   * Auto-cancel on unmount
   * @default true
   */
  cancelOnUnmount?: boolean;
}

interface UseChunkProcessorReturn<T, R> {
  /**
   * Start processing items
   */
  process: (items: T[], processor: (item: T, index: number) => R) => Promise<R[]>;
  /**
   * Start async processing
   */
  processAsync: (
    items: T[],
    processor: (item: T, index: number) => Promise<R>
  ) => Promise<R[]>;
  /**
   * Cancel current processing
   */
  cancel: () => void;
  /**
   * Current progress (0-100)
   */
  progress: number;
  /**
   * Whether processing is in progress
   */
  isProcessing: boolean;
  /**
   * Error if processing failed
   */
  error: Error | null;
}

/**
 * React hook for chunk processing with progress tracking
 *
 * @example
 * ```tsx
 * function DataProcessor({ items }) {
 *   const { process, progress, isProcessing, cancel } = useChunkProcessor();
 *
 *   const handleProcess = async () => {
 *     const results = await process(items, (item) => transform(item));
 *     setResults(results);
 *   };
 *
 *   return (
 *     <div>
 *       <button onClick={handleProcess} disabled={isProcessing}>
 *         Process
 *       </button>
 *       {isProcessing && (
 *         <>
 *           <Progress value={progress} />
 *           <button onClick={cancel}>Cancel</button>
 *         </>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useChunkProcessor<T, R>(
  options: UseChunkProcessorOptions = {}
): UseChunkProcessorReturn<T, R> {
  const { chunkSize = 100, cancelOnUnmount = true } = options;

  const [progress, setProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cancelOnUnmount && abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [cancelOnUnmount]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsProcessing(false);
    }
  }, []);

  const process = useCallback(
    async (
      items: T[],
      processor: (item: T, index: number) => R
    ): Promise<R[]> => {
      // Cancel any existing processing
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setIsProcessing(true);
      setProgress(0);
      setError(null);

      try {
        const results = await processInChunks(items, processor, {
          chunkSize,
          signal: abortControllerRef.current.signal,
          onProgress: (p) => setProgress(Math.round(p * 100)),
        });

        setIsProcessing(false);
        setProgress(100);
        return results;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          // Cancelled by user - not an error
          setProgress(0);
        } else {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
        setIsProcessing(false);
        throw err;
      }
    },
    [chunkSize]
  );

  const processAsync = useCallback(
    async (
      items: T[],
      processor: (item: T, index: number) => Promise<R>
    ): Promise<R[]> => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setIsProcessing(true);
      setProgress(0);
      setError(null);

      try {
        const results = await processInChunksAsync(items, processor, {
          chunkSize,
          signal: abortControllerRef.current.signal,
          onProgress: (p) => setProgress(Math.round(p * 100)),
        });

        setIsProcessing(false);
        setProgress(100);
        return results;
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          setProgress(0);
        } else {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
        setIsProcessing(false);
        throw err;
      }
    },
    [chunkSize]
  );

  return {
    process,
    processAsync,
    cancel,
    progress,
    isProcessing,
    error,
  };
}
