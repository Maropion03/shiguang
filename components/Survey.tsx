"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import { QUESTIONS, type Answers } from "@/lib/questions";
import { cn } from "@/lib/cn";
import SingleChoice from "./questions/SingleChoice";
import TextInput from "./questions/TextInput";
import CompoundWeightField from "./questions/CompoundWeightField";
import Seeking from "./Seeking";

const DRAFT_KEY = "shiguang.survey.draft.v1";

type Draft = { step: number; answers: Answers };

function readDraft(): Draft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const d = JSON.parse(raw) as Draft;
    if (typeof d.step !== "number" || !d.answers) return null;
    // step 越界容错——题目可能改过版本
    if (d.step < 0 || d.step >= QUESTIONS.length) d.step = 0;
    return d;
  } catch {
    return null;
  }
}

export default function Survey() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hydrated = useRef(false);

  // 进入页面时从 localStorage 恢复草稿——避免误刷新就丢答题进度
  useEffect(() => {
    const d = readDraft();
    if (d) {
      setStep(d.step);
      setAnswers(d.answers);
    }
    hydrated.current = true;
  }, []);

  // 每次答案/步数变化时落到 localStorage
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify({ step, answers }));
    } catch {
      // 忽略 quota / 隐私模式失败
    }
  }, [step, answers]);

  const total = QUESTIONS.length;
  const q = QUESTIONS[step];

  const canAdvance = useMemo(() => {
    switch (q.kind) {
      case "single":
        return Boolean(answers[q.id as keyof Answers]);
      case "compound_weight_field":
        // 滑块有默认值、领域可跳过 → 直接放行
        return true;
      case "text":
        if (q.optional) return true;
        const v = answers[q.id as keyof Answers];
        return typeof v === "string" && v.trim().length > 0;
    }
  }, [q, answers]);

  function next() {
    if (step < total - 1) {
      track("survey_step", { step: step + 1, question: q.id });
      setStep(step + 1);
      return;
    }
    submit();
  }

  function prev() {
    if (step > 0) setStep(step - 1);
  }

  async function submit() {
    setSubmitting(true);
    setError(null);
    track("submit_attempt", {
      mood: answers.mood || "",
      motive: answers.motive || "",
      weight: answers.weight ?? 0,
      hasLoved: Boolean(answers.loved?.trim()),
      hasFreeform: Boolean(answers.freeform?.trim()),
      fieldCount: answers.fields?.length || 0
    });
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answers })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "推荐生成失败,请稍后再试");
      }
      track("submit_success", { id: data.id });
      try {
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        // ignore
      }
      router.push(`/r/${data.id}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "未知错误";
      track("submit_error", { error: msg.slice(0, 80) });
      setError(msg);
      setSubmitting(false);
    }
  }

  return (
    <div className="w-full max-w-prose animate-fade-in">
      {submitting && <Seeking />}
      {/* 进度指示 */}
      <div className="flex items-center justify-between mb-16">
        <span className="text-ink-mist text-xs tracking-zen">
          {String(step + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        <div className="flex gap-1.5">
          {QUESTIONS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-px transition-all duration-500",
                i === step ? "w-8 bg-ink" : i < step ? "w-4 bg-ink-mist" : "w-4 bg-ink-wash/40"
              )}
            />
          ))}
        </div>
      </div>

      {/* 题目 */}
      <div key={q.id} className="animate-fade-up">
        <h2 className="font-serif text-2xl md:text-[1.6rem] text-ink leading-relaxed mb-4 font-normal">
          {q.title}
        </h2>
        {q.subtitle && (
          <p className="text-ink-mist text-sm mb-10 leading-loose">{q.subtitle}</p>
        )}

        {!q.subtitle && <div className="mb-10" />}

        {q.kind === "single" && (
          <SingleChoice
            options={q.options}
            value={answers[q.id as keyof Answers] as string | undefined}
            onChange={(v) => setAnswers({ ...answers, [q.id]: v })}
            ariaLabel={q.title}
          />
        )}
        {q.kind === "compound_weight_field" && (
          <CompoundWeightField
            q={q}
            weight={answers.weight}
            fields={answers.fields || []}
            onWeight={(w) => setAnswers({ ...answers, weight: w })}
            onFields={(f) => setAnswers({ ...answers, fields: f })}
          />
        )}
        {q.kind === "text" && (
          <TextInput
            placeholder={q.placeholder}
            maxLength={q.maxLength}
            optional={q.optional}
            value={(answers[q.id as keyof Answers] as string) || ""}
            onChange={(v) => setAnswers({ ...answers, [q.id]: v })}
          />
        )}
      </div>

      {error && (
        <p className="text-vermilion text-sm mt-8 tracking-wide">{error}</p>
      )}

      {/* 操作 */}
      <div className="flex items-center justify-between mt-16 pt-8 border-t border-ink/10">
        <button
          onClick={prev}
          disabled={step === 0 || submitting}
          className={cn(
            "text-ink-mist text-sm tracking-zen transition-opacity",
            step === 0 ? "opacity-30 cursor-not-allowed" : "hover:text-ink"
          )}
        >
          ← 上一题
        </button>
        <button
          onClick={next}
          disabled={!canAdvance || submitting}
          className={cn(
            "px-8 py-2.5 border text-sm tracking-zen transition-all duration-500",
            canAdvance && !submitting
              ? "border-ink/50 text-ink hover:bg-ink hover:text-paper"
              : "border-ink/15 text-ink-wash cursor-not-allowed"
          )}
        >
          {submitting ? "为你寻书…" : step === total - 1 ? "拾起" : "下一题"}
        </button>
      </div>
    </div>
  );
}
