import { describe, it, expect } from "vitest";
import {
  loginSchema,
  signupSchema,
  hintRequestSchema,
  problemAnswerSchema,
  safeParse,
  parseOrThrow,
} from "../validations";

describe("loginSchema", () => {
  it("should validate correct login data", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("should lowercase email", () => {
    const result = loginSchema.safeParse({
      email: "TEST@EXAMPLE.COM",
      password: "password123",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("test@example.com");
    }
  });

  it("should reject invalid email", () => {
    const result = loginSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    });
    expect(result.success).toBe(false);
  });

  it("should reject empty password", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "",
    });
    expect(result.success).toBe(false);
  });
});

describe("signupSchema", () => {
  const validSignup = {
    email: "test@example.com",
    password: "password123",
    confirmPassword: "password123",
    displayName: "Test User",
    mathLevel: "middle" as const,
    agreeToTerms: true as const,
  };

  it("should validate correct signup data", () => {
    const result = signupSchema.safeParse(validSignup);
    expect(result.success).toBe(true);
  });

  it("should reject mismatched passwords", () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      confirmPassword: "different123",
    });
    expect(result.success).toBe(false);
  });

  it("should reject weak passwords", () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      password: "weak",
      confirmPassword: "weak",
    });
    expect(result.success).toBe(false);
  });

  it("should reject passwords without numbers", () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      password: "onlyletters",
      confirmPassword: "onlyletters",
    });
    expect(result.success).toBe(false);
  });

  it("should require terms agreement", () => {
    const result = signupSchema.safeParse({
      ...validSignup,
      agreeToTerms: false,
    });
    expect(result.success).toBe(false);
  });
});

describe("hintRequestSchema", () => {
  it("should validate correct hint request", () => {
    const result = hintRequestSchema.safeParse({
      problem: "2x + 3 = 7을 풀어주세요",
      hintLevel: 1,
    });
    expect(result.success).toBe(true);
  });

  it("should apply default hint level", () => {
    const result = hintRequestSchema.safeParse({
      problem: "문제입니다",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.hintLevel).toBe(1);
    }
  });

  it("should reject empty problem", () => {
    const result = hintRequestSchema.safeParse({
      problem: "",
    });
    expect(result.success).toBe(false);
  });

  it("should reject invalid hint level", () => {
    const result = hintRequestSchema.safeParse({
      problem: "문제",
      hintLevel: 5,
    });
    expect(result.success).toBe(false);
  });

  it("should accept optional currentWork", () => {
    const result = hintRequestSchema.safeParse({
      problem: "문제",
      hintLevel: 2,
      currentWork: "내 풀이 과정...",
    });
    expect(result.success).toBe(true);
  });
});

describe("problemAnswerSchema", () => {
  const validUUID = "123e4567-e89b-12d3-a456-426614174000";

  it("should validate correct answer submission", () => {
    const result = problemAnswerSchema.safeParse({
      problemId: validUUID,
      answer: "x = 2",
      timeSpentSeconds: 120,
      hintsUsed: 1,
    });
    expect(result.success).toBe(true);
  });

  it("should apply default hintsUsed", () => {
    const result = problemAnswerSchema.safeParse({
      problemId: validUUID,
      answer: "답",
      timeSpentSeconds: 60,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.hintsUsed).toBe(0);
    }
  });

  it("should reject invalid UUID", () => {
    const result = problemAnswerSchema.safeParse({
      problemId: "not-a-uuid",
      answer: "답",
      timeSpentSeconds: 60,
    });
    expect(result.success).toBe(false);
  });

  it("should reject negative time", () => {
    const result = problemAnswerSchema.safeParse({
      problemId: validUUID,
      answer: "답",
      timeSpentSeconds: -10,
    });
    expect(result.success).toBe(false);
  });

  it("should reject time over 1 hour", () => {
    const result = problemAnswerSchema.safeParse({
      problemId: validUUID,
      answer: "답",
      timeSpentSeconds: 3601,
    });
    expect(result.success).toBe(false);
  });
});

describe("safeParse utility", () => {
  it("should return success with data for valid input", () => {
    const result = safeParse(loginSchema, {
      email: "test@example.com",
      password: "pass",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("test@example.com");
    }
  });

  it("should return formatted errors for invalid input", () => {
    const result = safeParse(loginSchema, {
      email: "invalid",
      password: "",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errors).toHaveProperty("email");
      expect(result.errors).toHaveProperty("password");
    }
  });
});

describe("parseOrThrow utility", () => {
  it("should return data for valid input", () => {
    const data = parseOrThrow(loginSchema, {
      email: "test@example.com",
      password: "pass",
    });
    expect(data.email).toBe("test@example.com");
  });

  it("should throw for invalid input", () => {
    expect(() =>
      parseOrThrow(loginSchema, { email: "invalid" })
    ).toThrow();
  });

  it("should include custom error message", () => {
    expect(() =>
      parseOrThrow(loginSchema, { email: "invalid" }, "Login failed")
    ).toThrow("Login failed");
  });
});
