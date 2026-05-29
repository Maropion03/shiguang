import Link from "next/link";
import Logo from "@/components/Logo";
import { currentSeason } from "@/lib/seasons";

// ISR 每小时重生成——足以让"今日·节气"准确,又不放弃静态化的缓存收益。
export const revalidate = 3600;

export default function HomePage() {
  const season = currentSeason();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-prose w-full text-center animate-fade-in">
        <div className="flex justify-center mb-6">
          <Logo size={36} />
        </div>
        <p className="text-ink-mist tracking-zen text-xs uppercase mb-2">
          shíguāng · 拾光
        </p>
        <p className="text-ink-wash tracking-zen text-[10px] mb-12">
          今日 · {season.name}
        </p>

        <h1 className="font-serif text-3xl md:text-4xl text-ink leading-relaxed mb-8 font-normal">
          为此刻的你
          <br />
          拾起一本书
        </h1>

        <div className="zen-divider mx-auto w-24 my-10" />

        <p className="text-ink-soft leading-loose text-base md:text-lg mb-16 font-light">
          书的好坏,有时不在书本身,
          <br />
          而在你与它相遇的时机。
          <br />
          <span className="text-ink-mist">回答几道题,让心绪为你引路。</span>
        </p>

        <Link
          href="/ask"
          className="inline-block px-10 py-3 border border-ink/40 text-ink hover:bg-ink hover:text-paper transition-all duration-500 tracking-zen text-sm"
        >
          开 始
        </Link>

        <p className="text-ink-wash text-xs mt-20 tracking-wider">
          约需两分钟 · 推荐由 AI 生成,豆瓣验证
        </p>
      </div>
    </main>
  );
}
