import type { BookRecommendation } from "@/lib/types";
import BookFeedback from "./BookFeedback";

export default function BookCard({
  book,
  index,
  recId
}: {
  book: BookRecommendation;
  index: number;
  recId: string;
}) {
  return (
    <article className="relative animate-fade-up">
      <div className="flex items-baseline gap-5 mb-4">
        <span className="font-serif text-vermilion text-xs tracking-zen">
          其 {["一", "二", "三", "四", "五"][index - 1] || index}
        </span>
        <div className="flex-1 h-px bg-ink/10" />
      </div>

      <h2 className="font-serif text-2xl md:text-[1.75rem] text-ink leading-snug mb-2 font-normal">
        《{book.title}》
      </h2>
      <p className="text-ink-mist text-sm tracking-wide mb-5">{book.author}</p>

      {book.oneLiner && (
        <p className="text-ink-soft text-base font-serif leading-loose mb-6">
          「{book.oneLiner}」
        </p>
      )}

      <div className="pl-5 border-l border-bamboo/40">
        <p className="text-ink-soft text-[15px] leading-loose font-serif">
          {book.reason}
        </p>
      </div>

      <div className="flex items-center gap-4 mt-6 flex-wrap">
        {book.verified && book.doubanUrl ? (
          <a
            href={book.doubanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-bamboo-deep text-xs tracking-wider hover:text-ink transition-colors"
          >
            豆瓣 ↗
          </a>
        ) : book.verified ? (
          <span className="text-bamboo-deep text-xs tracking-wider">已验证</span>
        ) : (
          <span className="text-ink-wash text-xs tracking-wider" title="豆瓣未能验证,请自行甄别">
            · 未验证
          </span>
        )}
        <span className="text-ink-wash/30 text-xs">·</span>
        <BookFeedback recId={recId} bookIndex={index - 1} />
      </div>
    </article>
  );
}
