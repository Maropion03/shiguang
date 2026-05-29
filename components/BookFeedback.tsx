"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import { cn } from "@/lib/cn";

type Signal = "positive" | "negative";

// 单本书的反馈按钮。Optimistic:点击立刻进入「已记下」状态,
// 网络失败也不回退——一次反馈丢了无所谓,用户只会更烦。
export default function BookFeedback({
  recId,
  bookIndex
}: {
  recId: string;
  bookIndex: number;
}) {
  const [picked, setPicked] = useState<Signal | null>(null);

  async function send(signal: Signal) {
    if (picked) return;
    setPicked(signal);
    track("feedback", { recId, bookIndex, signal });
    try {
      await fetch("/api/feedback", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ recId, bookIndex, signal })
      });
    } catch {
      // 静默吞错——optimistic UI 已经反馈给用户了
    }
  }

  if (picked === "positive") {
    return (
      <span className="text-bamboo-deep text-xs tracking-wider">
        · 已记下「拾到了」
      </span>
    );
  }
  if (picked === "negative") {
    return (
      <span className="text-ink-mist text-xs tracking-wider">
        · 已记下「不准」
      </span>
    );
  }

  return (
    <span className="flex items-center gap-3 text-xs tracking-wider">
      <button
        onClick={() => send("positive")}
        className={cn(
          "text-ink-wash hover:text-bamboo-deep transition-colors",
          "focus:outline-none focus-visible:underline"
        )}
        aria-label="对这本书:拾到了"
      >
        拾到了
      </button>
      <span className="text-ink-wash/40">·</span>
      <button
        onClick={() => send("negative")}
        className={cn(
          "text-ink-wash hover:text-ink-mist transition-colors",
          "focus:outline-none focus-visible:underline"
        )}
        aria-label="对这本书:不准"
      >
        不准
      </button>
    </span>
  );
}
