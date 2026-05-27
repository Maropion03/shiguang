import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // 宣纸·墨色·竹青·朱砂——禅意自然主义配色
        paper: {
          DEFAULT: "#F5F1E8", // 宣纸本色
          warm: "#EFE7D3",    // 旧宣纸
          deep: "#E8DEC4"     // 微卷边
        },
        ink: {
          DEFAULT: "#1F1A17", // 浓墨
          soft: "#3A332E",    // 焦墨
          mist: "#6B635C",    // 淡墨
          wash: "#A39B92"     // 远山
        },
        bamboo: {
          DEFAULT: "#7A8B6F", // 竹青
          deep: "#5C6B52",    // 苔绿
          light: "#B4BFA8"    // 嫩竹
        },
        vermilion: "#A33F2A"  // 朱砂(只做点睛,如印章)
      },
      fontFamily: {
        serif: ["'Noto Serif SC'", "'Source Han Serif SC'", "'Songti SC'", "serif"],
        sans: ["'Noto Sans SC'", "'PingFang SC'", "system-ui", "sans-serif"]
      },
      letterSpacing: {
        zen: "0.15em"
      },
      maxWidth: {
        prose: "38rem"
      },
      animation: {
        "fade-up": "fadeUp 0.7s ease-out both",
        "fade-in": "fadeIn 1.2s ease-out both",
        "ping-slow": "pingSlow 2.4s cubic-bezier(0, 0, 0.2, 1) infinite"
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        pingSlow: {
          "0%": { transform: "scale(1)", opacity: "0.8" },
          "75%, 100%": { transform: "scale(3.5)", opacity: "0" }
        }
      }
    }
  },
  plugins: []
};

export default config;
