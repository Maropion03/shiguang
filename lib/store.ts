// 推荐结果持久化:
// - 生产: Upstash Redis (Vercel KV 也是同一套)
// - 本地开发: 文件系统 fallback (.data/recommendations/<id>.json)
//
// 通过环境变量自动切换:有 KV_REST_API_URL 就走 Redis,否则走文件。

import { promises as fs } from "node:fs";
import path from "node:path";
import type { RecommendationRecord } from "./types";

const TTL_SECONDS = 60 * 60 * 24 * 30; // 30 天

function hasRemoteStore() {
  return Boolean(
    process.env.KV_REST_API_URL &&
      process.env.KV_REST_API_TOKEN
  );
}

async function getRedis() {
  const { Redis } = await import("@upstash/redis");
  return new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!
  });
}

const FS_DIR = path.join(process.cwd(), ".data", "recommendations");

async function ensureDir() {
  await fs.mkdir(FS_DIR, { recursive: true });
}

export async function saveRecommendation(rec: RecommendationRecord): Promise<void> {
  if (hasRemoteStore()) {
    const redis = await getRedis();
    await redis.set(`rec:${rec.id}`, rec, { ex: TTL_SECONDS });
    return;
  }
  await ensureDir();
  await fs.writeFile(
    path.join(FS_DIR, `${rec.id}.json`),
    JSON.stringify(rec, null, 2),
    "utf-8"
  );
}

export async function loadRecommendation(id: string): Promise<RecommendationRecord | null> {
  if (hasRemoteStore()) {
    const redis = await getRedis();
    const v = await redis.get<RecommendationRecord>(`rec:${id}`);
    return v ?? null;
  }
  try {
    const raw = await fs.readFile(path.join(FS_DIR, `${id}.json`), "utf-8");
    return JSON.parse(raw) as RecommendationRecord;
  } catch {
    return null;
  }
}

// ---- 反馈回流 ----
// 用户在结果页对每本书点「拾到了」/「不准」。
// 一条反馈 = (recId, bookIndex, signal)。同一 (recId, bookIndex) 后写覆盖前写。
// 本地开发落到 .data/feedback/<recId>.json;线上落 Redis hash `fb:<recId>`。
// 暂不做聚合 / dashboard——先收集,有数据再说后续 prompt 反哺。

export type FeedbackSignal = "positive" | "negative";

const FB_FS_DIR = path.join(process.cwd(), ".data", "feedback");

export async function saveFeedback(
  recId: string,
  bookIndex: number,
  signal: FeedbackSignal
): Promise<void> {
  if (hasRemoteStore()) {
    const redis = await getRedis();
    await redis.hset(`fb:${recId}`, { [String(bookIndex)]: signal });
    await redis.expire(`fb:${recId}`, TTL_SECONDS);
    return;
  }
  await fs.mkdir(FB_FS_DIR, { recursive: true });
  const file = path.join(FB_FS_DIR, `${recId}.json`);
  let current: Record<string, FeedbackSignal> = {};
  try {
    current = JSON.parse(await fs.readFile(file, "utf-8"));
  } catch {
    // first feedback for this rec
  }
  current[String(bookIndex)] = signal;
  await fs.writeFile(file, JSON.stringify(current, null, 2), "utf-8");
}
