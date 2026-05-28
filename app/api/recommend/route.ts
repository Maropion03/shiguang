import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { nanoid } from "nanoid";
import { generateRecommendations } from "@/lib/deepseek";
import { verifyAll } from "@/lib/douban";
import { saveRecommendation } from "@/lib/store";
import { checkRateLimit } from "@/lib/ratelimit";
import type { BookRecommendation, RecommendationRecord } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MOOD_VALUES = ["calm_needed", "be_moved", "be_warmed", "be_amused", "be_stirred"] as const;
const MOTIVE_VALUES = ["escape", "company", "mirror", "growth", "knowledge"] as const;
const FIELD_VALUES = [
  "literary", "genre", "essay", "poetry", "history",
  "philosophy", "psychology", "science", "biography", "art"
] as const;

const AnswersSchema = z.object({
  mood: z.enum(MOOD_VALUES).optional(),
  motive: z.enum(MOTIVE_VALUES).optional(),
  loved: z.string().max(500).optional(),
  weight: z.number().int().min(1).max(5).optional(),
  fields: z.array(z.enum(FIELD_VALUES)).max(5).optional(),
  freeform: z.string().max(500).optional()
});

const BodySchema = z.object({
  answers: AnswersSchema,
  exclude: z.array(z.string().max(80)).max(10).optional()
});

export async function POST(req: NextRequest) {
  // 限速
  const rl = await checkRateLimit(req);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "今日推荐已达上限,明天再来吧。" },
      { status: 429 }
    );
  }

  // 解析输入
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "请求格式有误" }, { status: 400 });
  }

  // 至少需要 mood / motive / loved 之一,避免空白请求
  const { answers } = body;
  if (!answers.mood && !answers.motive && !answers.loved) {
    return NextResponse.json({ error: "请至少回答几道题再提交" }, { status: 400 });
  }

  // 调 LLM
  let raw;
  try {
    raw = await generateRecommendations(answers, body.exclude);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "推荐生成失败";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
  if (raw.length === 0) {
    return NextResponse.json({ error: "AI 未返回有效推荐,请重试" }, { status: 502 });
  }

  // 豆瓣验证(失败不影响展示,只是标记 verified=false)
  const verified = await verifyAll(raw);

  const books: BookRecommendation[] = verified.map((v) => ({
    title: v.title,
    author: v.author,
    oneLiner: v.oneLiner,
    reason: v.reason,
    verified: v.verified,
    doubanUrl: v.doubanUrl
  }));

  const record: RecommendationRecord = {
    id: nanoid(10),
    createdAt: Date.now(),
    answers,
    books
  };

  try {
    await saveRecommendation(record);
  } catch (e) {
    // 存储失败时不能给前端 id——结果页 loadRecommendation 会 404。
    // 把 books 内联返回,让前端可选地用 sessionStorage 兜底。
    console.error("saveRecommendation failed:", e);
    return NextResponse.json(
      {
        error: "结果暂时无法保存,请稍后再试",
        books: record.books
      },
      { status: 503 }
    );
  }

  return NextResponse.json({ id: record.id });
}
