import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type BlurLevel = "sm" | "md" | "lg" | "xl";

interface GlassCardProps {
  /** Card content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Blur intensity */
  blur?: BlurLevel;
  /** Enable hover effect */
  hover?: boolean;
  /** Border style */
  border?: "subtle" | "prominent" | "none";
  /** As a different HTML element */
  as?: "div" | "article" | "section";
}

const blurStyles: Record<BlurLevel, string> = {
  sm: "backdrop-blur-sm",
  md: "backdrop-blur-md",
  lg: "backdrop-blur-lg",
  xl: "backdrop-blur-xl",
};

const borderStyles = {
  subtle: "border border-white/10 dark:border-white/5",
  prominent: "border border-white/20 dark:border-white/10",
  none: "",
};

/**
 * Glassmorphism Card Component
 *
 * Modern glass effect with blur, transparency, and subtle borders.
 * Works well on both light and dark backgrounds.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <GlassCard>
 *   <h2>Card Title</h2>
 *   <p>Card content...</p>
 * </GlassCard>
 *
 * // With hover effect and stronger blur
 * <GlassCard blur="lg" hover>
 *   <p>Interactive glass card</p>
 * </GlassCard>
 *
 * // As article element
 * <GlassCard as="article" className="p-6">
 *   <h3>Blog Post</h3>
 * </GlassCard>
 * ```
 */
export function GlassCard({
  children,
  className,
  blur = "md",
  hover = false,
  border = "subtle",
  as: Component = "div",
}: GlassCardProps): React.ReactElement {
  return (
    <Component
      className={cn(
        // Base glass effect
        "bg-white/10 dark:bg-black/20",
        blurStyles[blur],

        // Border
        borderStyles[border],

        // Shadow
        "shadow-xl shadow-black/5 dark:shadow-black/20",

        // Shape
        "rounded-2xl",

        // Transitions
        "transition-all duration-300",

        // Hover effects
        hover && [
          "hover:bg-white/20 dark:hover:bg-black/30",
          "hover:shadow-2xl",
          "hover:scale-[1.02]",
          "cursor-pointer",
        ],

        className
      )}
    >
      {children}
    </Component>
  );
}

/**
 * Glass Card with gradient border (for premium feel)
 */
interface GradientGlassCardProps extends Omit<GlassCardProps, "border"> {
  /** Gradient colors */
  gradient?: "primary" | "rainbow" | "sunset";
}

const gradientStyles = {
  primary: "from-indigo-500 to-purple-500",
  rainbow: "from-red-500 via-yellow-500 via-green-500 to-blue-500",
  sunset: "from-orange-500 via-rose-500 to-purple-500",
};

export function GradientGlassCard({
  children,
  className,
  blur = "md",
  hover = false,
  gradient = "primary",
  as: Component = "div",
}: GradientGlassCardProps): React.ReactElement {
  return (
    <div
      className={cn(
        // Gradient border container
        "p-[1px] rounded-2xl",
        "bg-gradient-to-r",
        gradientStyles[gradient],
        hover && "hover:p-[2px] transition-all duration-300"
      )}
    >
      <Component
        className={cn(
          // Inner glass card
          "bg-white/90 dark:bg-gray-900/90",
          blurStyles[blur],
          "rounded-[calc(1rem-1px)]",
          "shadow-xl",
          "transition-all duration-300",
          hover && "hover:bg-white/80 dark:hover:bg-gray-900/80",
          className
        )}
      >
        {children}
      </Component>
    </div>
  );
}
