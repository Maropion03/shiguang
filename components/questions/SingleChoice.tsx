"use client";

import { cn } from "@/lib/cn";
import type { QuestionOption } from "@/lib/questions";

export default function SingleChoice({
  options,
  value,
  onChange
}: {
  options: QuestionOption[];
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <ul className="flex flex-col gap-3">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <li key={opt.value}>
            <button
              onClick={() => onChange(opt.value)}
              className={cn(
                "w-full text-left px-6 py-5 border transition-all duration-300 group",
                active
                  ? "border-ink bg-paper-warm/60"
                  : "border-ink/15 hover:border-ink/50 hover:bg-paper-warm/30"
              )}
            >
              <div className="flex items-baseline gap-4">
                <span
                  className={cn(
                    "font-serif text-xs tracking-zen transition-colors",
                    active ? "text-vermilion" : "text-ink-wash group-hover:text-ink-mist"
                  )}
                >
                  ◯
                </span>
                <div className="flex-1">
                  <div className="font-serif text-ink text-base md:text-lg leading-relaxed">
                    {opt.label}
                  </div>
                  {opt.hint && (
                    <div className="text-ink-mist text-xs mt-1.5 leading-relaxed">
                      {opt.hint}
                    </div>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
