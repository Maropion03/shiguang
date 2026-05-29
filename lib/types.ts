export type BookRecommendation = {
  title: string;
  author: string;
  oneLiner: string;       // 一句话内容简介
  reason: string;         // 针对此用户的"为什么推这本"
  verified: boolean;      // 是否在豆瓣验证到
  doubanUrl?: string;     // 豆瓣条目链接(若验证到)
};

export type RecommendationRecord = {
  id: string;
  createdAt: number;
  answers: import("./questions").Answers;
  books: BookRecommendation[];
  label?: string;   // 「此刻」四字标签,LLM 生成,可能为空
};
