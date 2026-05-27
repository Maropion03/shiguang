import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F5F1E8",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            width: 42,
            height: 42,
            border: "3px solid #A33F2A",
            color: "#A33F2A",
            fontSize: 24,
            fontFamily: "serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transform: "rotate(-3deg)",
            borderRadius: 2
          }}
        >
          拾
        </div>
      </div>
    ),
    size
  );
}
