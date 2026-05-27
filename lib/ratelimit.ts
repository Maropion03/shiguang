// IP 限速:每 IP 每天 5 次推荐请求。
// 仅在配置了 Upstash 时启用;无 KV 时本地开发不限速。

import type { NextRequest } from "next/server";

export type RateLimitResult = {
  ok: boolean;
  remaining: number;
  resetAt: number;
};

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}

export async function checkRateLimit(req: NextRequest): Promise<RateLimitResult> {
  if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
    return { ok: true, remaining: 999, resetAt: Date.now() + 86400_000 };
  }
  const { Redis } = await import("@upstash/redis");
  const { Ratelimit } = await import("@upstash/ratelimit");
  const redis = new Redis({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN
  });
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.fixedWindow(5, "1 d"),
    prefix: "rl:shiguang"
  });
  const ip = clientIp(req);
  const r = await limiter.limit(ip);
  return { ok: r.success, remaining: r.remaining, resetAt: r.reset };
}
