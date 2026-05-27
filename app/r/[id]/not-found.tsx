import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-prose text-center animate-fade-in">
        <p className="text-ink-mist tracking-zen text-xs mb-8">404</p>
        <h1 className="font-serif text-2xl text-ink leading-loose mb-12 font-normal">
          这页书已被风翻过去了。
        </h1>
        <Link
          href="/"
          className="text-ink-mist hover:text-ink text-sm tracking-zen transition-colors"
        >
          回到首页 →
        </Link>
      </div>
    </main>
  );
}
