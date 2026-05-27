# 拾光 · Shíguāng

> 为此刻的你,拾起一本书。

一个基于 LLM 的书籍推荐工具。用户回答 5 道关于心境/动机/偏好的问题,
AI(DeepSeek)根据回答推荐 3 本契合此刻的书,豆瓣验证后呈现。

## 技术栈

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS · 禅意自然主义视觉
- DeepSeek API(OpenAI 兼容)
- Upstash Redis(Vercel KV)持久化 + IP 限速
- 豆瓣搜索页抓取做书目存在性验证

---

## 本地运行

```bash
cd D:\book-rec
npm install
cp .env.example .env.local   # Windows PowerShell: Copy-Item .env.example .env.local
# 编辑 .env.local 填入 DEEPSEEK_API_KEY
npm run dev
```

打开 http://localhost:3000

> **首次运行不需要 Redis**:无 KV 配置时,推荐结果会落到本地文件 `.data/recommendations/<id>.json`,
> 同样可以通过 `/r/<id>` 访问。

---

## 配置 DeepSeek Key

1. 在 https://platform.deepseek.com/api_keys 申请 Key
2. 把 Key 填入 `.env.local`:
   ```env
   DEEPSEEK_API_KEY=sk-...
   ```
3. 关于 model id:默认使用 `deepseek-chat`(官方稳定通用模型)。
   如果你想用 "v4 flash" 等新型号,在 DeepSeek 控制台确认实际可用的 model id,然后:
   ```env
   DEEPSEEK_MODEL=deepseek-chat
   ```
4. 重启 `npm run dev`

成本参考:每次推荐 prompt + 输出约 1.5K token,DeepSeek 单次约 ¥0.005-0.01。
按 IP 每天 5 次限速,百日活成本 < ¥5/天。

---

## 部署到 Vercel

1. 推送代码到 GitHub
2. https://vercel.com → Add New → Project → 选择仓库
3. **环境变量** 里添加 `DEEPSEEK_API_KEY`
4. 创建 KV 数据库:Vercel Dashboard → Storage → Create → Upstash KV
   - 创建后会自动注入 `KV_REST_API_URL` / `KV_REST_API_TOKEN`(也兼容自建 Upstash)
5. Deploy

---

## 已知问题 / 待优化

1. **豆瓣验证从 Vercel 海外 IP 可能不稳定**。
   - 当前策略:验证失败的书仍展示,但标记"未验证",让用户自行甄别。
   - 后续可换成 Bing Web Search API,或自建国内代理。
2. **DeepSeek 仍可能编造书名/译本**。
   - 已通过 system prompt 强约束"宁可保守不要编造";
   - 豆瓣验证作为兜底;
   - 后续可在验证全部失败时触发重生成。
3. **没有刷新限流的提示动画**,达到限速会直接显示文案。
4. 没有 favicon。可在 `app/icon.tsx` 添加。

---

## 目录结构

```
book-rec/
├─ app/
│  ├─ page.tsx                # 首页
│  ├─ ask/page.tsx            # 问卷页
│  ├─ r/[id]/page.tsx         # 推荐结果(可分享)
│  ├─ api/recommend/route.ts  # 推荐 API
│  └─ globals.css
├─ components/
│  ├─ Survey.tsx              # 多步问卷
│  ├─ BookCard.tsx
│  ├─ ShareButton.tsx
│  └─ questions/              # 三种题型
├─ lib/
│  ├─ questions.ts            # 题目配置
│  ├─ deepseek.ts             # LLM 调用 + prompt
│  ├─ douban.ts               # 豆瓣验证
│  ├─ store.ts                # KV / 文件双轨持久化
│  ├─ ratelimit.ts            # IP 限速
│  └─ types.ts
└─ .env.example
```
