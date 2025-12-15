import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toLocaleString();
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function calculateLevel(xp: number): number {
  // Level formula: level = floor(sqrt(xp / 100)) + 1
  return Math.floor(Math.sqrt(xp / 100)) + 1;
}

export function xpForLevel(level: number): number {
  // XP needed for a specific level
  return Math.pow(level - 1, 2) * 100;
}

export function xpToNextLevel(currentXP: number): {
  current: number;
  needed: number;
  progress: number;
} {
  const currentLevel = calculateLevel(currentXP);
  const currentLevelXP = xpForLevel(currentLevel);
  const nextLevelXP = xpForLevel(currentLevel + 1);
  const xpInLevel = currentXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;

  return {
    current: xpInLevel,
    needed: xpNeeded,
    progress: (xpInLevel / xpNeeded) * 100,
  };
}

export function getStreakEmoji(streak: number): string {
  if (streak >= 365) return "🏆";
  if (streak >= 100) return "💎";
  if (streak >= 30) return "🔥";
  if (streak >= 7) return "⚡";
  if (streak >= 3) return "✨";
  return "🌱";
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
