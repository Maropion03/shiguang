// 24 节气框架(roadmap #1 的第一步)。
//
// 现在的用法:暴露 currentSeason() 给页面做小尺寸的"今日·立秋"暗示。
// 后续的用法:
//   1) questions.ts 按节气覆盖 mood/motive 的副标题或选项 hint
//   2) tailwind theme 按节气切色板(春竹青、夏朱、秋金、冬墨)
//   3) OG 图角落加节气名
//
// 重要注意:24 节气每年精确日期会浮动 ±1~2 天(取决于太阳黄经),
// 但本表用了"大多数年份适用"的静态日期,差一两天对"暗示"层面无伤。
// 如果未来要用节气做严肃的内容切换(比如发布日期相关的活动),
// 应替换为按当年精确计算的实现(比如引入 chinese-lunar 之类)。

export type SeasonKey =
  | "xiaohan" | "dahan"
  | "lichun" | "yushui" | "jingzhe" | "chunfen" | "qingming" | "guyu"
  | "lixia" | "xiaoman" | "mangzhong" | "xiazhi" | "xiaoshu" | "dashu"
  | "liqiu" | "chushu" | "bailu" | "qiufen" | "hanlu" | "shuangjiang"
  | "lidong" | "xiaoxue" | "daxue" | "dongzhi";

export type SeasonInfo = {
  key: SeasonKey;
  name: string;       // 中文名,如"立秋"
  monthDay: [number, number];  // 该节气近似起始的 [月, 日]
};

// 按时间顺序(从年初到年末)的近似日期。
const SOLAR_TERMS: SeasonInfo[] = [
  { key: "xiaohan",    name: "小寒",   monthDay: [1, 5] },
  { key: "dahan",      name: "大寒",   monthDay: [1, 20] },
  { key: "lichun",     name: "立春",   monthDay: [2, 4] },
  { key: "yushui",     name: "雨水",   monthDay: [2, 19] },
  { key: "jingzhe",    name: "惊蛰",   monthDay: [3, 6] },
  { key: "chunfen",    name: "春分",   monthDay: [3, 21] },
  { key: "qingming",   name: "清明",   monthDay: [4, 5] },
  { key: "guyu",       name: "谷雨",   monthDay: [4, 20] },
  { key: "lixia",      name: "立夏",   monthDay: [5, 6] },
  { key: "xiaoman",    name: "小满",   monthDay: [5, 21] },
  { key: "mangzhong",  name: "芒种",   monthDay: [6, 6] },
  { key: "xiazhi",     name: "夏至",   monthDay: [6, 21] },
  { key: "xiaoshu",    name: "小暑",   monthDay: [7, 7] },
  { key: "dashu",      name: "大暑",   monthDay: [7, 23] },
  { key: "liqiu",      name: "立秋",   monthDay: [8, 8] },
  { key: "chushu",     name: "处暑",   monthDay: [8, 23] },
  { key: "bailu",      name: "白露",   monthDay: [9, 8] },
  { key: "qiufen",     name: "秋分",   monthDay: [9, 23] },
  { key: "hanlu",      name: "寒露",   monthDay: [10, 8] },
  { key: "shuangjiang",name: "霜降",   monthDay: [10, 23] },
  { key: "lidong",     name: "立冬",   monthDay: [11, 7] },
  { key: "xiaoxue",    name: "小雪",   monthDay: [11, 22] },
  { key: "daxue",      name: "大雪",   monthDay: [12, 7] },
  { key: "dongzhi",    name: "冬至",   monthDay: [12, 22] }
];

// 给定日期落在哪个节气中——返回该日期之前(含当天)最近的一个节气。
// 1月1日~1月4日仍属于"冬至"(去年的最后一个节气)。
export function currentSeason(now: Date = new Date()): SeasonInfo {
  const m = now.getMonth() + 1;
  const d = now.getDate();
  let found: SeasonInfo = SOLAR_TERMS[SOLAR_TERMS.length - 1]; // 冬至
  for (const t of SOLAR_TERMS) {
    const [tm, td] = t.monthDay;
    if (tm < m || (tm === m && td <= d)) {
      found = t;
    } else {
      break;
    }
  }
  return found;
}
