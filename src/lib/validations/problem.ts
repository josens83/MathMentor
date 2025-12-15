import { z } from "zod";
import { uuidSchema, problemTypeSchema } from "./common";

// ============================================
// Problem Answer
// ============================================

export const problemAnswerSchema = z.object({
  problemId: uuidSchema,
  answer: z
    .string()
    .min(1, "답을 입력하세요")
    .max(10000, "답이 너무 깁니다"),
  timeSpentSeconds: z
    .number()
    .int()
    .nonnegative()
    .max(3600, "시간이 1시간을 초과했습니다"),
  hintsUsed: z.number().int().nonnegative().max(10).default(0),
});

export type ProblemAnswerInput = z.infer<typeof problemAnswerSchema>;

// ============================================
// AI Hint Request
// ============================================

export const hintRequestSchema = z.object({
  problem: z.string().min(1).max(5000),
  hintLevel: z.number().int().min(1).max(3).default(1),
  currentWork: z.string().max(5000).optional(),
});

export type HintRequestInput = z.infer<typeof hintRequestSchema>;

// ============================================
// AI Question
// ============================================

export const aiQuestionSchema = z.object({
  question: z
    .string()
    .min(1, "질문을 입력하세요")
    .max(2000, "질문이 너무 깁니다"),
  context: z
    .object({
      problemId: uuidSchema.optional(),
      topicId: uuidSchema.optional(),
      currentAnswer: z.string().max(5000).optional(),
    })
    .optional(),
});

export type AIQuestionInput = z.infer<typeof aiQuestionSchema>;

// ============================================
// Problem Feedback
// ============================================

export const problemFeedbackSchema = z.object({
  problemId: uuidSchema,
  feedbackType: z.enum(["too_easy", "too_hard", "unclear", "error", "other"]),
  comment: z.string().max(1000).optional(),
});

export type ProblemFeedbackInput = z.infer<typeof problemFeedbackSchema>;

// ============================================
// Create Problem (Admin)
// ============================================

export const createProblemSchema = z.object({
  topicId: uuidSchema,
  lessonId: uuidSchema.optional(),
  problemType: problemTypeSchema,
  difficulty: z.number().int().min(1).max(5),
  question: z.string().min(1).max(5000),
  questionLatex: z.string().max(5000).optional(),
  options: z.array(z.string().max(1000)).max(10).optional(),
  correctAnswer: z.string().min(1).max(1000),
  solutionSteps: z.array(z.string().max(2000)).max(20).optional(),
  hints: z.array(z.string().max(1000)).max(5).optional(),
  explanation: z.string().max(5000).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
  isPremium: z.boolean().default(false),
});

export type CreateProblemInput = z.infer<typeof createProblemSchema>;
