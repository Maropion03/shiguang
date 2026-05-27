"use client";

import { useEffect } from "react";
import { cn } from "@/lib/cn";
import type { Question } from "@/lib/questions";

type Props = {
  q: Extract<Question, { kind: "compound_weight_field" }>;
  weight?: number;
  fields: string[];
  onWeight: (w: number) => void;
  onFields: (f: string[]) => void;
};

export default function CompoundWeightField({
  q,
  weight,
  fields,
  onWeight,
  onFields
}: Props) {
  const defaultW = Math.ceil((q.weightMin + q.weightMax) / 2);
  const w = weight ?? defaultW;

  // 首次进入此题时把默认份量值写入状态,确保提交时有值且滑块视觉与逻辑一致
  useEffect(() => {
    if (typeof weight !== "number") onWeight(defaultW);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function toggleField(v: string) {
    if (fields.includes(v)) {
      onFields(fields.filter((x) => x !== v));
    } else {
      if (fields.length >= q.fieldsMax) return;
      onFields([...fields, v]);
    }
  }

  return (
    <div className="flex flex-col gap-14">
      {/* weight slider */}
      <div>
        <div className="flex items-baseline justify-between mb-5">
          <span className="text-ink-mist text-xs tracking-zen">阅读份量</span>
          <span className="font-serif text-vermilion text-sm tracking-zen">
            {"·".repeat(w)}
          </span>
        </div>
        <input
          type="range"
          min={q.weightMin}
          max={q.weightMax}
          step={1}
          value={w}
          onChange={(e) => onWeight(Number(e.target.value))}
          className="w-full accent-ink"
        />
        <div className="flex justify-between text-xs text-ink-wash mt-3">
          <span>{q.weightMinLabel}</span>
          <span>{q.weightMaxLabel}</span>
        </div>
      </div>

      {/* field chips */}
      <div>
        <div className="flex items-baseline justify-between mb-5">
          <span className="text-ink-mist text-xs tracking-zen">偏爱领域</span>
          <span className="text-ink-wash text-xs">
            {fields.length} / {q.fieldsMax} · 可跳过
          </span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {q.fields.map((f) => {
            const active = fields.includes(f.value);
            const disabled = !active && fields.length >= q.fieldsMax;
            return (
              <button
                key={f.value}
                onClick={() => toggleField(f.value)}
                disabled={disabled}
                className={cn(
                  "px-4 py-2 text-sm font-serif border transition-all duration-300",
                  active
                    ? "border-ink bg-ink text-paper"
                    : disabled
                      ? "border-ink/10 text-ink-wash/50 cursor-not-allowed"
                      : "border-ink/20 text-ink-soft hover:border-ink/60"
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
