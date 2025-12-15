/**
 * Accessibility Utilities
 *
 * Tools for ensuring WCAG 2.1 compliance and better user experience.
 *
 * @module accessibility
 */

/**
 * Convert hex color to RGB array
 */
function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace("#", "");
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split("")
          .map((c) => c + c)
          .join("")
      : cleanHex;

  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  if (!result) {
    throw new Error(`Invalid hex color: ${hex}`);
  }

  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

/**
 * Calculate relative luminance of a color
 * @see https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 */
function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  const [r, g, b] = rgb.map((channel) => {
    const s = channel / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 *
 * @param foreground - Foreground color (hex)
 * @param background - Background color (hex)
 * @returns Contrast ratio (1:1 to 21:1)
 *
 * @example
 * ```typescript
 * const ratio = getContrastRatio('#000000', '#FFFFFF');
 * // Returns: 21 (perfect contrast)
 * ```
 */
export function getContrastRatio(
  foreground: string,
  background: string
): number {
  const lum1 = getLuminance(foreground);
  const lum2 = getLuminance(background);

  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * WCAG conformance levels and requirements
 */
interface WCAGRequirements {
  normalText: number;
  largeText: number;
  uiComponents: number;
}

const WCAG_REQUIREMENTS: Record<"AA" | "AAA", WCAGRequirements> = {
  AA: {
    normalText: 4.5,
    largeText: 3,
    uiComponents: 3,
  },
  AAA: {
    normalText: 7,
    largeText: 4.5,
    uiComponents: 4.5,
  },
};

/**
 * Check if color combination meets WCAG requirements
 *
 * @param foreground - Foreground color (hex)
 * @param background - Background color (hex)
 * @param level - WCAG conformance level
 * @param textSize - Size category of the text
 *
 * @example
 * ```typescript
 * // Check normal text at AA level
 * meetsWCAG('#333333', '#FFFFFF', 'AA', 'normal');
 * // Returns: true (ratio is 12.63:1)
 *
 * // Check large text at AAA level
 * meetsWCAG('#666666', '#FFFFFF', 'AAA', 'large');
 * // Returns: true (ratio is 5.74:1, requirement is 4.5:1)
 * ```
 */
export function meetsWCAG(
  foreground: string,
  background: string,
  level: "AA" | "AAA" = "AA",
  textSize: "normal" | "large" | "ui" = "normal"
): boolean {
  const ratio = getContrastRatio(foreground, background);
  const requirements = WCAG_REQUIREMENTS[level];

  const minRatio =
    textSize === "normal"
      ? requirements.normalText
      : textSize === "large"
        ? requirements.largeText
        : requirements.uiComponents;

  return ratio >= minRatio;
}

/**
 * Get WCAG compliance status for a color combination
 */
export function getWCAGStatus(
  foreground: string,
  background: string
): {
  ratio: number;
  normalAA: boolean;
  normalAAA: boolean;
  largeAA: boolean;
  largeAAA: boolean;
  uiAA: boolean;
} {
  const ratio = getContrastRatio(foreground, background);

  return {
    ratio: Math.round(ratio * 100) / 100,
    normalAA: ratio >= 4.5,
    normalAAA: ratio >= 7,
    largeAA: ratio >= 3,
    largeAAA: ratio >= 4.5,
    uiAA: ratio >= 3,
  };
}

/**
 * Suggest a readable text color (black or white) for a given background
 *
 * @example
 * ```typescript
 * getReadableTextColor('#3B82F6'); // Returns '#FFFFFF' (white on blue)
 * getReadableTextColor('#FEF3C7'); // Returns '#000000' (black on light yellow)
 * ```
 */
export function getReadableTextColor(background: string): "#000000" | "#FFFFFF" {
  const luminance = getLuminance(background);
  // If background is light (luminance > 0.179), use dark text
  return luminance > 0.179 ? "#000000" : "#FFFFFF";
}

/**
 * Generate focus ring styles that are visible on any background
 */
export function getFocusRingStyles(): string {
  return `
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  `;
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Announce a message to screen readers
 *
 * @param message - Message to announce
 * @param priority - Announcement priority
 *
 * @example
 * ```typescript
 * // Polite announcement (waits for current speech to finish)
 * announceToScreenReader('Item added to cart');
 *
 * // Assertive announcement (interrupts current speech)
 * announceToScreenReader('Error: Please fix the form', 'assertive');
 * ```
 */
export function announceToScreenReader(
  message: string,
  priority: "polite" | "assertive" = "polite"
): void {
  if (typeof document === "undefined") return;

  // Create or find the live region
  let liveRegion = document.getElementById("a11y-live-region");

  if (!liveRegion) {
    liveRegion = document.createElement("div");
    liveRegion.id = "a11y-live-region";
    liveRegion.setAttribute("aria-live", priority);
    liveRegion.setAttribute("aria-atomic", "true");
    liveRegion.className = "sr-only";
    document.body.appendChild(liveRegion);
  } else {
    liveRegion.setAttribute("aria-live", priority);
  }

  // Clear and set the message
  liveRegion.textContent = "";
  // Use setTimeout to ensure the DOM update is processed
  setTimeout(() => {
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }, 100);
}

/**
 * Trap focus within an element (for modals, dialogs)
 *
 * @returns Cleanup function to restore normal focus behavior
 *
 * @example
 * ```typescript
 * const cleanup = trapFocus(modalElement);
 * // When modal closes:
 * cleanup();
 * ```
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableSelectors = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    '[tabindex]:not([tabindex="-1"])',
  ].join(", ");

  const focusableElements = element.querySelectorAll(focusableSelectors);
  const firstFocusable = focusableElements[0] as HTMLElement | undefined;
  const lastFocusable = focusableElements[
    focusableElements.length - 1
  ] as HTMLElement | undefined;

  const handleKeyDown = (e: KeyboardEvent): void => {
    if (e.key !== "Tab") return;

    if (e.shiftKey) {
      // Shift + Tab: Moving backwards
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      // Tab: Moving forwards
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  };

  element.addEventListener("keydown", handleKeyDown);

  // Focus first element
  firstFocusable?.focus();

  return () => {
    element.removeEventListener("keydown", handleKeyDown);
  };
}
