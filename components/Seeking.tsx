"use client";

import { useEffect, useState } from "react";

const PHASES = [
  "倾听你此刻的心绪",
  "在书架前停留片刻",
  "为你抽出几本"
];

export default function Seeking() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setI((prev) => (prev + 1) % PHASES.length);
    }, 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-paper animate-fade-in">
      {/* 朱砂呼吸点 */}
      <div className="relative w-3 h-3 mb-20">
        <span className="absolute inset-0 rounded-full bg-vermilion/30 animate-ping-slow" />
        <span className="absolute inset-0 rounded-full bg-vermilion" />
      </div>

      {/* 阶段文字:用 key 触发淡入 */}
      <p
        key={i}
        className="font-serif text-ink text-lg md:text-xl tracking-zen animate-fade-up"
      >
        {PHASES[i]}
        <span className="text-ink-wash">…</span>
      </p>

      <p className="text-ink-wash text-xs tracking-wider mt-16">
        通常约需 10 – 20 秒
      </p>
    </div>
  );
}
