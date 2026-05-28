"use client";

import { useRef, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import type { QuestionOption } from "@/lib/questions";

export default function SingleChoice({
  options,
  value,
  onChange,
  ariaLabel
}: {
  options: QuestionOption[];
  value?: string;
  onChange: (v: string) => void;
  ariaLabel?: string;
}) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(e: KeyboardEvent<HTMLButtonElement>, i: number) {
    let next = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      next = (i + 1) % options.length;
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      next = (i - 1 + options.length) % options.length;
    } else if (e.key === "Home") {
      next = 0;
    } else if (e.key === "End") {
      next = options.length - 1;
    } else {
      return;
    }
    e.preventDefault();
    onChange(options[next].value);
    refs.current[next]?.focus();
  }

  const checkedIndex = options.findIndex((o) => o.value === value);

  return (
    <div role="radiogroup" aria-label={ariaLabel} className="flex flex-col gap-3">
      {options.map((opt, i) => {
        const active = value === opt.value;
        // 没有选中项时,Tab 进入聚焦第一项;有选中项时只让选中项可 Tab
        const tabIndex = checkedIndex === -1 ? (i === 0 ? 0 : -1) : active ? 0 : -1;
        return (
          <button
            key={opt.value}
            ref={(el) => {
              refs.current[i] = el;
            }}
            type="button"
            role="radio"
            aria-checked={active}
            tabIndex={tabIndex}
            onClick={() => onChange(opt.value)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={cn(
              "relative w-full text-left px-6 py-5 border transition-all duration-300 group",
              "focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40",
              active
                ? "border-ink bg-paper-deep shadow-[inset_3px_0_0_0_#A33F2A]"
                : "border-ink/15 hover:border-ink/50 hover:bg-paper-warm/30"
            )}
          >
            <div className="flex items-baseline gap-4">
              <span
                aria-hidden
                className={cn(
                  "font-serif text-xs tracking-zen transition-colors",
                  active ? "text-vermilion" : "text-ink-wash group-hover:text-ink-mist"
                )}
              >
                {active ? "●" : "◯"}
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
        );
      })}
    </div>
  );
}
