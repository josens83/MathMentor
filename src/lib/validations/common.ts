import { z } from "zod";

// ============================================
// Common Schemas
// ============================================

export const emailSchema = z
  .string()
  .email("유효한 이메일 주소를 입력하세요")
  .max(255, "이메일은 255자 이하여야 합니다")
  .toLowerCase()
  .trim();

export const passwordSchema = z
  .string()
  .min(8, "비밀번호는 8자 이상이어야 합니다")
  .max(100, "비밀번호는 100자 이하여야 합니다")
  .regex(
    /^(?=.*[a-zA-Z])(?=.*\d)/,
    "비밀번호는 영문자와 숫자를 포함해야 합니다"
  );

export const uuidSchema = z.string().uuid("유효한 ID가 아닙니다");

export const displayNameSchema = z
  .string()
  .min(1, "이름을 입력하세요")
  .max(50, "이름은 50자 이하여야 합니다")
  .trim();

export const usernameSchema = z
  .string()
  .min(3, "사용자명은 3자 이상이어야 합니다")
  .max(30, "사용자명은 30자 이하여야 합니다")
  .regex(
    /^[a-zA-Z0-9_]+$/,
    "사용자명은 영문, 숫자, 밑줄만 사용할 수 있습니다"
  )
  .toLowerCase();

// ============================================
// Pagination
// ============================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type Pagination = z.infer<typeof paginationSchema>;

// ============================================
// Math Level
// ============================================

export const mathLevelSchema = z.enum([
  "elementary",
  "middle",
  "high",
  "university",
  "adult",
]);

export type MathLevel = z.infer<typeof mathLevelSchema>;

// ============================================
// Subscription Tier
// ============================================

export const subscriptionTierSchema = z.enum(["free", "pro", "premium"]);

export type SubscriptionTier = z.infer<typeof subscriptionTierSchema>;

// ============================================
// Problem Type
// ============================================

export const problemTypeSchema = z.enum([
  "multiple_choice",
  "short_answer",
  "equation_solve",
  "fill_blank",
  "step_by_step",
  "graph_interpret",
  "word_problem",
  "proof",
]);

export type ProblemType = z.infer<typeof problemTypeSchema>;
