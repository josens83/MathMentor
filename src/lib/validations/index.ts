// Re-export all validations from a single entry point
export * from "./common";
export * from "./auth";
export * from "./problem";

// ============================================
// Utility: Safe Parse with Error Messages
// ============================================

import { z } from "zod";

/**
 * Safely parse data with a Zod schema and return formatted errors
 */
export function safeParse<T extends z.ZodType>(
  schema: T,
  data: unknown
): {
  success: true;
  data: z.infer<T>;
} | {
  success: false;
  errors: Record<string, string[]>;
} {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  // Zod v4 uses flatten() to get structured errors
  const flatErrors = result.error.flatten();
  const errors: Record<string, string[]> = {};

  // Field errors
  for (const [field, messages] of Object.entries(flatErrors.fieldErrors)) {
    if (messages && messages.length > 0) {
      errors[field] = messages as string[];
    }
  }

  // Form-level errors (root)
  if (flatErrors.formErrors.length > 0) {
    errors["root"] = flatErrors.formErrors;
  }

  return { success: false, errors };
}

/**
 * Parse or throw with formatted error message
 */
export function parseOrThrow<T extends z.ZodType>(
  schema: T,
  data: unknown,
  errorMessage = "Validation failed"
): z.infer<T> {
  const result = schema.safeParse(data);

  if (!result.success) {
    const flatErrors = result.error.flatten();
    const allErrors: string[] = [];

    // Collect field errors
    for (const [field, messages] of Object.entries(flatErrors.fieldErrors)) {
      if (messages && messages.length > 0) {
        allErrors.push(`${field}: ${(messages as string[]).join(", ")}`);
      }
    }

    // Collect form errors
    if (flatErrors.formErrors.length > 0) {
      allErrors.push(flatErrors.formErrors.join(", "));
    }

    throw new Error(`${errorMessage}: ${allErrors.join("; ")}`);
  }

  return result.data;
}
