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
    const m = css.match(/src:\s*url\(([^)]+)\)/);
    if (!m) return null;
    const fontUrl = m[1].replace(/['"]/g, "");
    return await fetch(fontUrl).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

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
        {/* 印章 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 84,
            height: 84,
            border: "3px solid #A33F2A",
            color: "#A33F2A",
            fontSize: 30,
            transform: "rotate(-3deg)",
            borderRadius: 4,
            marginBottom: 50
          }}
        >
          拾
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
