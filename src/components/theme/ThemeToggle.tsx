"use client";

import { useTheme, type Theme } from "./ThemeProvider";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  /** Additional CSS classes */
  className?: string;
  /** Show labels */
  showLabels?: boolean;
}

const themeOptions: { value: Theme; icon: typeof Sun; label: string }[] = [
  { value: "light", icon: Sun, label: "Light" },
  { value: "dark", icon: Moon, label: "Dark" },
  { value: "system", icon: Monitor, label: "System" },
];

/**
 * Theme Toggle Component
 *
 * Allows users to switch between light, dark, and system themes.
 *
 * @example
 * ```tsx
 * <ThemeToggle />
 * <ThemeToggle showLabels />
 * ```
 */
export function ThemeToggle({
  className,
  showLabels = false,
}: ThemeToggleProps): React.ReactElement {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={cn(
        "flex items-center gap-1 p-1 rounded-lg",
        "bg-[var(--color-bg-secondary)]",
        className
      )}
      role="radiogroup"
      aria-label="Theme selection"
    >
      {themeOptions.map((option) => {
        const isActive = theme === option.value;
        const Icon = option.icon;

        return (
          <button
            key={option.value}
            onClick={() => setTheme(option.value)}
            role="radio"
            aria-checked={isActive}
            aria-label={`${option.label} theme`}
            className={cn(
              "relative flex items-center gap-2 px-3 py-2 rounded-md",
              "text-sm font-medium transition-all duration-200",
              isActive
                ? "bg-[var(--color-bg-elevated)] text-[var(--color-text-primary)] shadow-sm"
                : "text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]"
            )}
          >
            <Icon className="w-4 h-4" />
            {showLabels && <span>{option.label}</span>}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Simple Theme Toggle (just an icon button)
 */
export function ThemeToggleSimple({
  className,
}: {
  className?: string;
}): React.ReactElement {
  const { resolvedTheme, setTheme, theme } = useTheme();

  const toggleTheme = (): void => {
    if (theme === "system") {
      // If system, switch to opposite of current resolved theme
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    } else {
      // If manual, toggle between light and dark
      setTheme(theme === "dark" ? "light" : "dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-2 rounded-lg transition-colors",
        "text-[var(--color-text-secondary)]",
        "hover:bg-[var(--color-bg-secondary)]",
        "hover:text-[var(--color-text-primary)]",
        className
      )}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} theme`}
    >
      {resolvedTheme === "dark" ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
