---
name: opendesign-review
description: 组件库 PR 检视规范。当被要求检视 / review / 评审 openeuler/opendesign-components（含 fork、release 线）的 PR / MR / 分支变更或判断其可合入性、复核已有检视结论或他人 review、核查 MR 自述声明（提交数 / 用例数 / 两线源码一致性）、或讨论检视方法（双轴、实测裁决、探针、检视预算）时应用。凡以本仓组件库变更为检视对象，动手前必须查阅本 skill。
metadata:
  version: '1.0.0'
---

# 组件库 PR 检视规范

> **触发场景：** 检视 / review / 评审一个 PR 或 MR / 判断是否可合入 / 复核他人 review 结论 / 核对 MR 描述里的数字与声明 / spec 与实现冲突怎么判 / 像素级结论怎么实测 / 检视该按什么顺序做

> **边界：** 本 skill 管**检视的过程与报告质量**（怎么读、怎么测、结论怎么写），吸收了通用双轴 review 的骨架并补上本仓领域规则——本仓检视以本 skill 为准，不再走通用 `code-review` skill。平台操作（拉 PR 元数据、发评论、approve）走 `gitcode` CLI 或 `gitcode-pr-review` 等 skill：本 skill 第 5 步产出的报告即评论素材。

## 检视立场

缺陷先行：bug、回归、行为变化未披露、缺失测试、发版阻塞排在最前，纯风格意见靠后。每条结论必须携带证据（命令输出、实测数字、文件行号）与置信度来源——未实测的不得写成确认。

## 只读检视纪律（横切所有步骤）

- 主工作区**零破坏性 git 操作**：本仓 `post-checkout` hook 会执行安装并触发一个必失败的脚本，在主工作区 `git checkout <MR head>` 属破坏性操作。要在新版本上跑任何东西，用 `git worktree add <临时目录> <ref>`，或 `git show <ref>:<path> > <临时文件>`。
- 探针文件统一命名 `*.probe.test.ts`，置于临时路径或 worktree 内，不落进 `src/`。
- 收尾必做：删除全部探针、临时 ref 与 worktree，`git status` 确认主工作区复原。

## 工作流

顺序即检视预算，写死如下：**① 权威 spec → ② 全量阅读 + 依赖回溯 → ③ 兼容 checklist → ④ 探针实测 → ⑤ 机械检查**。机器能做的（⑤）永远垫底——把预算烧在 lint / 全量测试上而跳过 ①②，产出的是「检查全绿」的错觉，不是检视。

### 第 0 步：定基准与取证

```bash
git fetch <fork> <分支>:<本地引用>                 # MR head 落本地引用（fetch 不触发 hook）
git merge-base <base> <head>                       # 记录 merge-base，检视一律用三点 diff
git diff <merge-base>...<head> --stat              # 变更文件清单
gitcode pr view <id> -R openeuler/opendesign-components --comments --json
```

同时读 MR 既有评论——已有结论不必重新推导，未覆盖处才是本次检视的增量。

**版本线判定（breaking 裁决前提）：** 看本 MR 的 base 分支——`master`（主线，进入下一常规版本）还是 `release/1.2.x-spN`（补丁维护线）。记录进报告，第 2 步的 breaking 裁决要用。

**完成判据：** merge-base SHA、head SHA、变更文件清单、既有评论、base 版本线全部在手；head 已检出于 worktree（或显式声明本步仅做静态检视）。

### 第 1 步：读权威 spec

- 从 MR 描述的 `fixes #<N>` / 关联 issue 取**关联 issue 全文**读，验收标准逐条摘成清单——后续每条都要对照。需求只能来自 spec，不从 MR 描述和测试注释反推。
- 取不到 spec 时，报告**显式标注**「无权威 spec，仅按 MR 自述核对」，不得沉默略过。
- spec 自身也可能口径过期：发现 spec 与实现冲突，先摊开矛盾双方再判定哪边该改——不得默认实现是对的，也不得默认 spec 是对的。

**完成判据：** 每条验收标准都有出处（issue 编号 + 原文摘录），或已显式声明无 spec。

### 第 2 步：双轴并发

两轴各自独立上下文（有子智能体就并发跑；没有就分两遍跑，两遍之间不共享中间结论）：

| 轴               | 判据                        | 检视内容                                                              |
| ---------------- | --------------------------- | --------------------------------------------------------------------- |
| **Spec 轴**      | 关联 issue 的验收标准       | 逐条判定实现是否满足；标出 spec↔实现偏差，含 spec 自身需要勘误的口径 |
| **Standards 轴** | 仓库自建 skills（见映射表） | 全量阅读 + 依赖回溯 + 兼容 checklist + 测试合规                       |

**全量阅读（Standards 轴第一动作）：** 被修改文件整体读，不以 diff 片段了事；配套文件（`style/`、`var`、`media`、`types.ts`、`provide`、子组件）整体读；新代码消费的每个外部值（hook / directive / composable 返回值）**回溯到生产者**，检查响应式完备性——触发源是否覆盖所有变更来源（class 变化、prop 变化、断点、主题切换）。「运行时改 prop 后内部值仍是旧值」这类缺陷，漏报的第一原因就是只读 diff。

**兼容 checklist：** 变更触及公开面（props、导出、CSS 变量、DOM 结构、class 名）时，逐项过 [`references/compat-checklist.md`](references/compat-checklist.md)，并按其判定口径给出 **breaking 结论（无 / 疑似 / 确认）**：确认 breaking 且 base 为补丁线 → 合入阻塞；主线 → 必须有 `BREAKING CHANGES` 披露与相关 commit `!` 标记。疑似不等于确认——灰色地带列证据交裁决，不得自行放行。

