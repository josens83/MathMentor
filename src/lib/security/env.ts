/**
 * Environment Variable Validation
 *
 * Validates and type-checks environment variables at startup.
 * Fails fast if required variables are missing or invalid.
 *
 * @module security/env
 */

import { z } from "zod";

/**
 * Schema for server-side environment variables
 * These should NEVER be exposed to the client
 */
const serverEnvSchema = z.object({
  // Supabase Service Role (server-only)
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "SUPABASE_SERVICE_ROLE_KEY is required")
    .refine(
      (key) => key.startsWith("eyJ"),
      "SUPABASE_SERVICE_ROLE_KEY must be a valid JWT"
    ),

  // Anthropic API Key (server-only)
  ANTHROPIC_API_KEY: z
    .string()
    .min(1, "ANTHROPIC_API_KEY is required")
    .refine(
      (key) => key.startsWith("sk-ant-"),
      "ANTHROPIC_API_KEY must start with 'sk-ant-'"
    ),

  // Stripe Secret Key (server-only)
  STRIPE_SECRET_KEY: z
    .string()
    .min(1, "STRIPE_SECRET_KEY is required")
    .refine(
      (key) => key.startsWith("sk_"),
      "STRIPE_SECRET_KEY must start with 'sk_'"
    ),

  // Stripe Webhook Secret (server-only)
  STRIPE_WEBHOOK_SECRET: z
    .string()
    .min(1, "STRIPE_WEBHOOK_SECRET is required")
    .refine(
      (key) => key.startsWith("whsec_"),
      "STRIPE_WEBHOOK_SECRET must start with 'whsec_'"
    ),

  // Optional: Database URL for direct connections
  DATABASE_URL: z.string().url().optional(),

  // Node environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

/**
 * Schema for client-side environment variables
 * These are exposed via NEXT_PUBLIC_ prefix
 */
const clientEnvSchema = z.object({
  // Supabase (public)
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL"),

  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY is required")
    .refine(
      (key) => key.startsWith("eyJ"),
      "NEXT_PUBLIC_SUPABASE_ANON_KEY must be a valid JWT"
    ),

  // Stripe (public)
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is required")
    .refine(
      (key) => key.startsWith("pk_"),
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must start with 'pk_'"
    ),

  // App URL
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
});

/**
 * Combined environment schema
 */
const envSchema = serverEnvSchema.merge(clientEnvSchema);

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Cached validated environment
 */
let cachedEnv: EnvConfig | null = null;

/**
 * Validate all environment variables
 *
 * @throws Error if any required variables are missing or invalid
 * @returns Validated environment object
 *
 * @example
 * ```typescript
 * // In app initialization
 * const env = validateEnv();
 *
 * // Now use with full type safety
 * const apiKey = env.ANTHROPIC_API_KEY;
 * ```
 */
export function validateEnv(): EnvConfig {
  if (cachedEnv) {
    return cachedEnv;
  }

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const errors = result.error.errors
      .map((err) => `  - ${err.path.join(".")}: ${err.message}`)
      .join("\n");

    console.error("❌ Environment validation failed:\n" + errors);

    // In development, show warnings but don't crash
    if (process.env.NODE_ENV === "development") {
      console.warn(
        "⚠️  Running in development mode with missing env vars. Some features may not work."
      );

      // Return partial env for development
      cachedEnv = result.data as unknown as EnvConfig;
      return cachedEnv;
    }

    throw new Error(`Environment validation failed:\n${errors}`);
  }

  cachedEnv = result.data;
  return cachedEnv;
}

/**
 * Get a specific environment variable with validation
 *
 * @param key - Environment variable name
 * @returns Validated value
 *
 * @example
 * ```typescript
 * const apiKey = getEnv('ANTHROPIC_API_KEY');
 * ```
 */
export function getEnv<K extends keyof EnvConfig>(key: K): EnvConfig[K] {
  const env = validateEnv();
  return env[key];
}

/**
 * Pre-validated environment object
 * Use this for type-safe access to environment variables
 *
 * @example
 * ```typescript
 * import { env } from '@/lib/security/env';
 *
 * // Type-safe access
 * const url = env.NEXT_PUBLIC_SUPABASE_URL;
 * ```
 */
export const env = new Proxy({} as EnvConfig, {
  get(_, prop: string) {
    const validated = validateEnv();
    return validated[prop as keyof EnvConfig];
  },
});

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === "production";
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Check if running in test environment
 */
export function isTest(): boolean {
  return process.env.NODE_ENV === "test";
}

/**
 * Mask sensitive data for logging
 *
 * @param value - Sensitive string to mask
 * @param visibleChars - Number of characters to show at start and end
 * @returns Masked string
 *
 * @example
 * ```typescript
 * maskSensitive('sk-ant-api03-abc123xyz');
 * // Returns: 'sk-a...xyz'
 * ```
 */
export function maskSensitive(value: string, visibleChars = 4): string {
  if (value.length <= visibleChars * 2) {
    return "****";
  }
  return `${value.slice(0, visibleChars)}...${value.slice(-visibleChars)}`;
}

/**
 * Log environment status (safe for production)
 * Only shows whether variables are set, not their values
 */
export function logEnvStatus(): void {
  const requiredVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    "SUPABASE_SERVICE_ROLE_KEY",
    "ANTHROPIC_API_KEY",
    "STRIPE_SECRET_KEY",
    "STRIPE_WEBHOOK_SECRET",
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
  ];

  console.log("Environment Status:");
  for (const varName of requiredVars) {
    const isSet = !!process.env[varName];
    console.log(`  ${varName}: ${isSet ? "✅ Set" : "❌ Missing"}`);
  }
}
