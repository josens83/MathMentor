// XP (경험치) 시스템
export const XP_CONFIG = {
  PROBLEM_CORRECT: 5,
  PROBLEM_CORRECT_FIRST_TRY: 8,
  PROBLEM_CORRECT_NO_HINT: 10,
  PROBLEM_STREAK_BONUS: 2,
  LESSON_COMPLETE: 15,
  LESSON_PERFECT_BONUS: 10,
  LESSON_MASTERY_BONUS: 25,
  DAILY_FIRST_PROBLEM: 5,
  DAILY_GOAL_COMPLETE: 20,
  DAILY_CHALLENGE_COMPLETE: 50,
  STREAK_7_DAYS: 100,
  STREAK_30_DAYS: 500,
  STREAK_100_DAYS: 2000,
  STREAK_365_DAYS: 10000,
};

// 에너지 시스템 (하트)
export const ENERGY_CONFIG = {
  MAX_FREE: 5,
  MAX_PRO: 999, // Unlimited
  REFILL_TIME_MINUTES: 30,
  PROBLEM_COST: 1,
  HINT_COST: 0,
};

// 젬 시스템
export const GEMS_CONFIG = {
  ENERGY_REFILL_COST: 50,
  HINT_COST: 10,
  SOLUTION_COST: 30,
  DAILY_BONUS: 5,
  WEEKLY_BONUS: 50,
  STREAK_7_BONUS: 100,
  ACHIEVEMENT_BONUS: 25,
};

// 가격 정책
export const PRICING = {
  PRO: {
    MONTHLY: 9900,
    YEARLY: 79900,
    YEARLY_MONTHLY: 6658,
    DISCOUNT_PERCENT: 33,
  },
  PREMIUM: {
    MONTHLY: 19900,
    YEARLY: 159900,
    YEARLY_MONTHLY: 13325,
    DISCOUNT_PERCENT: 33,
  },
  FAMILY: {
    MONTHLY: 29900,
    YEARLY: 239900,
    YEARLY_MONTHLY: 19992,
    DISCOUNT_PERCENT: 33,
    MAX_MEMBERS: 6,
  },
};

// 수학 레벨
export const MATH_LEVELS = {
  elementary: { name: "초등", grades: "1-6학년", order: 1 },
  middle: { name: "중등", grades: "1-3학년", order: 2 },
  high: { name: "고등", grades: "1-3학년", order: 3 },
  university: { name: "대학", grades: "교양/전공", order: 4 },
  adult: { name: "성인", grades: "실생활 수학", order: 5 },
};

// 수학 카테고리
export const MATH_CATEGORIES = {
  numbers: { name: "수와 연산", icon: "🔢" },
  algebra: { name: "대수", icon: "🔤" },
  geometry: { name: "기하", icon: "📐" },
  statistics: { name: "확률과 통계", icon: "📊" },
  calculus: { name: "미적분", icon: "∫" },
  linear_algebra: { name: "선형대수", icon: "📈" },
  discrete: { name: "이산수학", icon: "🔣" },
};

// 업적 목록
export const ACHIEVEMENTS = [
  { id: "first_problem", name: "첫 걸음", description: "첫 문제 풀기", icon: "🎯", xp: 50 },
  { id: "streak_7", name: "일주일 연속", description: "7일 연속 학습", icon: "🔥", xp: 100 },
  { id: "streak_30", name: "한 달 연속", description: "30일 연속 학습", icon: "💪", xp: 500 },
  { id: "perfect_lesson", name: "완벽한 레슨", description: "레슨 100% 정답", icon: "⭐", xp: 50 },
  { id: "level_10", name: "수학 초보자", description: "레벨 10 달성", icon: "🌟", xp: 200 },
  { id: "problems_100", name: "백 문제 돌파", description: "100문제 풀기", icon: "💯", xp: 300 },
  { id: "no_hints", name: "독립심", description: "힌트 없이 10문제 연속", icon: "🧠", xp: 150 },
];

// 레벨 임계값
export const LEVEL_THRESHOLDS = [
  0, 100, 400, 900, 1600, 2500, 3600, 4900, 6400, 8100, 10000,
];
