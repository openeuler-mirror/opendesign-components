# Issue tracker：up 平台 issue（spec）+ 本地 `.scratch/`（ticket）

spec 的载体是 AtomGit 上游（`up` = `openeuler/opendesign-components`）的 issue；执行态 ticket 是本地 `.scratch/` 下的 markdown 文件，**整个目录被 git 忽略**。平台管意图与共享，本地管执行，二者不混。

## Spec：始终在 up 上管理

按需求来源分流，规则由 issue 编辑权决定：

- **原 issue 是自己开的**：原地升级——直接修改原 issue 的 title 与正文为 spec（验收标准、悬而未决区块等），正文可保留「原始需求」章节以留存最初的表述。讨论与假设确认走评论区：**正文承载规格，评论承载过程**。
- **原 issue 是别人开的**：在 up 上新建一个 issue 作为 spec（标题加 `【SPEC】` 前缀，正文顶部写 `Upstream: <原 issue URL>`），然后在原 issue 下留一条评论，指引到新 spec issue。禁止把 spec 塞进别人 issue 的评论区——评论区是 append-only 的讨论流，无法作为可编辑的权威文档。
- **本地发起的任务**：同样在 up 建 issue 作 spec（标题加 `【SPEC】` 前缀），作为公开的工作记录。

spec issue 的标题格式：`【SPEC】<主题>`（如 `【SPEC】多行输入控件的 pill 圆角语义调整`）。前缀用于在 issue 列表页快速区分 spec 与普通 issue——up 无 label 权限，标题前缀是唯一可用的类型标记。原地升级自己开的 issue 时同样补加该前缀。标题只写主题，不携带版本号、目标分支等元数据——目标版本与分支可能随时间增加或变更（多版本交付），此类信息由正文 `Since:` 行承载，正文的可编辑性允许追加多版本，避免标题漂移或被迫另开 issue。

平台操作一律走 `gitcode` CLI（`gitcode-issue` / `gitcode-pr` 等 skill）。

## Triage 状态：正文 `Status:` 行

本仓库在 up 上**没有创建 label 的权限**，triage 角色以 issue 正文中的 `Status:` 行表达（角色字符串见 `triage-labels.md`），本地 ticket 同样使用 `Status:` 行，两处词汇表一致。

## Ticket：本地 `.scratch/`

- 一个 feature 一个目录：`.scratch/<feature-slug>/`
- 一文件一个 ticket：`issues/<NN>-<slug>.md`，从 `01` 起编号，禁止合并为单个文件
- 每个 ticket 自包含：正文包含开工所需的全部上下文与 `Spec: <up spec issue URL>` 行；依赖以 `Blocked by: NN, NN` 声明
- `Status:` 行记录 triage 状态；评论与讨论历史追加到文件底部 `## Comments` 标题下
- **git 忽略**：`.scratch/` 整目录在 `.gitignore` 中（ticket 是执行态，任务完成即废，无长期价值；跨机器续做需重建）。commit body 引用 spec issue URL 而非本地 ticket 路径，保证引用长期有效。

## 当 skill 说「发布到 issue tracker」时

- 发布 **spec** → 按上文分流规则在 up 上创建或升级 issue；
- 发布 **ticket** → 在 `.scratch/<feature-slug>/issues/` 下创建新文件。

## 当 skill 说「取回相关 ticket」时

读取所指路径的文件。用户通常会直接给出路径或编号。

## Wayfinder 操作

供 `/wayfinder` 使用。**map** 是一个文件，每个 ticket 对应一个子文件。

- **Map**：`.scratch/<effort>/map.md`（Notes / Decisions-so-far / Fog 正文）
- **子 ticket**：`.scratch/<effort>/issues/NN-<slug>.md`，从 `01` 起编号，正文为待决问题。`Type:` 行记录 ticket 类型（`research`/`prototype`/`grilling`/`task`）；`Status:` 行记录 `claimed`/`resolved`
- **Blocking**：文件顶部附近的 `Blocked by: NN, NN` 行。所列文件全部 `resolved` 后该 ticket 解锁
- **Frontier**：扫描 `.scratch/<effort>/issues/` 中处于打开、未阻塞、未认领状态的文件，编号最小者优先
- **认领（claim）**：动手前先置 `Status: claimed` 并保存
- **解决（resolve）**：在 `## Answer` 标题下追加答案，置 `Status: resolved`，然后把上下文指针（要点 + 链接）追加到 map 的 Decisions-so-far 中
