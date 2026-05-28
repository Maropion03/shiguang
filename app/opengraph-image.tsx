import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

async function loadCJKFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@500&text=${encodeURIComponent(text)}`;
    const css = await fetch(cssUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    }).then((r) => r.text());
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

export default async function OG() {
  const text = "拾光 SHÍGUĀNG为此刻的你拾起一本书答几道题让心绪为你引路";
  const fontData = await loadCJKFont(text);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F5F1E8",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "serif",
          position: "relative"
        }}
      >
        {/* logo:一页书 + 朱砂印 */}
        <div
          style={{
            width: 88,
            height: 120,
            border: "3px solid #1F1A17",
            transform: "rotate(-3deg)",
            position: "relative",
            display: "flex",
            marginBottom: 50
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 16,
              right: 12,
              width: 12,
              height: 12,
              borderRadius: 999,
              background: "#A33F2A",
              display: "flex"
            }}
          />
        </div>

        <div
          style={{
            fontSize: 20,
            color: "#6B635C",
            letterSpacing: 10,
            marginBottom: 24
          }}
        >
          SHÍ GUĀNG · 拾 光
        </div>

        <div
          style={{
            fontSize: 64,
            color: "#1F1A17",
            fontWeight: 500,
            lineHeight: 1.5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <div>为此刻的你</div>
          <div>拾起一本书</div>
        </div>

        <div
          style={{
            marginTop: 50,
            width: 100,
            height: 1.5,
            background: "#1F1A17",
            opacity: 0.4
          }}
        />

        <div
          style={{
            marginTop: 36,
            color: "#A39B92",
            fontSize: 22,
            letterSpacing: 4
          }}
        >
          答几道题 · 让心绪为你引路
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
