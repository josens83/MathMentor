/**
 * CSRF Protection Utilities
 *
 * Cross-Site Request Forgery (CSRF) protection for forms and API routes.
 * Uses the Double Submit Cookie pattern.
 *
 * @module security/csrf
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

/**
 * CSRF token configuration
 */
const CSRF_TOKEN_NAME = "csrf_token";
const CSRF_HEADER_NAME = "x-csrf-token";
const TOKEN_LENGTH = 32;
const TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

/**
 * Generate a cryptographically secure random token
 */
function generateRandomBytes(length: number): string {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    ""
  );
}

/**
 * Create a CSRF token with timestamp for expiration checking
 */
interface CSRFTokenData {
  token: string;
  timestamp: number;
}

/**
 * Generate a new CSRF token
 *
 * @returns CSRF token string
 *
 * @example
 * ```typescript
 * // In a Server Component or API route
 * const token = generateCSRFToken();
 *
 * // Pass to client
 * <input type="hidden" name="csrf_token" value={token} />
 * ```
 */
export function generateCSRFToken(): string {
  const token = generateRandomBytes(TOKEN_LENGTH);
  const timestamp = Date.now();
  const data: CSRFTokenData = { token, timestamp };

  // Encode as base64 for storage
  return Buffer.from(JSON.stringify(data)).toString("base64");
}

/**
 * Parse a CSRF token and extract data
 */
function parseCSRFToken(encodedToken: string): CSRFTokenData | null {
  try {
    const decoded = Buffer.from(encodedToken, "base64").toString("utf-8");
    const data = JSON.parse(decoded) as CSRFTokenData;

    if (typeof data.token !== "string" || typeof data.timestamp !== "number") {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

/**
 * Validate a CSRF token
 *
 * @param token - Token from the request
 * @param cookieToken - Token from the cookie
 * @returns Whether the token is valid
 *
 * @example
 * ```typescript
 * const isValid = validateCSRFToken(requestToken, cookieToken);
 * if (!isValid) {
 *   return new Response('Invalid CSRF token', { status: 403 });
 * }
 * ```
 */
export function validateCSRFToken(
  token: string | null,
  cookieToken: string | null
): boolean {
  if (!token || !cookieToken) {
    return false;
  }

  // Parse both tokens
  const requestData = parseCSRFToken(token);
  const cookieData = parseCSRFToken(cookieToken);

  if (!requestData || !cookieData) {
    return false;
  }

  // Check if tokens match
  if (requestData.token !== cookieData.token) {
    return false;
  }

  // Check if token has expired
  const now = Date.now();
  if (now - cookieData.timestamp > TOKEN_EXPIRY_MS) {
    return false;
  }

  return true;
}

/**
 * Set CSRF token cookie
 *
 * @param token - CSRF token to set
 */
export async function setCSRFCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(CSRF_TOKEN_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: TOKEN_EXPIRY_MS / 1000,
  });
}

/**
 * Get CSRF token from cookie
 */
export async function getCSRFCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(CSRF_TOKEN_NAME)?.value ?? null;
}

/**
 * CSRF protection middleware for API routes
 *
 * Validates CSRF token for state-changing requests (POST, PUT, DELETE, PATCH)
 *
 * @example
 * ```typescript
 * export const POST = csrfMiddleware(async (request) => {
 *   // CSRF token has been validated
 *   return NextResponse.json({ success: true });
 * });
 * ```
 */
export function csrfMiddleware<T>(
  handler: (request: NextRequest) => Promise<T>
): (request: NextRequest) => Promise<T | NextResponse> {
  return async (request: NextRequest) => {
    // Only validate for state-changing methods
    const method = request.method.toUpperCase();
    if (!["POST", "PUT", "DELETE", "PATCH"].includes(method)) {
      return handler(request);
    }

    // Get token from header or body
    let requestToken = request.headers.get(CSRF_HEADER_NAME);

    if (!requestToken) {
      // Try to get from body for form submissions
      try {
        const contentType = request.headers.get("content-type");
        if (contentType?.includes("application/x-www-form-urlencoded")) {
          const formData = await request.clone().formData();
          requestToken = formData.get(CSRF_TOKEN_NAME) as string | null;
        } else if (contentType?.includes("application/json")) {
          const body = await request.clone().json();
          requestToken = body[CSRF_TOKEN_NAME] as string | null;
        }
      } catch {
        // Ignore parsing errors
      }
    }

    // Get token from cookie
    const cookieToken = request.cookies.get(CSRF_TOKEN_NAME)?.value ?? null;

    // Validate
    if (!validateCSRFToken(requestToken, cookieToken)) {
      return NextResponse.json(
        { error: "Invalid or missing CSRF token" },
        { status: 403 }
      );
    }

    return handler(request);
  };
}

/**
 * React hook helper - get CSRF token for forms
 *
 * @example
 * ```tsx
 * // In a Client Component
 * 'use client';
 *
 * function ContactForm({ csrfToken }: { csrfToken: string }) {
 *   return (
 *     <form action="/api/contact" method="POST">
 *       <input type="hidden" name="csrf_token" value={csrfToken} />
 *       {/* form fields *\/}
 *     </form>
 *   );
 * }
 * ```
 */

/**
 * Generate CSRF token and set cookie (for Server Components)
 *
 * @example
 * ```tsx
 * // In a Server Component
 * import { getCSRFProps } from '@/lib/security/csrf';
 *
 * export default async function Page() {
 *   const { token } = await getCSRFProps();
 *
 *   return <ContactForm csrfToken={token} />;
 * }
 * ```
 */
export async function getCSRFProps(): Promise<{ token: string }> {
  const token = generateCSRFToken();
  await setCSRFCookie(token);
  return { token };
}

/**
 * Verify CSRF token for Server Actions
 *
 * @example
 * ```typescript
 * 'use server';
 *
 * export async function submitForm(formData: FormData) {
 *   await verifyCSRFForServerAction(formData);
 *   // Continue with form processing
 * }
 * ```
 */
export async function verifyCSRFForServerAction(
  formData: FormData
): Promise<void> {
  const requestToken = formData.get(CSRF_TOKEN_NAME) as string | null;
  const cookieToken = await getCSRFCookie();

  if (!validateCSRFToken(requestToken, cookieToken)) {
    throw new Error("Invalid CSRF token");
  }
}
