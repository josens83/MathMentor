/**
 * Authentication & Authorization Middleware
 *
 * Role-Based Access Control (RBAC) implementation
 * for MathMentor API routes.
 *
 * @module security/auth
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * User roles in MathMentor
 */
export type Role = "guest" | "user" | "premium" | "tutor" | "admin";

/**
 * Available permissions in the system
 */
export type Permission =
  | "read:problems"
  | "solve:problems"
  | "read:hints"
  | "read:solutions"
  | "use:ai_tutor"
  | "unlimited:energy"
  | "create:problems"
  | "manage:users"
  | "manage:content"
  | "view:analytics"
  | "manage:billing";

/**
 * Role-Permission mapping
 * Each role inherits permissions from lower roles
 */
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  guest: ["read:problems"],
  user: ["read:problems", "solve:problems", "read:hints"],
  premium: [
    "read:problems",
    "solve:problems",
    "read:hints",
    "read:solutions",
    "use:ai_tutor",
    "unlimited:energy",
  ],
  tutor: [
    "read:problems",
    "solve:problems",
    "read:hints",
    "read:solutions",
    "use:ai_tutor",
    "unlimited:energy",
    "create:problems",
    "view:analytics",
  ],
  admin: [
    "read:problems",
    "solve:problems",
    "read:hints",
    "read:solutions",
    "use:ai_tutor",
    "unlimited:energy",
    "create:problems",
    "manage:users",
    "manage:content",
    "view:analytics",
    "manage:billing",
  ],
};

/**
 * Authenticated user context
 */
export interface AuthContext {
  userId: string;
  email: string;
  role: Role;
  permissions: Permission[];
}

/**
 * Verify authentication and return user context
 *
 * @param request - Next.js request object
 * @returns Auth context or null if not authenticated
 *
 * @example
 * ```typescript
 * export async function GET(request: NextRequest) {
 *   const auth = await verifyAuth(request);
 *   if (!auth) {
 *     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 *   }
 *   // Use auth.userId, auth.role, etc.
 * }
 * ```
 */
export async function verifyAuth(
  request: NextRequest
): Promise<AuthContext | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    // Fetch user's role from profiles table
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role: Role = (profile?.role as Role) || "user";
    const permissions = ROLE_PERMISSIONS[role];

    return {
      userId: user.id,
      email: user.email || "",
      role,
      permissions,
    };
  } catch {
    return null;
  }
}

/**
 * Check if user has a specific permission
 *
 * @param auth - Auth context
 * @param permission - Permission to check
 * @returns Whether user has the permission
 */
export function hasPermission(
  auth: AuthContext | null,
  permission: Permission
): boolean {
  if (!auth) return false;
  return auth.permissions.includes(permission);
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(
  auth: AuthContext | null,
  permissions: Permission[]
): boolean {
  if (!auth) return false;
  return permissions.some((p) => auth.permissions.includes(p));
}

/**
 * Check if user has all of the specified permissions
 */
export function hasAllPermissions(
  auth: AuthContext | null,
  permissions: Permission[]
): boolean {
  if (!auth) return false;
  return permissions.every((p) => auth.permissions.includes(p));
}

/**
 * Higher-order function to require authentication
 *
 * @example
 * ```typescript
 * export const GET = requireAuth(async (request, auth) => {
 *   // auth is guaranteed to be valid here
 *   return NextResponse.json({ userId: auth.userId });
 * });
 * ```
 */
export function requireAuth<T>(
  handler: (request: NextRequest, auth: AuthContext) => Promise<T>
): (request: NextRequest) => Promise<T | NextResponse> {
  return async (request: NextRequest) => {
    const auth = await verifyAuth(request);

    if (!auth) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return handler(request, auth);
  };
}

/**
 * Higher-order function to require specific role(s)
 *
 * @example
 * ```typescript
 * export const POST = requireRole(['admin', 'tutor'])(async (request, auth) => {
 *   // Only admins and tutors can reach here
 *   return NextResponse.json({ success: true });
 * });
 * ```
 */
export function requireRole<T>(
  allowedRoles: Role[]
): (
  handler: (request: NextRequest, auth: AuthContext) => Promise<T>
) => (request: NextRequest) => Promise<T | NextResponse> {
  return (handler) => async (request: NextRequest) => {
    const auth = await verifyAuth(request);

    if (!auth) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (!allowedRoles.includes(auth.role)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    return handler(request, auth);
  };
}

/**
 * Higher-order function to require specific permission(s)
 *
 * @example
 * ```typescript
 * export const POST = requirePermission('create:problems')(async (request, auth) => {
 *   // Only users with create:problems permission can reach here
 *   return NextResponse.json({ success: true });
 * });
 * ```
 */
export function requirePermission<T>(
  permission: Permission
): (
  handler: (request: NextRequest, auth: AuthContext) => Promise<T>
) => (request: NextRequest) => Promise<T | NextResponse> {
  return (handler) => async (request: NextRequest) => {
    const auth = await verifyAuth(request);

    if (!auth) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    if (!hasPermission(auth, permission)) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    return handler(request, auth);
  };
}

/**
 * Rate limiting decorator for API routes
 * Combines auth check with rate limiting
 *
 * @example
 * ```typescript
 * export const POST = withRateLimit(
 *   { windowMs: 60000, maxRequests: 10 },
 *   async (request, auth) => {
 *     // Rate limited and authenticated
 *   }
 * );
 * ```
 */
export function withRateLimit<T>(
  config: { windowMs: number; maxRequests: number },
  handler: (request: NextRequest, auth: AuthContext) => Promise<T>
): (request: NextRequest) => Promise<T | NextResponse> {
  const rateLimitStore = new Map<
    string,
    { count: number; resetTime: number }
  >();

  return async (request: NextRequest) => {
    const auth = await verifyAuth(request);

    if (!auth) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Use userId as rate limit key
    const now = Date.now();
    const record = rateLimitStore.get(auth.userId);

    if (!record || now > record.resetTime) {
      rateLimitStore.set(auth.userId, {
        count: 1,
        resetTime: now + config.windowMs,
      });
    } else if (record.count >= config.maxRequests) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded",
          retryAfter: Math.ceil((record.resetTime - now) / 1000),
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(Math.ceil((record.resetTime - now) / 1000)),
          },
        }
      );
    } else {
      record.count++;
    }

    return handler(request, auth);
  };
}

/**
 * API key authentication for external integrations
 *
 * @example
 * ```typescript
 * export const POST = requireApiKey(async (request) => {
 *   // Valid API key verified
 * });
 * ```
 */
export function requireApiKey<T>(
  handler: (request: NextRequest) => Promise<T>
): (request: NextRequest) => Promise<T | NextResponse> {
  return async (request: NextRequest) => {
    const apiKey = request.headers.get("x-api-key");

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key required" },
        { status: 401 }
      );
    }

    // In production, validate against database
    // This is a placeholder for the validation logic
    const isValid = await validateApiKey(apiKey);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    return handler(request);
  };
}

/**
 * Validate API key (placeholder - implement with your database)
 */
async function validateApiKey(apiKey: string): Promise<boolean> {
  // TODO: Implement API key validation with Supabase
  // This should check the api_keys table and verify:
  // 1. Key exists
  // 2. Key is not expired
  // 3. Key is not revoked
  // 4. Rate limits are not exceeded
  return apiKey.length > 0;
}
