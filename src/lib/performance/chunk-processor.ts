/**
 * Chunk Processor for Long Task Prevention
 *
 * Processes large arrays in chunks to prevent blocking the main thread.
 * Each chunk is processed with a yield to allow UI updates.
 *
 * @module chunk-processor
 */

export interface ChunkOptions {
  /**
   * Number of items to process per chunk
   * @default 100
   */
  chunkSize?: number;
  /**
   * Progress callback (0-1)
   */
  onProgress?: (progress: number) => void;
  /**
   * AbortSignal for cancellation
   */
  signal?: AbortSignal;
}

/**
 * Process items in chunks to prevent Long Tasks (>50ms)
 *
 * @example
 * ```typescript
 * const results = await processInChunks(
 *   largeArray,
 *   item => heavyComputation(item),
 *   {
 *     chunkSize: 50,
 *     onProgress: (p) => setProgress(p * 100),
 *     signal: abortController.signal
 *   }
 * );
 * ```
 */
export async function processInChunks<T, R>(
  items: T[],
  processor: (item: T, index: number) => R,
  options: ChunkOptions = {}
): Promise<R[]> {
  const { chunkSize = 100, onProgress, signal } = options;

  const results: R[] = [];
  const total = items.length;

  for (let i = 0; i < total; i += chunkSize) {
    // Check for cancellation
    if (signal?.aborted) {
      throw new DOMException("Processing cancelled", "AbortError");
    }

    // Process chunk
    const chunk = items.slice(i, i + chunkSize);
    const chunkResults = chunk.map((item, idx) => processor(item, i + idx));
    results.push(...chunkResults);

    // Report progress
    const progress = Math.min((i + chunkSize) / total, 1);
    onProgress?.(progress);

    // Yield to main thread between chunks
    await yieldToMain();
  }

  return results;
}

/**
 * Process items in chunks with async processor
 */
export async function processInChunksAsync<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  options: ChunkOptions = {}
): Promise<R[]> {
  const { chunkSize = 100, onProgress, signal } = options;

  const results: R[] = [];
  const total = items.length;

  for (let i = 0; i < total; i += chunkSize) {
    if (signal?.aborted) {
      throw new DOMException("Processing cancelled", "AbortError");
    }

    const chunk = items.slice(i, i + chunkSize);
    const chunkResults = await Promise.all(
      chunk.map((item, idx) => processor(item, i + idx))
    );
    results.push(...chunkResults);

    const progress = Math.min((i + chunkSize) / total, 1);
    onProgress?.(progress);

    await yieldToMain();
  }

  return results;
}

/**
 * Yield control back to the main thread
 *
 * Uses Scheduler API if available (Chrome 94+), falls back to setTimeout
 */
export function yieldToMain(): Promise<void> {
  return new Promise((resolve) => {
    // Use Scheduler API if available (better priority handling)
    if (
      typeof globalThis !== "undefined" &&
      "scheduler" in globalThis &&
      typeof (globalThis as unknown as { scheduler: { postTask: (fn: () => void, options: { priority: string }) => void } }).scheduler.postTask === "function"
    ) {
      (globalThis as unknown as { scheduler: { postTask: (fn: () => void, options: { priority: string }) => void } }).scheduler.postTask(resolve, { priority: "user-blocking" });
    } else if (typeof requestIdleCallback !== "undefined") {
      // Use requestIdleCallback for better scheduling
      requestIdleCallback(() => resolve(), { timeout: 50 });
    } else {
      // Fallback to setTimeout
      setTimeout(resolve, 0);
    }
  });
}

/**
 * Create a debounced function
 *
 * @example
 * ```typescript
 * const debouncedSearch = debounce((query: string) => {
 *   performSearch(query);
 * }, 300);
 * ```
 */
export function debounce<T extends (...args: Parameters<T>) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => {
      fn(...args);
      timeoutId = null;
    }, delay);
  };
}

/**
 * Create a throttled function
 *
 * @example
 * ```typescript
 * const throttledScroll = throttle(() => {
 *   updateScrollPosition();
 * }, 100);
 * ```
 */
export function throttle<T extends (...args: Parameters<T>) => void>(
  fn: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Measure execution time of a function
 *
 * @example
 * ```typescript
 * const { result, duration } = await measureTime(async () => {
 *   return await fetchData();
 * });
 * console.log(`Fetched in ${duration}ms`);
 * ```
 */
export async function measureTime<T>(
  fn: () => T | Promise<T>
): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  const result = await fn();
  const duration = performance.now() - start;
  return { result, duration };
}

/**
 * Check if code is running in a Long Task (>50ms)
 * Useful for debugging performance issues
 */
export function isLongTask(startTime: number): boolean {
  return performance.now() - startTime > 50;
}
