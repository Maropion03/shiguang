<div align="center">

# 拾光 · Shíguāng

**为此刻的你,拾起一本书**

回答五道题,让 AI 顺着你此刻的心境,从真实存在的中文书中拾起三本。

### [▸  立刻试一下  ◂](https://shiguang-maropion.vercel.app)

![hero](https://shiguang-maropion.vercel.app/opengraph-image)

[![Next.js](https://img.shields.io/badge/Next.js-15-000?logo=nextdotjs&logoColor=fff)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=fff)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=fff)](https://tailwindcss.com)
[![DeepSeek](https://img.shields.io/badge/LLM-DeepSeek_V4_Flash-4D6BFE)](https://platform.deepseek.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-000?logo=vercel)](https://vercel.com)
![License](https://img.shields.io/badge/license-MIT-A33F2A)

</div>

---

## 为什么做这个

豆瓣的书单是排行,小红书的书单是滤镜,Kindle 的推荐是销量。
**没有一个推荐器在意"你此刻是什么状态"**。

拾光把书籍推荐重新定义为一个**心境匹配问题**。
五道关于情绪、动机、最近所爱的题,让 LLM 当一名通晓中外书海的资深书探,
为你此刻的状态拾起三本最契合的书。

---

## 体验亮点

- **两分钟,五道题** — 一页一题,留白与字距都按禅意排版,像在做一道心理测验
- **AI 引用你的原话给出推荐理由** — 不是「TA 可能喜欢」,而是「你说想要安静下来,所以推《枕草子》」
- **豆瓣后端验证** — 每本推荐过豆瓣核查,降低 LLM 幻觉书名
- **可分享的结果页 + 专属预览卡** — 微信 / 小红书贴链接,会渲染该次推荐的封面图
- **「用同样答案再抽一组」** — 三本都看过?换一批,不用重新答题
- **禅意自然主义视觉** — 宣纸 · 墨色 · 竹青 · 朱砂四色,衬线中文,极简留白

---

## 实测三组

| 此刻心境 | AI 拾起的三本 |
|---|---|
| 想安静下来 · 喜欢是枝裕和、《漫长的季节》 | 《枕草子》 · 《雪国》 · 《猎人们》 |
| 想被搅动一下 · 喜欢博尔赫斯、《2666》 | 《西西弗神话》 · 《地下室手记》 · 《荒原狼》 |
| 想被轻轻接住 · 喜欢《步履不停》 | [/r/0GntmxOnz-](https://shiguang-maropion.vercel.app/r/0GntmxOnz-) |

9 本推荐 · **9 本豆瓣可查证** · 推荐理由全部紧扣读者原话。

---

## 路线图

- [ ] 节气主题版(立秋 · 冬至 · 春分,自动切换问卷文案)
- [ ] 「你的此刻」四字标签(类 MBTI 短卡,提升朋友圈晒图意愿)
- [ ] 独立书店购买跳转
- [ ] 推荐质量回流(用户点「不准」/「拾到了」,数据反哺 prompt)

---

<details>
<summary><b>开发者信息</b>(技术栈 · 自部署 · 项目结构)</summary>

### 技术栈

Next.js 15 · React 19 · TypeScript · Tailwind CSS · DeepSeek V4 Flash · Upstash Redis · Vercel

### 一键自部署

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMaropion03%2Fbook-rec&env=DEEPSEEK_API_KEY,DEEPSEEK_MODEL&envDescription=DeepSeek+API+%E5%87%AD%E6%8D%AE&envLink=https%3A%2F%2Fplatform.deepseek.com%2Fapi_keys&project-name=book-rec&repository-name=book-rec)

填两个变量(`DEEPSEEK_API_KEY` 与 `DEEPSEEK_MODEL=deepseek-v4-flash`)即可上线。
如需跨实例持久化分享链接,在项目 Storage 里加一个 Upstash Redis 实例 Connect 即可。

### 本地开发

```bash
git clone https://github.com/Maropion03/book-rec.git
cd book-rec
npm install
cp .env.example .env.local   # 填入 DEEPSEEK_API_KEY
npm run dev
```

无 KV 配置时,推荐结果自动落到本地文件 `.data/recommendations/<id>.json`。

### 项目结构

```
app/
  page.tsx                       首页
  ask/page.tsx                   五道题问卷
  r/[id]/page.tsx                推荐结果(可分享)
  r/[id]/opengraph-image.tsx     动态 OG 卡片
  api/recommend/route.ts         推荐 API · LLM · 验证 · 持久化 · 限速
components/                      Survey · BookCard · Seeking · …
lib/
  deepseek.ts                    LLM 调用 + system prompt
  douban.ts                      豆瓣验证
  store.ts                       KV / 文件双轨持久化
  ratelimit.ts                   IP 限速
  questions.ts                   题目配置
```

</details>

---

<div align="center">
<sub>书的好坏,有时不在书本身,而在你与它相遇的时机。</sub>
</div>
