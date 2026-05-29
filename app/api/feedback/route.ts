import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { saveFeedback } from "@/lib/store";

export const runtime = "nodejs";

// 反馈回流接口:用户对每本书点「拾到了」/「不准」。
// 不做认证、不绑用户——一条 recId 上限 3 本,id 是 nanoid(10) 不可猜,
// 写入幂等(同 bookIndex 后写覆盖前写),所以不需要单独限速。
const BodySchema = z.object({
  recId: z.string().min(6).max(20),
  bookIndex: z.number().int().min(0).max(9),
  signal: z.enum(["positive", "negative"])
});

export async function POST(req: NextRequest) {
  let body: z.infer<typeof BodySchema>;
  try {
    body = BodySchema.parse(await req.json());
  } catch {
    return NextResponse.json({ error: "请求格式有误" }, { status: 400 });
  }

  try {
    await saveFeedback(body.recId, body.bookIndex, body.signal);
  } catch (e) {
    console.error("saveFeedback failed:", e);
    return NextResponse.json({ error: "反馈未能记录" }, { status: 503 });
  }

  return NextResponse.json({ ok: true });
}
