"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

interface ThemeContextType {
  /** Current theme setting */
  theme: Theme;
  /** Set the theme */
  setTheme: (theme: Theme) => void;
  /** The actual theme being displayed (resolves 'system' to light/dark) */
  resolvedTheme: ResolvedTheme;
  /** Whether the theme has been loaded from storage */
  isLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "mathmentor-theme";

interface ThemeProviderProps {
  children: ReactNode;
  /** Default theme when no preference is stored */
  defaultTheme?: Theme;
}

/**
 * Theme Provider for dark mode support
 *
 * Features:
 * - Three modes: Light, Dark, System
 * - Persists user preference to localStorage
 * - Listens for system theme changes
 * - Prevents FOUC with inline script in layout
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * <ThemeProvider>
 *   {children}
 * </ThemeProvider>
 * ```
 */
export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps): React.ReactElement {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("light");
  const [isLoaded, setIsLoaded] = useState(false);

  // Load theme from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (stored && ["light", "dark", "system"].includes(stored)) {
      setThemeState(stored);
    }
    setIsLoaded(true);
  }, []);

  // Apply theme changes
  useEffect(() => {
    const root = document.documentElement;

    const applyTheme = (isDark: boolean): void => {
      if (isDark) {
        root.classList.add("dark");
        setResolvedTheme("dark");
      } else {
        root.classList.remove("dark");
        setResolvedTheme("light");
      }
    };

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      applyTheme(mediaQuery.matches);

      // Listen for system theme changes
      const handler = (e: MediaQueryListEvent): void => {
        applyTheme(e.matches);
      };

      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    } else {
      applyTheme(theme === "dark");
    }
  }, [theme]);

  // Set theme and persist to localStorage
  const setTheme = useCallback((newTheme: Theme): void => {
    setThemeState(newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 *
 * @example
 * ```tsx
 * const { theme, setTheme, resolvedTheme } = useTheme();
 * ```
 */
export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}

/**
 * Inline script to prevent FOUC (Flash of Unstyled Content)
 *
 * Add this to your <head> in layout.tsx:
 * <script dangerouslySetInnerHTML={{ __html: themeScript }} />
 */
export const themeScript = `
(function() {
  const storageKey = '${STORAGE_KEY}';
  const theme = localStorage.getItem(storageKey);
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (theme === 'dark' || (theme === 'system' && systemDark) || (!theme && systemDark)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})();
`;