**完成判据：** 两轴各自产出独立报告；兼容 checklist 每条有「已查 / 不适用」结论；breaking 结论为三档之一（疑似时证据链完整）；新代码消费的每个外部值都标注了生产者及其触发源覆盖情况。

### 第 3 步：探针实测可疑点

触发条件：结论涉及**几何 / 视觉 / 像素 / 滚动 / 布局**，或测试覆盖可疑。

**实测裁决**：读代码 + 算术只能提出假设，实测数字才能下结论。算出的数与注释 / 文档 / 验收标准矛盾时，默认其中一方是错的——去实测判定，**不得用「设计如此 / intended」解释掉矛盾**。数值原样记录进报告（如 `lastRight=518、ellipsisLeft=550 → 纯空白 24px`）。

探针写法、红绿反证、覆盖状态清单分析法见 [`references/probe-methods.md`](references/probe-methods.md)。

**完成判据：** 所有几何 / 视觉类结论的证据栏是实测数字（含探针命令），或明确标注「未实测」并降级置信度。

### 第 4 步：机械检查 + 自述核验

机械检查与 base 对比后才算数（本仓有既存报错，见「环境事实」）：

```bash
cd packages/opendesign
npx vitest run --config vitest.config.ts <组件测试目录> --browser.headless   # 不带 headless 需显示器
npx vue-tsc --build                          # 过滤到目标目录，与 base 输出比对
npx prettier --check <files>                 # printWidth 160；先确认 base 是否本来就不过
npx eslint --no-warn-ignored <dir>
```

**测试全绿不等于实现正确**：它只证明被断言的成立，不证明没被断言的成立。把测试当「已覆盖状态清单」读，主动列出**未被采样的状态**（滚动起 / 中 / 终点、运行时改 prop、断点往返、尺寸×溢出组合），逐条问「这条验收标准在哪个状态下被采样了」，缺口写进结论。

**自述声明逐条命令化核验**：MR 描述里的提交数、用例数、引用的 SHA、两线源码一致性声明，每条跑命令验证，报告给出「已核对 / 不成立」。

**完成判据：** 每项机械检查有「与 base 对比后新增 / 无新增 / 未跑（原因）」结论；每条自述声明有核对结论；未采样状态清单已列出。

### 第 5 步：聚合报告

两轴报告**并列呈现，不跨轴重排、不合并成单一「最严重项」**。格式：

```markdown
## 本次验证了什么 / 没验证什么

（开头即声明；没验证的维度列在这里，对照 references/review-gaps.md，不藏在结尾）

## Spec 轴（对照 issue #N）

- [偏差] spec 原文 → 实现现状 → 证据 → 置信度
- [spec 勘误] ...

## Standards 轴

- [缺陷] ...（每个缺陷附「为什么测试没拦住」——定位到具体采样缺口，作者才知道补哪条断言）
- [规范] ...

## 自述声明核对

| 声明 | 核对结果 |
```

每条结论标注置信度来源：**实测** / **读代码推断** / **未验证**。第一轮写「确认无误」「无阻塞级缺陷」随后被自己推翻，是置信度失标的直接后果——推断按推断写，不升格成确认。

**完成判据：** 报告含四段（验证声明 / 双轴 / 自述核对 / 检视空白声明）；每条结论有置信度；每个确认缺陷有证据与「为什么测试没拦住」。

## 判据源映射（Standards 轴）

| 变更类型                                     | 判据 skill                                           |
| -------------------------------------------- | ---------------------------------------------------- |
| 提交信息、AI 声明、PR 模板、线性交付         | [`commit-convention`](../commit-convention/SKILL.md) |
| 测试文件结构、断言方式、固定等待、双主题     | [`component-testing`](../component-testing/SKILL.md) |
| types.ts 注释、`@since`、demo / case、文档页 | [`component-docs`](../component-docs/SKILL.md)       |
| 复杂度、嵌套、参数数量、异步延续资源清理     | [`clean-code`](../clean-code/SKILL.md)               |
| ReleaseNote 视角与分区                       | [`release-note`](../release-note/SKILL.md)           |
| 全局资源改动的同步要求                       | [`global-utilities`](../global-utilities/SKILL.md)   |

## 环境事实（防机械检查误报）

| 事实                                                  | 影响                                                                          |
| ----------------------------------------------------- | ----------------------------------------------------------------------------- |
| `vue-tsc` 全仓既存报错                                | 必须过滤到目标目录并与 base 对比，否则误报                                    |
| `prettier.config.ts` 为 `printWidth: 160`             | 报「格式不符」前先确认 base 是否本来就不过                                    |
| 匿名 REST `curl` 共享 `p_repoRobot` 配额              | 几次后返回 429；用已登录的 `gitcode api` 子命令代替                           |
| 版本号 bump 走独立 `release @opensig/opendesign` 提交 | ReleaseNote 有 `## 1.2.7-sp3` 而 `package.json` 仍是 sp2 属**正常**，不是缺陷 |

## 参考文档索引

| 文件                                                               | 用途                                                                                                                            |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| [`references/probe-methods.md`](references/probe-methods.md)       | 探针写法与清理、实测裁决反例、红绿反证、覆盖状态清单、对照实验规则                                                              |
| [`references/compat-checklist.md`](references/compat-checklist.md) | 兼容 checklist（向后 + 向前）：导出面 / props / 内部消费方 / CSS 变量语义 / DOM 契约 / SSR / 双线移植 / 版本披露 / 跨线消费降级 |
| [`references/review-gaps.md`](references/review-gaps.md)           | 检视空白清单：弹层与 transform / 浏览器兼容 / CI 稳定性 / 可访问性 / 多主题 / 提交可移植性                                      |
