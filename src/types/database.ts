export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProblemType =
  | "multiple_choice"
  | "short_answer"
  | "equation_solve"
  | "fill_blank"
  | "step_by_step"
  | "graph_interpret"
  | "word_problem"
  | "proof";

export type SubscriptionTier = "free" | "pro" | "premium";

export type MathLevel =
  | "elementary"
  | "middle"
  | "high"
  | "university"
  | "adult";

export interface Profile {
  id: string;
  email: string;
  username?: string;
  display_name?: string;
  avatar_url?: string;
  level: number;
  total_xp: number;
  current_streak: number;
  longest_streak: number;
  last_activity_date?: string;
  energy: number;
  max_energy: number;
  energy_last_refill?: string;
  gems: number;
  subscription_tier: SubscriptionTier;
  subscription_end_date?: string;
  math_level: MathLevel;
  daily_goal_problems: number;
  daily_problems_solved: number;
  total_problems_solved: number;
  created_at: string;
  updated_at: string;
}

export interface Topic {
  id: string;
  name: string;
  name_en: string;
  description?: string;
  icon?: string;
  math_level: MathLevel;
  category: string;
  order_index: number;
  is_premium: boolean;
  created_at: string;
}

export interface Lesson {
  id: string;
  topic_id: string;
  title: string;
  description?: string;
  order_index: number;
  difficulty: number;
  estimated_minutes: number;
  xp_reward: number;
  is_premium: boolean;
  prerequisites?: string[];
  created_at: string;
}

export interface Problem {
  id: string;
  lesson_id?: string;
  topic_id: string;
  problem_type: ProblemType;
  difficulty: number;
  question: string;
  question_latex?: string;
  options?: string[];
  correct_answer: string;
  solution_steps?: string[];
  hints?: string[];
  explanation?: string;
  tags?: string[];
  is_premium: boolean;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  lesson_id?: string;
  topic_id: string;
  problems_attempted: number;
  problems_correct: number;
  best_score: number;
  mastery_level: number;
  last_attempt_at?: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ProblemAttempt {
  id: string;
  user_id: string;
  problem_id: string;
  user_answer: string;
  is_correct: boolean;
  time_spent_seconds: number;
  hints_used: number;
  attempt_number: number;
  created_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp_reward: number;
  requirement_type: string;
  requirement_value: number;
  is_secret: boolean;
  created_at: string;
}

export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, "created_at" | "updated_at">;
        Update: Partial<Omit<Profile, "id" | "created_at">>;
      };
      topics: {
        Row: Topic;
        Insert: Omit<Topic, "id" | "created_at">;
        Update: Partial<Omit<Topic, "id" | "created_at">>;
      };
      lessons: {
        Row: Lesson;
        Insert: Omit<Lesson, "id" | "created_at">;
        Update: Partial<Omit<Lesson, "id" | "created_at">>;
      };
      problems: {
        Row: Problem;
        Insert: Omit<Problem, "id" | "created_at">;
        Update: Partial<Omit<Problem, "id" | "created_at">>;
      };
      user_progress: {
        Row: UserProgress;
        Insert: Omit<UserProgress, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<UserProgress, "id" | "created_at">>;
      };
      problem_attempts: {
        Row: ProblemAttempt;
        Insert: Omit<ProblemAttempt, "id" | "created_at">;
        Update: Partial<Omit<ProblemAttempt, "id" | "created_at">>;
      };
      achievements: {
        Row: Achievement;
        Insert: Omit<Achievement, "id" | "created_at">;
        Update: Partial<Omit<Achievement, "id" | "created_at">>;
      };
      user_achievements: {
        Row: UserAchievement;
        Insert: Omit<UserAchievement, "id">;
        Update: Partial<Omit<UserAchievement, "id">>;
      };
    };
  };
}
