"use client";

import { cn } from "@/lib/utils";

interface MathKeyboardProps {
  onInsert: (symbol: string) => void;
  className?: string;
}

const KEYBOARD_ROWS = [
  // Row 1: Numbers + basic operations
  [
    { display: "7", value: "7" },
    { display: "8", value: "8" },
    { display: "9", value: "9" },
    { display: "÷", value: "/" },
    { display: "(", value: "(" },
    { display: ")", value: ")" },
  ],
  [
    { display: "4", value: "4" },
    { display: "5", value: "5" },
    { display: "6", value: "6" },
    { display: "×", value: "*" },
    { display: "x²", value: "^2" },
    { display: "√", value: "sqrt(" },
  ],
  [
    { display: "1", value: "1" },
    { display: "2", value: "2" },
    { display: "3", value: "3" },
    { display: "−", value: "-" },
    { display: "xⁿ", value: "^" },
    { display: "∛", value: "cbrt(" },
  ],
  [
    { display: "0", value: "0" },
    { display: ".", value: "." },
    { display: "=", value: "=" },
    { display: "+", value: "+" },
    { display: "π", value: "pi" },
    { display: "e", value: "e" },
  ],
];

const ADVANCED_SYMBOLS = [
  { display: "½", value: "1/2" },
  { display: "⅓", value: "1/3" },
  { display: "sin", value: "sin(" },
  { display: "cos", value: "cos(" },
  { display: "tan", value: "tan(" },
  { display: "log", value: "log(" },
  { display: "ln", value: "ln(" },
  { display: "∞", value: "inf" },
  { display: "≤", value: "<=" },
  { display: "≥", value: ">=" },
  { display: "≠", value: "!=" },
  { display: "±", value: "+-" },
];

export function MathKeyboard({ onInsert, className }: MathKeyboardProps) {
  return (
    <div className={cn("p-2 bg-muted rounded-lg", className)}>
      {/* Main keyboard */}
      <div className="grid gap-1 mb-2">
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1">
            {row.map((key) => (
              <button
                key={key.value}
                onClick={() => onInsert(key.value)}
                className="flex-1 h-10 rounded bg-background hover:bg-primary/10 active:bg-primary/20 transition-colors font-mono text-lg border"
              >
                {key.display}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Advanced symbols */}
      <div className="flex flex-wrap gap-1 pt-2 border-t">
        {ADVANCED_SYMBOLS.map((sym) => (
          <button
            key={sym.value}
            onClick={() => onInsert(sym.value)}
            className="px-2 h-8 rounded bg-background hover:bg-primary/10 active:bg-primary/20 transition-colors text-sm border"
          >
            {sym.display}
          </button>
        ))}
      </div>
    </div>
  );
}
