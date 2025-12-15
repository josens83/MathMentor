/**
 * Security Utilities - Sanitization & XSS Prevention
 *
 * OWASP Top 10 compliant security utilities for input sanitization,
 * XSS prevention, and safe content handling.
 *
 * @module security/sanitize
 */

/**
 * HTML entities to escape for XSS prevention
 */
const HTML_ENTITIES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#x27;",
  "/": "&#x2F;",
  "`": "&#x60;",
  "=": "&#x3D;",
};

/**
 * Escape HTML special characters to prevent XSS attacks
 *
 * @param input - Raw string that may contain HTML
 * @returns Escaped string safe for HTML insertion
 *
 * @example
 * ```typescript
 * escapeHtml('<script>alert("xss")</script>');
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'
 * ```
 */
export function escapeHtml(input: string): string {
  if (typeof input !== "string") {
    return "";
  }
  return input.replace(/[&<>"'`=/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Sanitize a string for safe display (removes HTML tags)
 *
 * @param input - Raw string that may contain HTML
 * @returns String with all HTML tags removed
 *
 * @example
 * ```typescript
 * stripHtml('<p>Hello <b>World</b></p>');
 * // Returns: 'Hello World'
 * ```
 */
export function stripHtml(input: string): string {
  if (typeof input !== "string") {
    return "";
  }
  return input.replace(/<[^>]*>/g, "");
}

/**
 * Allowed HTML tags for rich text content (whitelist approach)
 */
const ALLOWED_TAGS = new Set([
  "p",
  "br",
  "b",
  "i",
  "u",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "blockquote",
  "code",
  "pre",
  "span",
  "div",
  "a",
]);

/**
 * Allowed attributes for HTML tags (whitelist approach)
 */
const ALLOWED_ATTRIBUTES: Record<string, Set<string>> = {
  a: new Set(["href", "title", "target", "rel"]),
  span: new Set(["class"]),
  div: new Set(["class"]),
  code: new Set(["class"]),
  pre: new Set(["class"]),
};

/**
 * Sanitize HTML content using whitelist approach
 * Only allows safe tags and attributes
 *
 * @param input - Raw HTML string
 * @returns Sanitized HTML with only allowed tags/attributes
 *
 * @example
 * ```typescript
 * sanitizeHtml('<p onclick="alert(1)">Hello</p><script>bad</script>');
 * // Returns: '<p>Hello</p>'
 * ```
 */
export function sanitizeHtml(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  // Remove script tags and their content completely
  let sanitized = input.replace(
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    ""
  );

  // Remove event handlers (onclick, onerror, etc.)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, "");
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, "");

  // Remove javascript: URLs
  sanitized = sanitized.replace(/javascript:/gi, "");

  // Remove data: URLs (can be used for XSS)
  sanitized = sanitized.replace(/data:/gi, "");

  // Process tags
  sanitized = sanitized.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tagName) => {
    const tag = tagName.toLowerCase();

    if (!ALLOWED_TAGS.has(tag)) {
      return "";
    }

    // Check if it's a closing tag
    if (match.startsWith("</")) {
      return `</${tag}>`;
    }

    // Extract and filter attributes
    const allowedAttrs = ALLOWED_ATTRIBUTES[tag];
    if (!allowedAttrs) {
      return `<${tag}>`;
    }

    const attrMatches = match.matchAll(/(\w+)\s*=\s*["']([^"']*)["']/g);
    const safeAttrs: string[] = [];

    for (const attrMatch of attrMatches) {
      const attrName = attrMatch[1].toLowerCase();
      let attrValue = attrMatch[2];

      if (allowedAttrs.has(attrName)) {
        // Special handling for href - only allow safe protocols
        if (attrName === "href") {
          if (!/^(https?:\/\/|mailto:|\/|#)/.test(attrValue)) {
            continue;
          }
          // Escape the href value
          attrValue = escapeHtml(attrValue);
        }

        // Force target="_blank" links to have rel="noopener noreferrer"
        if (attrName === "target" && attrValue === "_blank") {
          safeAttrs.push('rel="noopener noreferrer"');
        }

        safeAttrs.push(`${attrName}="${attrValue}"`);
      }
    }

    return safeAttrs.length > 0 ? `<${tag} ${safeAttrs.join(" ")}>` : `<${tag}>`;
  });

  return sanitized;
}

/**
 * Sanitize user input for database storage
 * Trims whitespace and normalizes unicode
 *
 * @param input - Raw user input
 * @returns Sanitized string safe for storage
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") {
    return "";
  }

  return input
    .trim()
    .normalize("NFC") // Normalize unicode
    .replace(/\0/g, "") // Remove null bytes
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, ""); // Remove control characters
}

/**
 * Sanitize filename to prevent path traversal attacks
 *
 * @param filename - Raw filename
 * @returns Safe filename
 *
 * @example
 * ```typescript
 * sanitizeFilename('../../../etc/passwd');
 * // Returns: 'etc_passwd'
 * ```
 */
export function sanitizeFilename(filename: string): string {
  if (typeof filename !== "string") {
    return "";
  }

  return filename
    .replace(/\.\./g, "") // Remove path traversal
    .replace(/[/\\]/g, "_") // Replace path separators
    .replace(/[<>:"|?*\x00-\x1F]/g, "_") // Replace invalid characters
    .replace(/^\.+/, "") // Remove leading dots
    .substring(0, 255); // Limit length
}

/**
 * Validate and sanitize URL
 *
 * @param url - Raw URL string
 * @returns Sanitized URL or null if invalid
 *
 * @example
 * ```typescript
 * sanitizeUrl('javascript:alert(1)');
 * // Returns: null
 *
 * sanitizeUrl('https://example.com');
 * // Returns: 'https://example.com'
 * ```
 */
export function sanitizeUrl(url: string): string | null {
  if (typeof url !== "string") {
    return null;
  }

  try {
    const parsed = new URL(url);

    // Only allow http and https protocols
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return null;
    }

    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Create a safe JSON string from user input
 * Prevents JSON injection attacks
 *
 * @param data - Data to stringify
 * @returns Safe JSON string
 */
export function safeJsonStringify(data: unknown): string {
  return JSON.stringify(data, (_, value) => {
    if (typeof value === "string") {
      // Escape potentially dangerous characters in strings
      return value
        .replace(/</g, "\\u003c")
        .replace(/>/g, "\\u003e")
        .replace(/&/g, "\\u0026");
    }
    return value;
  });
}

/**
 * Sanitize object keys to prevent prototype pollution
 *
 * @param obj - Object to sanitize
 * @returns Object with safe keys only
 */
export function sanitizeObjectKeys<T extends Record<string, unknown>>(
  obj: T
): Partial<T> {
  const dangerous = new Set(["__proto__", "constructor", "prototype"]);
  const result: Partial<T> = {};

  for (const key of Object.keys(obj)) {
    if (!dangerous.has(key)) {
      result[key as keyof T] = obj[key as keyof T];
    }
  }

  return result;
}

/**
 * Rate limiting helper for API endpoints
 */
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Check if a request should be rate limited
 *
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Whether the request should be allowed
 *
 * @example
 * ```typescript
 * const allowed = checkRateLimit(userId, {
 *   windowMs: 60000, // 1 minute
 *   maxRequests: 10  // 10 requests per minute
 * });
 * ```
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetTime) {
    // Create new window
    const resetTime = now + config.windowMs;
    rateLimitStore.set(identifier, { count: 1, resetTime });
    return { allowed: true, remaining: config.maxRequests - 1, resetTime };
  }

  if (record.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  record.count++;
  return {
    allowed: true,
    remaining: config.maxRequests - record.count,
    resetTime: record.resetTime,
  };
}

/**
 * Clear expired rate limit entries (call periodically)
 */
export function cleanupRateLimits(): void {
  const now = Date.now();
  for (const [key, value] of rateLimitStore) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}
