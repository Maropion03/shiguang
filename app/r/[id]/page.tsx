import { cache } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { loadRecommendation } from "@/lib/store";
import { answersToProse } from "@/lib/answersToProse";
import BookCard from "@/components/BookCard";
import ShareButton from "@/components/ShareButton";
import ReshuffleButton from "@/components/ReshuffleButton";

// 推荐记录是 immutable 的——一旦生成不变。让结果页享受 ISR,
// 且用 React.cache() 让 generateMetadata 和 ResultPage 共享同一次 Redis 调用。
export const revalidate = 86400;

const getRec = cache(loadRecommendation);

export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const rec = await getRec(id);
  if (!rec) return { title: "拾光" };
  const titles = rec.books
    .slice(0, 3)
    .map((b) => `《${b.title}》`)
    .join(" ");
  const prefix = rec.label ? `${rec.label} · ` : "";
  return {
    title: `${prefix}${titles} · 拾光`,
    description: rec.label
      ? `${rec.label} — 为此刻的 ta 拾起的三本书`
      : "为此刻的 ta 拾起的三本书",
    openGraph: {
      title: rec.label
        ? `${rec.label} · 拾起这三本 · ${titles}`
        : `拾起这三本 · ${titles}`,
      description: "为此刻的 ta 拾起的三本书",
      type: "article"
    }
  };
}

export default async function ResultPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rec = await getRec(id);
  if (!rec) notFound();

  const date = new Date(rec.createdAt).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const prose = answersToProse(rec.answers);

  return (
    <main className="min-h-screen px-6 py-16 md:py-24">
      <div className="max-w-prose mx-auto animate-fade-in">
        {/* 标头 */}
        <div className="text-center mb-12">
          <p className="text-ink-mist tracking-zen text-xs mb-6">{date}</p>
          <h1 className="font-serif text-2xl md:text-3xl text-ink leading-relaxed font-normal">
            为此刻的 ta
            <br />
            拾起这 {rec.books.length} 本
          </h1>
          <div className="zen-divider mx-auto w-16 mt-10" />
        </div>

        {/* 此刻四字 —— LLM 为此次答题命名的状态雅称,可分享性强 */}
        {rec.label && (
          <div className="text-center mb-16">
            <p className="text-ink-mist tracking-zen text-[11px] mb-5">
              你的此刻
            </p>
            <div className="inline-flex gap-3 md:gap-5">
              {rec.label.split("").map((ch, i) => (
                <span
                  key={i}
                  className="font-serif text-ink text-3xl md:text-4xl leading-none w-12 h-14 md:w-14 md:h-16 inline-flex items-center justify-center border border-ink/25"
                  style={{ transform: `rotate(${i % 2 === 0 ? -1 : 1}deg)` }}
                >
                  {ch}
                </span>
              ))}
            </div>
            <div className="mt-5 flex justify-center">
              <span className="block w-1.5 h-1.5 rounded-full bg-vermilion" />
            </div>
          </div>
        )}

        {/* 此刻语境 —— 给分享 visitor 看的发起者状态摘要 */}
        {prose.length > 0 && (
          <div className="mb-16 px-6 py-8 border-l-2 border-bamboo/40 bg-paper-warm/40">
            <p className="text-ink-mist text-[11px] tracking-zen mb-4">那时,ta —</p>
            <ul className="flex flex-col gap-2">
              {prose.map((line, i) => (
                <li
                  key={i}
                  className="font-serif text-ink-soft text-[15px] leading-loose"
                >
                  · {line}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 书目 */}
        <div className="flex flex-col gap-12">
          {rec.books.map((book, i) => (
            <BookCard key={i} book={book} index={i + 1} recId={rec.id} />
          ))}
        </div>

        {/* 操作 */}
        <div className="mt-20 pt-10 border-t border-ink/10 flex flex-col items-center gap-6">
          <ShareButton id={rec.id} />
          <ReshuffleButton
            answers={rec.answers}
            exclude={rec.books.map((b) => b.title)}
          />
          <Link
            href="/ask"
            className="text-ink-mist hover:text-ink text-sm tracking-zen transition-colors"
          >
            从头为自己拾一次 →
          </Link>
        </div>

        <p className="text-ink-wash text-xs text-center mt-16 tracking-wider leading-loose">
          推荐由 AI 生成,豆瓣未验证的条目可能存在偏差,
          <br />
          请把它当作一句友人的提议,而非定论。
        </p>
      </div>
    </main>
  );
}
