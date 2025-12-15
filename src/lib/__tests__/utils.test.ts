import { describe, it, expect } from "vitest";
import {
  cn,
  formatNumber,
  formatTime,
  calculateLevel,
  xpForLevel,
  xpToNextLevel,
  getStreakEmoji,
} from "../utils";

describe("cn (className merge)", () => {
  it("should merge class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("should handle conditional classes", () => {
    expect(cn("base", true && "active", false && "hidden")).toBe("base active");
  });

  it("should merge Tailwind classes correctly", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
  });

  it("should handle undefined and null", () => {
    expect(cn("base", undefined, null, "end")).toBe("base end");
  });
});

describe("formatNumber", () => {
  it("should format numbers under 1000 with locale", () => {
    expect(formatNumber(500)).toBe("500");
    expect(formatNumber(999)).toBe("999");
  });

  it("should format thousands with K", () => {
    expect(formatNumber(1000)).toBe("1.0K");
    expect(formatNumber(1500)).toBe("1.5K");
    expect(formatNumber(10000)).toBe("10.0K");
    expect(formatNumber(999999)).toBe("1000.0K");
  });

  it("should format millions with M", () => {
    expect(formatNumber(1000000)).toBe("1.0M");
    expect(formatNumber(2500000)).toBe("2.5M");
  });
});

describe("formatTime", () => {
  it("should format seconds to mm:ss", () => {
    expect(formatTime(0)).toBe("0:00");
    expect(formatTime(30)).toBe("0:30");
    expect(formatTime(60)).toBe("1:00");
    expect(formatTime(90)).toBe("1:30");
    expect(formatTime(125)).toBe("2:05");
    expect(formatTime(3661)).toBe("61:01");
  });
});

describe("calculateLevel", () => {
  it("should return level 1 for 0 XP", () => {
    expect(calculateLevel(0)).toBe(1);
  });

  it("should calculate correct level based on XP", () => {
    expect(calculateLevel(99)).toBe(1);
    expect(calculateLevel(100)).toBe(2);
    expect(calculateLevel(400)).toBe(3);
    expect(calculateLevel(900)).toBe(4);
    expect(calculateLevel(1600)).toBe(5);
  });
});

describe("xpForLevel", () => {
  it("should return 0 XP for level 1", () => {
    expect(xpForLevel(1)).toBe(0);
  });

  it("should calculate correct XP thresholds", () => {
    expect(xpForLevel(2)).toBe(100);
    expect(xpForLevel(3)).toBe(400);
    expect(xpForLevel(4)).toBe(900);
    expect(xpForLevel(5)).toBe(1600);
  });
});

describe("xpToNextLevel", () => {
  it("should calculate progress correctly for level 1", () => {
    const result = xpToNextLevel(50);
    expect(result.current).toBe(50);
    expect(result.needed).toBe(100);
    expect(result.progress).toBe(50);
  });

  it("should calculate progress for higher levels", () => {
    const result = xpToNextLevel(200); // Level 2, 200-100=100 into level
    expect(result.current).toBe(100);
    expect(result.needed).toBe(300); // 400-100=300 needed for level 3
    expect(result.progress).toBeCloseTo(33.33, 1);
  });
});

describe("getStreakEmoji", () => {
  it("should return seedling for low streaks", () => {
    expect(getStreakEmoji(0)).toBe("🌱");
    expect(getStreakEmoji(2)).toBe("🌱");
  });

  it("should return sparkles for 3+ day streaks", () => {
    expect(getStreakEmoji(3)).toBe("✨");
    expect(getStreakEmoji(6)).toBe("✨");
  });

  it("should return lightning for 7+ day streaks", () => {
    expect(getStreakEmoji(7)).toBe("⚡");
    expect(getStreakEmoji(29)).toBe("⚡");
  });

  it("should return fire for 30+ day streaks", () => {
    expect(getStreakEmoji(30)).toBe("🔥");
    expect(getStreakEmoji(99)).toBe("🔥");
  });

  it("should return diamond for 100+ day streaks", () => {
    expect(getStreakEmoji(100)).toBe("💎");
    expect(getStreakEmoji(364)).toBe("💎");
  });

  it("should return trophy for 365+ day streaks", () => {
    expect(getStreakEmoji(365)).toBe("🏆");
    expect(getStreakEmoji(1000)).toBe("🏆");
  });
});
