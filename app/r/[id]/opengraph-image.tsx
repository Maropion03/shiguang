import { ImageResponse } from "next/og";
import { loadRecommendation } from "@/lib/store";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

// 从 Google Fonts 拉一份 Noto Serif SC 的字符子集(只覆盖本图实际用到的字),
// 这样体积可控,中文不再变方框。
async function loadCJKFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500&text=${encodeURIComponent(text)}`;
    const css = await fetch(cssUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    }).then((r) => r.text());
    // 优先挑 woff2 格式的 url——Google Fonts CSS 里可能含多个回退格式,
    // 取第一个 url() 在某些 UA 下会落到 EOT/SVG 这种 ImageResponse 不识别的格式。
    const woff2 = [...css.matchAll(/src:\s*url\(([^)]+)\)\s*format\(['"]?woff2['"]?\)/g)];
    const any = woff2[0] || css.match(/src:\s*url\(([^)]+)\)/);
    if (!any) return null;
    const fontUrl = (Array.isArray(any) ? any[1] : (any as RegExpMatchArray)[1]).replace(/['"]/g, "");
    return await fetch(fontUrl).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export const revalidate = 86400;

export default async function OG({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const rec = await loadRecommendation(id);
  const fallback = {
    titles: ["此刻的三本", "为你而拾", "拾光"],
    authors: ["", "", ""]
  };

  const titles = rec
    ? rec.books.slice(0, 3).map((b) => b.title)
    : fallback.titles;
  const authors = rec
    ? rec.books.slice(0, 3).map((b) => b.author)
    : fallback.authors;

  // 收集本图所有要渲染的字符,用作字体子集请求
  const allText =
    "拾光 · 为此刻的你拾起的三本" +
    titles.join("") +
    authors.join("") +
    "其一二三、《》";
  const fontData = await loadCJKFont(allText);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F5F1E8",
          display: "flex",
          flexDirection: "column",
          padding: "80px 90px",
          fontFamily: "serif",
          position: "relative"
        }}
      >
        {/* 顶部 logo / 印章 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div
            style={{
              fontSize: 22,
              color: "#6B635C",
              letterSpacing: 6
            }}
          >
            SHÍ GUĀNG · 拾 光
          </div>
          <div
            style={{
              width: 52,
              height: 70,
              border: "2.5px solid #1F1A17",
              transform: "rotate(-3deg)",
              position: "relative",
              display: "flex"
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 9,
                right: 7,
                width: 8,
                height: 8,
                borderRadius: 999,
                background: "#A33F2A",
                display: "flex"
              }}
            />
          </div>
        </div>

        {/* 主标题 */}
        <div
          style={{
            marginTop: 70,
            fontSize: 44,
            color: "#1F1A17",
            fontWeight: 500,
            lineHeight: 1.5,
            display: "flex"
          }}
        >
          为此刻的你 · 拾起这三本
        </div>

        <div
          style={{
            marginTop: 28,
            width: 90,
            height: 1.5,
            background: "#1F1A17",
            opacity: 0.4
          }}
        />

        {/* 三本书 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 26,
            marginTop: 48
          }}
        >
          {titles.map((t, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 26
              }}
            >
              <div
                style={{
                  color: "#A33F2A",
                  fontSize: 22,
                  width: 60,
                  display: "flex"
                }}
              >
                {`其${["一", "二", "三"][i]}`}
              </div>
              <div
                style={{
                  color: "#1F1A17",
                  fontSize: 38,
                  fontWeight: 500,
                  display: "flex"
                }}
              >
                {`《${t}》`}
              </div>
              {authors[i] && (
                <div
                  style={{
                    color: "#6B635C",
                    fontSize: 22,
                    marginLeft: 6,
                    display: "flex"
                  }}
                >
                  {authors[i]}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 底部小字 */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 90,
            right: 90,
            display: "flex",
            justifyContent: "space-between",
            color: "#A39B92",
            fontSize: 18,
            letterSpacing: 2
          }}
        >
          <div>为此刻拾起一本书</div>
          <div>shíguāng.app</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: fontData
        ? [
            {
              name: "Noto Serif SC",
              data: fontData,
              style: "normal",
              weight: 500
            }
          ]
        : undefined
    }
  );
}
