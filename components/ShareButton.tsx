"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

export default function ShareButton({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    const url = `${window.location.origin}/r/${id}`;
    track("share_copy", { id });
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt("复制此链接以分享:", url);
    }
  }

  return (
    <button
      onClick={copy}
      className="px-8 py-2.5 border border-ink/40 text-ink hover:bg-ink hover:text-paper transition-all duration-500 tracking-zen text-sm"
    >
      {copied ? "已复制 ·" : "分享此次推荐"}
    </button>
  );
}
