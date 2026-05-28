import type { Answers } from "./questions";

const ENDPOINT = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1/chat/completions";
// 用户提到 "deepseek v4 flash"。截至搭建时官方稳定 model id 为 deepseek-chat。
// 若有新的 model id(如 deepseek-v4 / deepseek-flash 等),通过环境变量 DEEPSEEK_MODEL 覆盖即可。
const MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";

const MOOD_LABEL: Record<string, string> = {
  calm_needed: "想要安静下来",
  be_moved: "想被什么击中",
  be_warmed: "想被轻轻接住",
  be_amused: "想松弛地笑笑",
  be_stirred: "想被搅动一下"
};

const MOTIVE_LABEL: Record<string, string> = {
  escape: "一处可以躲进去的世界",
  company: "像有人在旁低声说话",
  mirror: "照见自己的此刻",
  growth: "推一把,让我往前走",
  knowledge: "学到一些真实的东西"
};

const FIELD_LABEL: Record<string, string> = {
  literary: "文学小说",
  genre: "科幻悬疑奇幻",
  essay: "随笔散文",
  poetry: "诗",
  history: "历史人文",
  philosophy: "哲学思想",
  psychology: "心理精神分析",
  science: "自然科学",
  biography: "传记回忆",
  art: "艺术设计"
};

const WEIGHT_LABEL = ["", "极轻盈,像散步", "轻松", "适中", "稍有份量", "厚重,愿意慢慢啃"];

function summarizeAnswers(a: Answers): string {
  const lines: string[] = [];
  if (a.mood) lines.push(`心绪:${MOOD_LABEL[a.mood] || a.mood}`);
  if (a.motive) lines.push(`期望:${MOTIVE_LABEL[a.motive] || a.motive}`);
  if (a.loved && a.loved.trim()) lines.push(`最近心动的作品:${a.loved.trim()}`);
  if (typeof a.weight === "number") lines.push(`阅读份量:${WEIGHT_LABEL[a.weight] || a.weight}`);
  if (a.fields && a.fields.length > 0) {
    lines.push(`偏爱领域:${a.fields.map((f) => FIELD_LABEL[f] || f).join("、")}`);
  } else {
    lines.push("偏爱领域:不限");
  }
  if (a.freeform && a.freeform.trim()) lines.push(`补充:${a.freeform.trim()}`);
  return lines.join("\n");
}

const SYSTEM_PROMPT = `你是一位通晓中外文学、人文社科的资深书探,
说话方式像京都茶室里的老书店店主:温和、克制、有审美。
你的任务是根据读者此刻的心境与偏好,从【真实存在的、有中文版的书籍】中
为TA挑出 3 本最契合此刻的书。

严格要求:
1. 只推荐你确定真实存在、并有正式中文译本(或本身就是中文原版)的书。
   宁可保守、不要编造书名、作者或译本。
2. 不要重复推荐同一作者的多本(除非特别契合)。
3. 不推荐过于烂大街的鸡汤畅销书(《活法》《人性的弱点》等),
   除非读者的需求明确指向这一类。
4. 每一本的"为什么推这本"必须紧扣读者的具体回答,
   引用TA话里的具体词,不要泛泛而谈。
5. 文字简洁,有书卷气,避免营销腔。

只用如下 JSON 格式回复,不要任何前后文、不要 markdown 代码块标记:
{
  "books": [
    {
      "title": "书名",
      "author": "作者(中译者可省略)",
      "oneLiner": "一句话内容(不超过30字)",
      "reason": "针对这位读者的推荐理由,60-100字"
    },
    { "title": "...", "author": "...", "oneLiner": "...", "reason": "..." },
    { "title": "...", "author": "...", "oneLiner": "...", "reason": "..." }
  ]
}`;

export type RawBook = {
  title: string;
  author: string;
  oneLiner: string;
  reason: string;
};

export async function generateRecommendations(
  answers: Answers,
  exclude?: string[]
): Promise<RawBook[]> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("未配置 DEEPSEEK_API_KEY,请在环境变量中配置后再试");
  }

  const excludeLine =
    exclude && exclude.length > 0
      ? `\n\n请**避开**以下书名(读者已经看过或上一次抽到过):\n${exclude.map((t) => `《${t}》`).join("、")}\n挑出与之完全不同的另外 3 本。`
      : "";

  const userPrompt = `读者此刻的状态:\n\n${summarizeAnswers(answers)}${excludeLine}\n\n请按要求挑出 3 本书。`;

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.7,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ]
    })
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`DeepSeek API ${res.status}: ${errText.slice(0, 200)}`);
  }

  const data = await res.json();
  const content: string | undefined = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("DeepSeek 返回为空");

  let parsed: { books?: RawBook[] };
  try {
    parsed = JSON.parse(content);
  } catch {
    // 兜底:抓第一个 { ... } 块
    const m = content.match(/\{[\s\S]*\}/);
    if (!m) throw new Error("LLM 返回不是合法 JSON");
    parsed = JSON.parse(m[0]);
  }

  if (!parsed.books || !Array.isArray(parsed.books) || parsed.books.length === 0) {
    throw new Error("LLM 未给出书目");
  }

  return parsed.books
    .filter((b) => b && b.title && b.author)
    .slice(0, 3)
    .map((b) => ({
      title: String(b.title).trim(),
      author: String(b.author).trim(),
      oneLiner: String(b.oneLiner || "").trim(),
      reason: String(b.reason || "").trim()
    }));
}
