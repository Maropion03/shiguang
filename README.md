<div align="center">

# 拾光 · Shíguāng

**为此刻的你,拾起一本书**

回答五道题,让 AI 顺着你此刻的心境,从真实存在的中文书中拾起三本。

[**▸ 在线体验**](https://book-rec-medusa.vercel.app)  ·  [反馈建议](https://github.com/Maropion03/book-rec/issues)

![hero](https://book-rec-medusa.vercel.app/opengraph-image)

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

拾光把书籍推荐问题重新定义为一个**心境匹配问题**:
五道关于情绪、动机、最近所爱的题,让 LLM 当一名通晓中外书海的资深书探,
为你此刻的状态拾起三本最契合的书。

---

## 特性

- **五道题,两分钟完成** —— 情绪状态 · 阅读动机 · 最近心动的作品 · 阅读份量 + 领域 · 自由补充
- **推荐理由引用你的原话** —— 不是「TA 可能喜欢」,而是「你说想要安静下来,所以……」
- **豆瓣后端验证** —— 每本书都过豆瓣搜索页核查存在性,降低 LLM 幻觉书名风险
- **可分享的结果页** —— 每次推荐生成短链 `/r/{id}`,朋友点开能看到「ta 此刻」的语境
- **动态 OG 卡片** —— 微信 / 小红书 / Twitter 链接预览自动渲染该次推荐的专属图
- **禅意自然主义视觉** —— 宣纸 · 墨色 · 竹青 · 朱砂四色,衬线中文,极简留白
- **IP 限速 5 次/日** —— 防滥用,边际成本可控
- **完整埋点** —— 答题分布 · 流失漏斗 · 分享率 · 重抽率

---

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 15 (App Router) · React 19 · TypeScript |
| 样式 | Tailwind CSS · Noto Serif SC |
| LLM | DeepSeek V4 Flash(OpenAI 兼容协议) |
| 存储 | Upstash Redis(Vercel KV 兼容) |
| 限速 | Upstash Ratelimit |
| 校验 | 豆瓣搜索页 HTML 抓取 |
| 图像 | `next/og` + Google Fonts CSS 子集 |
| 部署 | Vercel · 自动 SSL · 全球 CDN |
| 数据 | Vercel Analytics |

---

## 本地运行

```bash
git clone https://github.com/Maropion03/book-rec.git
cd book-rec
npm install
cp .env.example .env.local   # PowerShell: Copy-Item .env.example .env.local
# 在 .env.local 填入 DEEPSEEK_API_KEY
npm run dev
```

打开 http://localhost:3000

> **本地不需要 Redis**。无 KV 配置时,推荐结果自动落到 `.data/recommendations/<id>.json`,
> `/r/<id>` 一样能访问。

---

## 部署到 Vercel

```bash
# 1. 推到 GitHub
gh repo create book-rec --public --source=. --push

# 2. 在 vercel.com 导入仓库,框架自动识别为 Next.js
# 3. 添加环境变量:
#    DEEPSEEK_API_KEY  = sk-xxx
#    DEEPSEEK_MODEL    = deepseek-v4-flash
# 4. 部署后在 Storage → Marketplace 添加 Upstash Redis 并 Connect 到项目
# 5. Redeploy 一次,让新 env 生效
```

详细 KV 与域名配置见 [`docs/DEPLOY.md`](docs/DEPLOY.md)(待补)。

---

## 项目结构

```
book-rec/
├─ app/
│  ├─ page.tsx                       # 首页(品牌叙述 + CTA)
│  ├─ ask/page.tsx                   # 五道题问卷
│  ├─ r/[id]/page.tsx                # 推荐结果(可分享)
│  ├─ r/[id]/opengraph-image.tsx     # 动态 OG 图(per recommendation)
│  ├─ opengraph-image.tsx            # 站点 OG 图
│  ├─ icon.tsx                       # SVG-rendered favicon(朱砂"拾"印章)
│  ├─ robots.ts                      # 爬虫规则
│  ├─ api/recommend/route.ts         # 推荐 API · LLM · 验证 · 持久化 · 限速
│  └─ globals.css                    # 宣纸纸纹 · 墨色变量 · 印章样式
├─ components/
│  ├─ Survey.tsx                     # 多步问卷状态机
│  ├─ Seeking.tsx                    # 拾起按钮后的禅意中间态
│  ├─ BookCard.tsx                   # "其一/其二/其三" 推荐卡
│  ├─ ShareButton.tsx                # 复制分享链接
│  ├─ ReshuffleButton.tsx            # 用同样答案再抽一组
│  └─ questions/                     # 三种题型组件
├─ lib/
│  ├─ questions.ts                   # 题目配置(可修改文案)
│  ├─ deepseek.ts                    # LLM 调用 + system prompt
│  ├─ douban.ts                      # 豆瓣验证
│  ├─ store.ts                       # KV / 文件双轨持久化
│  ├─ ratelimit.ts                   # IP 限速
│  ├─ answersToProse.ts              # 答案叙事化(给 visitor 看的"此刻"语境)
│  └─ types.ts
└─ .env.example
```

---

## 关于推荐质量

- **System prompt 强约束**:要求 LLM 仅推荐确实出版过中译本的书,宁可保守不要编造
- **豆瓣兜底验证**:每本推荐过豆瓣搜索页核对,验证失败的不会被丢弃,会标记「· 未验证」让用户自行甄别
- **prompt 引用用户原话**:推荐理由必须扣回你的具体回答,避免「TA 可能喜欢」式空话

实测三组不同心境,9 本推荐,**9/9 全部豆瓣可查证**:

| 心境 | 推荐 |
|---|---|
| 想安静 · 喜欢是枝裕和 | 《枕草子》《雪国》《猎人们》 |
| 想被搅动 · 喜欢博尔赫斯/2666 | 《西西弗神话》《地下室手记》《荒原狼》 |
| 想被治愈 · 喜欢步履不停 | (实测见 [`/r/0GntmxOnz-`](https://book-rec-medusa.vercel.app/r/0GntmxOnz-)) |

---

## 路线图

- [ ] 节气主题版(立秋 · 冬至 · 春分,自动切换问卷文案)
- [ ] 「你的此刻」四字标签(类 MBTI 短卡,提升朋友圈晒图意愿)
- [ ] 独立书店购买跳转(下游变现)
- [ ] 推荐质量回流(用户点「不准」/「拾到了」,数据反哺 prompt)
- [ ] 多模型 A/B(Claude / Kimi / DeepSeek 同问答对比)

---

## License

[MIT](LICENSE) © 2026 Maropion03

---

<div align="center">
<sub>书的好坏,有时不在书本身,而在你与它相遇的时机。</sub>
</div>
