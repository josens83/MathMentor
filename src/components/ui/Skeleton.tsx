import { cn } from "@/lib/utils";

interface SkeletonProps {
  /**
   * Additional CSS classes
   */
  className?: string;
  /**
   * Animation variant
   * @default "pulse"
   */
  animation?: "pulse" | "shimmer" | "none";
  /**
   * Inline styles
   */
  style?: React.CSSProperties;
}

/**
 * Skeleton loader for CLS prevention
 *
 * Use to reserve space while content is loading.
 *
 * @example
 * ```tsx
 * // Simple skeleton
 * <Skeleton className="h-4 w-full" />
 *
 * // Card skeleton
 * <div className="space-y-2">
 *   <Skeleton className="h-[200px] w-full" />
 *   <Skeleton className="h-4 w-3/4" />
 *   <Skeleton className="h-4 w-1/2" />
 * </div>
 * ```
 */
export function Skeleton({
  className,
  animation = "pulse",
  style,
}: SkeletonProps): React.ReactElement {
  return (
    <div
      className={cn(
        "rounded-md bg-gray-200",
        animation === "pulse" && "animate-pulse",
        animation === "shimmer" &&
          "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent",
        className
      )}
      style={style}
    />
  );
}

/**
 * Text skeleton with multiple lines
 */
interface TextSkeletonProps {
  /**
   * Number of lines
   * @default 3
   */
  lines?: number;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function TextSkeleton({
  lines = 3,
  className,
}: TextSkeletonProps): React.ReactElement {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-4",
            // Last line is shorter for natural look
            i === lines - 1 ? "w-2/3" : "w-full"
          )}
        />
      ))}
    </div>
  );
}

/**
 * Card skeleton matching typical card layout
 */
interface CardSkeletonProps {
  /**
   * Show image area
   * @default true
   */
  showImage?: boolean;
  /**
   * Image aspect ratio
   * @default "16/9"
   */
  imageAspectRatio?: string;
  /**
   * Additional CSS classes
   */
  className?: string;
}

export function CardSkeleton({
  showImage = true,
  imageAspectRatio = "16/9",
  className,
}: CardSkeletonProps): React.ReactElement {
  return (
    <div
      className={cn(
        "rounded-lg border bg-white p-4 space-y-4",
        className
      )}
    >
      {showImage && (
        <Skeleton
          className="w-full rounded-md"
          style={{ aspectRatio: imageAspectRatio }}
        />
      )}
      <div className="space-y-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <Skeleton className="h-10 w-1/3" />
    </div>
  );
}

/**
 * Problem card skeleton for MathMentor
 */
export function ProblemCardSkeleton(): React.ReactElement {
  return (
    <div className="rounded-xl border bg-white p-6 space-y-4">
      {/* Difficulty badge */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Problem title */}
      <Skeleton className="h-6 w-3/4" />

      {/* Math expression area */}
      <div className="py-4">
        <Skeleton className="h-12 w-full" />
      </div>

      {/* Options/Answer area */}
      <div className="space-y-2">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-10 flex-1 rounded-lg" />
        <Skeleton className="h-10 w-24 rounded-lg" />
      </div>
    </div>
  );
}

/**
 * Dashboard stats skeleton
 */
export function StatsSkeleton(): React.ReactElement {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-lg border bg-white p-4 space-y-2"
        >
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}

/**
 * Leaderboard skeleton
 */
export function LeaderboardSkeleton(): React.ReactElement {
  return (
    <div className="rounded-lg border bg-white">
      <div className="p-4 border-b">
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="divide-y">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-4 flex items-center gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
