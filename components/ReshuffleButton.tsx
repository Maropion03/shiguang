"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { track } from "@vercel/analytics";
import type { Answers } from "@/lib/questions";
import Seeking from "./Seeking";

export default function ReshuffleButton({ answers }: { answers: Answers }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function reshuffle() {
    setLoading(true);
    setErr(null);
    track("reshuffle_attempt");
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ answers })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "重抽失败");
      track("reshuffle_success", { id: data.id });
      router.push(`/r/${data.id}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "未知错误";
      setErr(msg);
      setLoading(false);
    }
  }

  return (
    <>
      {loading && <Seeking />}
      <button
        onClick={reshuffle}
        disabled={loading}
        className="text-ink-mist hover:text-ink text-sm tracking-zen transition-colors disabled:opacity-40"
      >
        ↻ 用同样的回答再抽一组
      </button>
      {err && (
        <p className="text-vermilion text-xs tracking-wide mt-2">{err}</p>
      )}
    </>
  );
}
