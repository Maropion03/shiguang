// 拾光 logo:一页微倾的书页 + 右上的朱砂印。
// 朱砂在右上位置呼应中国书画的落款/钤印传统;-3deg 倾斜延续原 seal 的视觉记忆。
//
// SVG 用 viewBox 0 0 64 64 内部统一坐标系,通过 size 等比缩放。
// 也用于 Open Graph 图片——为兼容 Satori 那里再额外用 div 版本(见 opengraph-image.tsx)。

export default function Logo({
  size = 40,
  className
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="拾光"
      className={className}
    >
      <g transform="rotate(-3 32 32)">
        <rect
          x="16"
          y="10"
          width="32"
          height="44"
          fill="none"
          stroke="#1F1A17"
          strokeWidth="2.5"
        />
        <circle cx="40" cy="20" r="4" fill="#A33F2A" />
      </g>
    </svg>
  );
}
