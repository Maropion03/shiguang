// 简单的豆瓣验证:抓 search.douban.com 搜索结果首页,看是否能找到匹配条目。
// 注意:Vercel 海外 IP 有概率被豆瓣短暂拦截。验证失败时返回 { verified: false },
// 调用方应将这本书标记为"未验证"而不是丢弃,以免推荐数量不足。

const SEARCH_URL = "https://search.douban.com/book/subject_search";
const TIMEOUT_MS = 4000;

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

export type DoubanResult = {
  verified: boolean;
  doubanUrl?: string;
};

export async function verifyOnDouban(title: string, author: string): Promise<DoubanResult> {
  try {
    const q = encodeURIComponent(`${title} ${author}`);
    const url = `${SEARCH_URL}?search_text=${q}&cat=1001`;

    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), TIMEOUT_MS);
    const res = await fetch(url, {
      headers: {
        "user-agent": UA,
        accept: "text/html,application/xhtml+xml",
        "accept-language": "zh-CN,zh;q=0.9"
      },
      signal: ac.signal,
      cache: "no-store"
    }).finally(() => clearTimeout(t));

    if (!res.ok) return { verified: false };

    const html = await res.text();

    // 豆瓣新版搜索页是 JS 渲染的,但 HTML 里仍嵌有 window.__DATA__ 或 subject 链接的痕迹
    // 提取所有 subject/{id} 链接,只要至少有一个就视为命中(粗粒度兜底)。
    const m = html.match(/book\.douban\.com\/subject\/(\d+)/);
    if (m) {
      return { verified: true, doubanUrl: `https://book.douban.com/subject/${m[1]}/` };
    }
    // 关键词命中(标题在页面中出现)也作为弱验证
    if (html.includes(title)) {
      return { verified: true };
    }
    return { verified: false };
  } catch {
    return { verified: false };
  }
}

export async function verifyAll<T extends { title: string; author: string }>(
  books: T[]
): Promise<(T & DoubanResult)[]> {
  const results = await Promise.all(
    books.map(async (b) => ({ ...b, ...(await verifyOnDouban(b.title, b.author)) }))
  );
  return results;
}
