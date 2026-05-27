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
