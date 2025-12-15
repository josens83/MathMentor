/**
 * Security Module
 *
 * Centralized security utilities for MathMentor.
 * Implements OWASP Top 10 security best practices.
 *
 * @module security
 */

export {
  escapeHtml,
  stripHtml,
  sanitizeHtml,
  sanitizeInput,
  sanitizeFilename,
  sanitizeUrl,
  safeJsonStringify,
  sanitizeObjectKeys,
  checkRateLimit,
  cleanupRateLimits,
  type RateLimitConfig,
} from "./sanitize";

export {
  verifyAuth,
  requireAuth,
  requireRole,
  hasPermission,
  type AuthContext,
  type Permission,
  type Role,
  ROLE_PERMISSIONS,
} from "./auth";

export {
  validateEnv,
  getEnv,
  env,
  type EnvConfig,
} from "./env";

export {
  generateCSRFToken,
  validateCSRFToken,
  csrfMiddleware,
} from "./csrf";
