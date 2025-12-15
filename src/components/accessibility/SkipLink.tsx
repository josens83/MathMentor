"use client";

import { cn } from "@/lib/utils";

interface SkipLinkProps {
  /** Target element ID (without #) */
  targetId?: string;
  /** Link text */
  children?: React.ReactNode;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Skip Link for keyboard navigation
 *
 * Allows keyboard users to skip repetitive navigation
 * and jump directly to main content.
 *
 * Add to the beginning of your layout, before the header.
 *
 * @example
 * ```tsx
 * // In layout.tsx
 * <body>
 *   <SkipLink />
 *   <header>...</header>
 *   <main id="main-content">
 *     {children}
 *   </main>
 * </body>
 * ```
 */
export function SkipLink({
  targetId = "main-content",
  children = "Skip to main content",
  className,
}: SkipLinkProps): React.ReactElement {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        // Hidden by default
        "sr-only",
        // Show on focus
        "focus:not-sr-only",
        "focus:fixed focus:top-4 focus:left-4",
        "focus:z-[9999]",
        // Styling
        "focus:px-4 focus:py-2",
        "focus:bg-[var(--color-primary)] focus:text-white",
        "focus:rounded-lg focus:shadow-lg",
        "focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2",
        "focus:ring-offset-[var(--color-primary)]",
        // Typography
        "font-medium text-sm",
        className
      )}
    >
      {children}
    </a>
  );
}

/**
 * Multiple skip links for complex layouts
 */
interface SkipLinksProps {
  links: { targetId: string; label: string }[];
  className?: string;
}

export function SkipLinks({
  links,
  className,
}: SkipLinksProps): React.ReactElement {
  return (
    <nav
      aria-label="Skip links"
      className={cn(
        // Hidden by default
        "sr-only",
        // Show on focus-within
        "focus-within:not-sr-only",
        "focus-within:fixed focus-within:top-4 focus-within:left-4",
        "focus-within:z-[9999]",
        "focus-within:flex focus-within:flex-col focus-within:gap-2",
        className
      )}
    >
      {links.map((link) => (
        <a
          key={link.targetId}
          href={`#${link.targetId}`}
          className={cn(
            "px-4 py-2",
            "bg-[var(--color-primary)] text-white",
            "rounded-lg shadow-lg",
            "outline-none ring-2 ring-white",
            "font-medium text-sm",
            "hover:bg-[var(--color-primary-hover)]"
          )}
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}
