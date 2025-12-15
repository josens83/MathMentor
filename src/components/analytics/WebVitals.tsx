"use client";

import { useEffect } from "react";
import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from "web-vitals";

interface WebVitalsProps {
  /**
   * Optional callback to send metrics to analytics service
   */
  onReport?: (metric: WebVitalMetric) => void;
  /**
   * Enable console logging in development
   */
  debug?: boolean;
}

export interface WebVitalMetric {
  name: "CLS" | "INP" | "LCP" | "FCP" | "TTFB";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  id: string;
  navigationType: string;
  delta: number;
}

// Thresholds based on Google's Core Web Vitals
const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
  FCP: { good: 1800, poor: 3000 },
  TTFB: { good: 800, poor: 1800 },
} as const;

function getRating(
  name: keyof typeof THRESHOLDS,
  value: number
): "good" | "needs-improvement" | "poor" {
  const threshold = THRESHOLDS[name];
  if (value <= threshold.good) return "good";
  if (value <= threshold.poor) return "needs-improvement";
  return "poor";
}

function formatMetric(metric: Metric): WebVitalMetric {
  return {
    name: metric.name as WebVitalMetric["name"],
    value: metric.value,
    rating: getRating(
      metric.name as keyof typeof THRESHOLDS,
      metric.value
    ),
    id: metric.id,
    navigationType: metric.navigationType,
    delta: metric.delta,
  };
}

/**
 * WebVitals component for Real User Monitoring (RUM)
 *
 * Collects Core Web Vitals metrics and optionally reports them
 * to an analytics service.
 *
 * @example
 * ```tsx
 * // In app/layout.tsx
 * <WebVitals
 *   debug={process.env.NODE_ENV === 'development'}
 *   onReport={(metric) => sendToAnalytics(metric)}
 * />
 * ```
 */
export function WebVitals({ onReport, debug = false }: WebVitalsProps): null {
  useEffect(() => {
    const handleMetric = (metric: Metric): void => {
      const formatted = formatMetric(metric);

      if (debug) {
        const color =
          formatted.rating === "good"
            ? "green"
            : formatted.rating === "needs-improvement"
              ? "orange"
              : "red";

        console.log(
          `%c[Web Vitals] ${formatted.name}: ${formatted.value.toFixed(2)} (${formatted.rating})`,
          `color: ${color}; font-weight: bold;`
        );
      }

      onReport?.(formatted);
    };

    // Register all Core Web Vitals
    onLCP(handleMetric);
    onINP(handleMetric);
    onCLS(handleMetric);
    onFCP(handleMetric);
    onTTFB(handleMetric);
  }, [onReport, debug]);

  return null;
}

/**
 * Default analytics reporter that sends metrics to an API endpoint
 */
export async function reportWebVitals(
  metric: WebVitalMetric,
  endpoint = "/api/analytics/vitals"
): Promise<void> {
  try {
    // Use sendBeacon for reliability (works even during page unload)
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon(
        endpoint,
        JSON.stringify({
          ...metric,
          url: window.location.href,
          timestamp: Date.now(),
        })
      );
    } else {
      // Fallback to fetch
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...metric,
          url: window.location.href,
          timestamp: Date.now(),
        }),
        keepalive: true,
      });
    }
  } catch (error) {
    // Silently fail - analytics should not break the app
    if (process.env.NODE_ENV === "development") {
      console.error("[Web Vitals] Failed to report metric:", error);
    }
  }
}
