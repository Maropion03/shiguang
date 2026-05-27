import type { Answers } from "./questions";

const MOOD: Record<string, string> = {
  calm_needed: "想要安静下来",
  be_moved: "想被什么击中",
  be_warmed: "想被轻轻接住",
  be_amused: "想松弛地笑笑",
  be_stirred: "想被搅动一下"
};

const MOTIVE: Record<string, string> = {
  escape: "一处可以躲进去的世界",
  company: "像有人在旁低声说话",
  mirror: "照见自己的此刻",
  growth: "推一把,让 ta 往前走",
  knowledge: "学到一些真实的东西"
};

const FIELD: Record<string, string> = {
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

const WEIGHT = ["", "极轻盈", "轻松", "适中份量", "稍有份量", "厚重"];

/**
 * 把答题数据转成对 "TA 此刻" 的第三人称叙述,
 * 用于分享页 visitor 视角理解推荐由谁、为何而生。
 */
export function answersToProse(a: Answers): string[] {
  const lines: string[] = [];
  if (a.mood) lines.push(`此刻 ${MOOD[a.mood] || "心绪难定"}`);
  if (a.motive) lines.push(`期待 ${MOTIVE[a.motive] || "一份恰好"}`);
  if (a.loved && a.loved.trim()) {
    const loved = a.loved.trim().slice(0, 60);
    lines.push(`最近被「${loved}」打动`);
  }
  if (typeof a.weight === "number") {
    lines.push(`想读${WEIGHT[a.weight] || "适中"}的`);
  }
  if (a.fields && a.fields.length > 0) {
    lines.push(`偏爱 ${a.fields.map((f) => FIELD[f] || f).join("、")}`);
  }
  if (a.freeform && a.freeform.trim()) {
    lines.push(`补充:${a.freeform.trim().slice(0, 80)}`);
  }
  return lines;
}
