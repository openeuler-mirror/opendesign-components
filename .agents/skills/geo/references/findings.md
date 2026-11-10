# GEO 调研结论(skill 在手工作知识)

> 本文是 agent 做分析时的在手知识快照;某具体库的结论以该库自己的方案文档为准。

> **目标简称(全文 a/b/c 指此):**(a) 内容引用(被生成式引擎在答案中引用/转述)、(b) 代理可操作(读无障碍树的 AI 代理能识别并操作组件)、(c) AI 编码工具认识组件。默认 a主b辅;L1 内常翻转为 b主a辅(见末段「诚实张力」)。

## GEO 是什么

- GEO(生成式引擎优化):优化内容,使其被生成式引擎在合成答案中引用/转述。学术术语,Aggarwal 等 arXiv:2311.09735(2023,Princeton 资深作者)。
- 生成式引擎:基于 LLM 的检索+合成系统(Perplexity、Google AI Overviews、Copilot、ChatGPT search、Claude)。
- 别名:AEO、LLM SEO、LLMO 是业界同义词;GEO 是学术术语。

## 什么有效 / 无效(Princeton 论文,内容层面)

- 有效(+~40% 可见度):Cite Sources(加引用)、Quotation Addition(加引文)、Statistics Addition(加统计)。
- 也有效(+15–30%):Fluency(流畅)、Easy-to-Understand(易懂)。
- 无效:Authoritative tone(权威语气)、Keyword Stuffing(关键词堆砌)。营销号常把“权威语气”说成头号策略,错。
- 关键:Princeton 测的是**内容**改写,不是 HTML/语义元素结构。结构效应来自另一篇非 Princeton 预印本(arXiv:2603.29979,+17.3%)。两篇都是 arXiv 预印本,未经同行评议。

## AI 代理怎么读页面

- 视觉/像素(不读 DOM、不读无障碍树):Anthropic computer-use、OpenAI Operator/CUA。
- 无障碍树/DOM(能从语义 HTML + ARIA 受益):Playwright MCP(官方,Microsoft)、browser-use。
- Google AI Overviews:query fan-out,走常规网页索引 + snippet 系统,非独立爬取。入选条件 = 已索引 + 有 snippet 资格。
- ChatGPT/Perplexity 抽取细节:**未公开**。Mozilla Readability(DOM 驱动)存在但无来源确认它们在用。“语义 HTML → 抽取更好 → 引用”是**推断,未证**。

## robots.txt AI 爬虫(背景,L1 不直接相关)

- 训练爬虫:GPTBot、ClaudeBot、CCBot、Google-Extended、Applebot-Extended。
- 检索/搜索:OAI-SearchBot、Claude-SearchBot、PerplexityBot。
- 用户触发(常忽略 robots):ChatGPT-User、Claude-User、Perplexity-User。
- 与 L2/L3 相关(站点是否允许被 AI 抓),与 L1 无关——列作背景。

## 结构化数据 / schema.org

- schema.org = 社区活动(W3C Schema.org CG),Google/Microsoft/Yahoo/Yandex 创立。编码:JSON-LD(W3C Rec)/ Microdata(WHATWG)/ RDFa(W3C Rec)。
- **Google 官方:AI Overviews “不需要任何特殊 schema.org”。“加 schema 给 AI”被 Google 否认。**
- `WebContent` 是新(July 2026)通用类型;`speakable` 小众/语音。无广泛采纳的 AI 专用 schema。

## ARIA 与无障碍树

- WAI-ARIA 1.2 = W3C Rec(2023-06)。定义 landmark 角色 + 无障碍树(§7)。
- 明定用途是辅助技术,不是 LLM。“AI 消费无障碍树”是推断,仅由 Playwright MCP/browser-use 确实在消费支撑。
- APG(Authoring Practices)是复合控件角色/键盘的既成契约,代理可据此识别控件。

## 审计一个组件库现状时要查什么(可移植)

- **组件规模与形状:** 组件数、命名约定、props/类型定义在哪(`types.ts`/`defineProps`/JSDoc 等)——审计时要读的对象。
- **组件内结构化数据:** 组件内有无 JSON-LD/schema.org(不该有,见「不要做」);`llms.txt`/`robots.txt`/组件目录/MCP 属 L2/L3 或 (c),不在 L1 渲染产物审计内。
- **ARIA 基线(全库普查):** 数 `role`/`aria-*` 出现次数;状态是镜像到 CSS class 还是 ARIA;复合控件是 `<div @click>` 还是语义元素;弹层有无 `role=dialog`/焦点 trap;有无 landmark。记录原生 seam(已用原生 `<button>`/`<input>`/`<table>`/`<form>` 的组件)——改造在其上加 ARIA,而非重写。

## 诚实张力:在 L1 内,b 压过 a

- (a) 经 L1 薄:无首源证明渲染语义 HTML 提升引用;Princeton 测内容非 HTML;ChatGPT/Perplexity 抽取未公开;Google 贬低 schema;且被消费方可抓取性 gate。
- (b) 经 L1 扎实:语义 HTML + ARIA 服务 a11y 树代理(Playwright MCP、browser-use)+ 屏幕阅读器,是库核心职责,L1 唯一机制清晰的杠杆。
- → L1 内:**b主a辅**(全局仍 a主b辅,这是默认推荐,非某库的既定决策)。
