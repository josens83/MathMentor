import { z } from "zod";
import {
  emailSchema,
  passwordSchema,
  displayNameSchema,
  mathLevelSchema,
} from "./common";

// ============================================
// Login
// ============================================

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "비밀번호를 입력하세요"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// ============================================
// Signup
// ============================================

export const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
    displayName: displayNameSchema,
    mathLevel: mathLevelSchema.default("middle"),
    agreeToTerms: z.literal(true, {
      errorMap: () => ({ message: "이용약관에 동의해주세요" }),
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

export type SignupInput = z.infer<typeof signupSchema>;

// ============================================
// Forgot Password
// ============================================

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// ============================================
// Reset Password
// ============================================

export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호가 일치하지 않습니다",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

// ============================================
// Update Profile
// ============================================

export const updateProfileSchema = z.object({
  displayName: displayNameSchema.optional(),
  mathLevel: mathLevelSchema.optional(),
  dailyGoalProblems: z.number().int().min(1).max(50).optional(),
  avatarUrl: z.string().url().optional().nullable(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
