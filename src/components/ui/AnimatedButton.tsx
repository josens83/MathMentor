"use client";

import { useState, useCallback, type MouseEvent, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonState = "idle" | "loading" | "success" | "error";

interface RippleEffect {
  x: number;
  y: number;
  id: number;
}

interface AnimatedButtonProps {
  /** Button content */
  children: ReactNode;
  /** Click handler - can be async for loading state */
  onClick?: () => void | Promise<void>;
  /** Additional CSS classes */
  className?: string;
  /** Button variant */
  variant?: "primary" | "secondary" | "danger";
  /** Disabled state */
  disabled?: boolean;
  /** Show ripple effect on click */
  ripple?: boolean;
  /** Custom loading text */
  loadingText?: string;
  /** Custom success text */
  successText?: string;
  /** Custom error text */
  errorText?: string;
  /** Auto-reset delay after success/error (ms) */
  resetDelay?: number;
  /** Button type */
  type?: "button" | "submit" | "reset";
}

const variantStyles = {
  primary: {
    idle: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)]",
    loading: "bg-[var(--color-primary)] text-white",
    success: "bg-[var(--color-success)] text-white",
    error: "bg-[var(--color-error)] text-white",
  },
  secondary: {
    idle: "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)] hover:bg-[var(--color-bg-tertiary)]",
    loading: "bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]",
    success: "bg-[var(--color-success)] text-white",
    error: "bg-[var(--color-error)] text-white",
  },
  danger: {
    idle: "bg-[var(--color-error)] text-white hover:bg-red-600",
    loading: "bg-[var(--color-error)] text-white",
    success: "bg-[var(--color-success)] text-white",
    error: "bg-red-700 text-white",
  },
};

/**
 * Animated Button with micro-interactions
 *
 * Features:
 * - Ripple effect on click
 * - Loading state with spinner
 * - Success/error states with icons
 * - Shake animation on error
 * - Scale animation on hover/tap
 *
 * @example
 * ```tsx
 * // Basic usage
 * <AnimatedButton onClick={handleClick}>
 *   Click me
 * </AnimatedButton>
 *
 * // With async handler (shows loading state)
 * <AnimatedButton onClick={async () => {
 *   await submitForm();
 * }}>
 *   Submit
 * </AnimatedButton>
 *
 * // Custom states
 * <AnimatedButton
 *   loadingText="Saving..."
 *   successText="Saved!"
 *   errorText="Failed"
 * >
 *   Save Changes
 * </AnimatedButton>
 * ```
 */
export function AnimatedButton({
  children,
  onClick,
  className,
  variant = "primary",
  disabled = false,
  ripple = true,
  loadingText = "Loading...",
  successText = "Success!",
  errorText = "Error",
  resetDelay = 2000,
  type = "button",
}: AnimatedButtonProps): React.ReactElement {
  const [state, setState] = useState<ButtonState>("idle");
  const [ripples, setRipples] = useState<RippleEffect[]>([]);

  const handleClick = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      // Create ripple effect
      if (ripple) {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const id = Date.now();

        setRipples((prev) => [...prev, { x, y, id }]);
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 600);
      }

      // Handle click
      if (onClick) {
        const result = onClick();

        // If it's a promise, handle loading/success/error states
        if (result instanceof Promise) {
          setState("loading");
          try {
            await result;
            setState("success");
            setTimeout(() => setState("idle"), resetDelay);
          } catch {
            setState("error");
            setTimeout(() => setState("idle"), resetDelay);
          }
        }
      }
    },
    [onClick, ripple, resetDelay]
  );

  const isDisabled = disabled || state === "loading";

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        // Base styles
        "relative overflow-hidden",
        "px-6 py-3 rounded-lg",
        "font-medium text-sm",
        "transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "focus:ring-[var(--color-primary)]",
        "disabled:opacity-50 disabled:cursor-not-allowed",

        // Variant styles
        variantStyles[variant][state],

        className
      )}
      // Hover/tap animations
      whileHover={isDisabled ? {} : { scale: 1.02 }}
      whileTap={isDisabled ? {} : { scale: 0.98 }}
      // Shake animation on error
      animate={
        state === "error"
          ? {
              x: [0, -10, 10, -10, 10, 0],
              transition: { duration: 0.5 },
            }
          : {}
      }
    >
      {/* Ripple effects */}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          className="absolute bg-white/30 rounded-full pointer-events-none"
          initial={{
            width: 0,
            height: 0,
            x: r.x,
            y: r.y,
            opacity: 1,
          }}
          animate={{
            width: 200,
            height: 200,
            x: r.x - 100,
            y: r.y - 100,
            opacity: 0,
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      ))}

      {/* Button content */}
      <AnimatePresence mode="wait">
        {state === "loading" && (
          <motion.span
            key="loading"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center justify-center gap-2"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{loadingText}</span>
          </motion.span>
        )}

        {state === "success" && (
          <motion.span
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{successText}</span>
          </motion.span>
        )}

        {state === "error" && (
          <motion.span
            key="error"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>{errorText}</span>
          </motion.span>
        )}

        {state === "idle" && (
          <motion.span
            key="idle"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            {children}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/**
 * Icon Button with animation
 */
interface AnimatedIconButtonProps {
  icon: ReactNode;
  onClick?: () => void | Promise<void>;
  label: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const iconSizes = {
  sm: "w-8 h-8",
  md: "w-10 h-10",
  lg: "w-12 h-12",
};

export function AnimatedIconButton({
  icon,
  onClick,
  label,
  className,
  size = "md",
}: AnimatedIconButtonProps): React.ReactElement {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        iconSizes[size],
        "flex items-center justify-center",
        "rounded-full",
        "bg-[var(--color-bg-secondary)]",
        "text-[var(--color-text-secondary)]",
        "hover:bg-[var(--color-bg-tertiary)]",
        "hover:text-[var(--color-text-primary)]",
        "transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-offset-2",
        "focus:ring-[var(--color-primary)]",
        className
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={label}
    >
      {icon}
    </motion.button>
  );
}
