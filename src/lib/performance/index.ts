/**
 * Performance Utilities
 *
 * Tools for optimizing application performance and preventing Long Tasks.
 *
 * @module performance
 */

export {
  processInChunks,
  processInChunksAsync,
  yieldToMain,
  debounce,
  throttle,
  measureTime,
  isLongTask,
  type ChunkOptions,
} from "./chunk-processor";
