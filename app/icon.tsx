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
            width: 32,
            height: 44,
            border: "2px solid #1F1A17",
            transform: "rotate(-3deg)",
            position: "relative",
            display: "flex"
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 6,
              right: 5,
              width: 6,
              height: 6,
              borderRadius: 999,
              background: "#A33F2A",
              display: "flex"
            }}
          />
        </div>
      </div>
    ),
    size
  );
}
