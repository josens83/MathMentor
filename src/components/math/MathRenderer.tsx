"use client";

import katex from "katex";
import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface MathRendererProps {
  content: string;
  inline?: boolean;
  className?: string;
}

export function MathRenderer({
  content,
  inline = false,
  className,
}: MathRendererProps) {
  const renderedContent = useMemo(() => {
    // Split by LaTeX patterns: $$...$$ for display mode and $...$ for inline
    const parts = content.split(/(\$\$[\s\S]+?\$\$|\$[^$]+?\$)/g);

    return parts.map((part, index) => {
      // Display mode: $$...$$
      if (part.startsWith("$$") && part.endsWith("$$")) {
        const latex = part.slice(2, -2);
        try {
          const html = katex.renderToString(latex, {
            displayMode: true,
            throwOnError: false,
            strict: false,
          });
          return (
            <div
              key={index}
              className="my-4 overflow-x-auto"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return (
            <span key={index} className="text-destructive">
              {part}
            </span>
          );
        }
      }

      // Inline mode: $...$
      if (part.startsWith("$") && part.endsWith("$")) {
        const latex = part.slice(1, -1);
        try {
          const html = katex.renderToString(latex, {
            displayMode: false,
            throwOnError: false,
            strict: false,
          });
          return (
            <span key={index} dangerouslySetInnerHTML={{ __html: html }} />
          );
        } catch {
          return (
            <span key={index} className="text-destructive">
              {part}
            </span>
          );
        }
      }

      // Regular text
      return <span key={index}>{part}</span>;
    });
  }, [content]);

  if (inline) {
    return <span className={cn("inline", className)}>{renderedContent}</span>;
  }

  return <div className={cn("math-content", className)}>{renderedContent}</div>;
}

// Simple math preview component
export function MathPreview({
  latex,
  className,
}: {
  latex: string;
  className?: string;
}) {
  const html = useMemo(() => {
    if (!latex.trim()) return "";
    try {
      return katex.renderToString(latex, {
        displayMode: true,
        throwOnError: false,
        strict: false,
      });
    } catch {
      return "";
    }
  }, [latex]);

  if (!html) return null;

  return (
    <div
      className={cn("p-4 bg-muted rounded-lg overflow-x-auto", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
