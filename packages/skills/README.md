# 项目开发 Skills 使用指南

本目录存放项目开发专属 skill，随代码一起提交。每个 skill 由一个 `SKILL.md` 文件定义，AI agent 会在对话中检测到匹配话题时**自动加载**并遵循其规范——你不需要手动"运行"它们，只需在对应阶段与 AI agent 正常交流即可。

## 开发阶段 → Skill 映射

| 开发阶段            | Skill                                             | 典型场景                                                             | 可以给 AI agent 的提示语                                                                         |
| ------------------- | ------------------------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **组件开发**        | [`component-docs`](component-docs/SKILL.md)       | 新建组件、写 `types.ts` 注释、写 demo/case、写文档页、运行 `gen:api` | "帮我给 Button 的 props 加 JSDoc 注释"、"帮我写一个 disabled case"、"运行 gen:api 更新 API 文档" |
| **日常编码 / 重构** | [`clean-code`](clean-code/SKILL.md)               | 写新 composable、重构复杂函数、消除嵌套、精简参数                    | "帮我重构这个 composable，降低复杂度"、"这个函数参数太多了，帮我优化"、"帮我用卫语句消除嵌套"    |
| **测试用例**        | [`component-testing`](component-testing/SKILL.md) | 写组件测试用例、调试测试失败、补响应式/SSR/视觉断言、理解测试约定    | "帮我给 Button 写测试用例"、"帮我补 SSR 测试"、"这个 responsive 测试失败了帮我看看"              |
| **版本发布**        | [`release-note`](release-note/SKILL.md)           | 写版本日志、整理变更归类、更新 ReleaseNote 文件                      | "帮我从 v1.2.3 到 v1.2.4 生成 release note"、"帮我整理这批 commit 的变更归类"                    |
| **资源发现**        | [`global-utilities`](global-utilities/SKILL.md)   | 查找全局 CSS 类、SCSS mixin、TS 工具函数、composable、内部组件       | "有没有全局的 sr-only？"、"防抖函数在哪？"、"InBox 怎么用？"、"有哪些全局工具类"                 |

## 各 Skill 速览

### component-docs

组件文档与注释规范指南。核心原则：

- `types.ts` / `defineEmits` / `defineExpose` 是 API 的单一真实来源
- `*-api.*.md` 文件由 `pnpm gen:api` 自动生成，**禁止手动编辑**
- `index.zh-CN.md` 和 `index.en-US.md` 需手动维护且保持同步
- 开发阶段用 `@since NEXT` 占位，发版时批量替换为实际版本号

参考文档索引：

| 文件                                                         | 用途                                                                                                                                                              |
| ------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`annotations.md`](component-docs/references/annotations.md) | `types.ts` / `defineEmits` / `defineExpose` 的 JSDoc 注释规范                                                                                                     |
| [`cases.md`](component-docs/references/cases.md)             | Demo / case 编写规范：Usage playground（`_oSchema`/`_oTemplate`/`_oCtx`）、普通 case、输入类组件 case、SSR 安全、命名约定、导入规范、主题可见性、实验性/废弃 case |
| [`doc-pages.md`](component-docs/references/doc-pages.md)     | `index.zh-CN.md` / `index.en-US.md` 文档页面编写规范                                                                                                              |
| [`pipeline.md`](component-docs/references/pipeline.md)       | `gen:api` 流程内部机制                                                                                                                                            |

自动触发关键词：`types.ts` 注释、JSDoc、`defineEmits` / `defineExpose`、`@since` / `@deprecated` / `@experimental`、demo / case / `__case__`、Usage playground、`gen:api`、CSS 变量表、废弃警告

---

### clean-code

代码质量诊断与重构指南。核心工作流：

1. 运行 ESLint 诊断：`pnpm exec eslint --config packages/skills/clean-code/eslint.diagnose.ts <文件>`
2. 将触发的规则映射到对应参考文档
3. 按参考文档中的模式重构代码
4. 重新运行 ESLint 确认问题已修复

> **关联 skill：** 涉及组件 `types.ts` JSDoc 注释质量（中文注释完整性）时，参见 [`component-docs`](#component-docs) skill。clean-code 侧重代码结构质量，component-docs 侧重 API 文档注释规范。

参考文档索引：

| 文件                                                                     | 对应 ESLint 规则                | 用途                                                       |
| ------------------------------------------------------------------------ | ------------------------------- | ---------------------------------------------------------- |
| [`config-object.md`](clean-code/references/config-object.md)             | `max-params` (>3)               | 函数参数过多时，用配置对象替代                             |
| [`guard-clause.md`](clean-code/references/guard-clause.md)               | `max-depth` (>5)                | 用卫语句消除深层嵌套                                       |
| [`reduce-complexity.md`](clean-code/references/reduce-complexity.md)     | `cumulative-complexity` (>8)    | 10 种降低认知复杂度的技术                                  |
| [`split-composable.md`](clean-code/references/split-composable.md)       | `max-lines-per-function` (>100) | 拆分过长的 composable                                      |
| [`async-scope-cleanup.md`](clean-code/references/async-scope-cleanup.md) | 无（人工判断）                  | 异步延续中 VueUse composable 的 tryOnScopeDispose 失效预防 |

自动触发关键词：clean code、重构、降低复杂度、消除嵌套、参数过多、函数过长、圈复杂度、认知复杂度、卫语句、配置对象、状态机、查表、tryOnScopeDispose、Promise.then 内存泄漏

---

### component-testing

组件库测试用例编写指南。核心原则：

- 测试 co-located：每个组件 `src/<comp>/__tests__/` 下放 3 个固定文件（index / responsive / ssr）
- 测试用例按 `types.ts` prop 组织，而非"想到什么测什么"
- 视觉断言用 **CSS 变量 wiring**（不硬编码 RGB）
- 所有颜色/状态 token 断言必须在 light + dark 两个主题下双跑

参考文档索引：

| 文件                                                                              | 用途                                                         |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [`three-file-structure.md`](component-testing/references/three-file-structure.md) | 三个文件职责边界 + 骨架代码 + 决策表                         |
| [`visual-contract.md`](component-testing/references/visual-contract.md)           | 视觉断言策略 + 双主题 + variant 承载属性                     |
| [`pitfalls.md`](component-testing/references/pitfalls.md)                         | 踩坑速查（完整版，含排查顺序 L0~L3）                         |
| [`resource-cleanup.md`](component-testing/references/resource-cleanup.md)         | 资源清理测试（内存泄漏检测）：spy / mock 检测原理 + 骨架代码 |

自动触发关键词：测试用例、vitest、browser mode、responsive test、SSR test、hydration、token wiring、视觉断言、双主题、describe 分组、test.fails、内存泄漏、资源清理、useEventListener 泄漏

---

### release-note

Release Note 生成指南。6 步工作流：

1. 确认 `last_tag` 和 `new_version`（必须先与用户确认）
2. 获取 commit 列表：`git log <last_tag>..HEAD --format="%h %s" --no-merges`
3. 逐条检查实际变更，归入对应分区
4. 规范化 scope 名称（组件加 `O` 前缀）
5. 按模块聚合，评估净变化
6. 格式化输出，插入 ReleaseNote 文件头部

变更分区：`BREAKING CHANGES` / `Features` / `Bug Fixes` / `Style` / `Code Refactoring` / `Chore`

输出文件：`packages/docs/ReleaseNote.opendesign.md`（组件库）、`packages/docs/ReleaseNote.scripts.md`（CLI）

参考文档索引：

| 文件                                                                       | 用途                                       |
| -------------------------------------------------------------------------- | ------------------------------------------ |
| [`classification.md`](release-note/references/classification.md)           | 提交分区归属判断 + Style 分区边界          |
| [`scope-format.md`](release-note/references/scope-format.md)               | scope → 条目名称规范化                     |
| [`version-placeholder.md`](release-note/references/version-placeholder.md) | 版本占位符替换（@since NEXT → 实际版本号） |

自动触发关键词：release note、版本日志、changelog、版本变更、版本号确认、feat / fix / breaking change / style 变更归类、sp 版本、scripts 包发布

---

### global-utilities

组件库全局资源发现与复用指南。核心原则：编写新代码前，先确认是否已有全局资源可复用，禁止重复实现同类逻辑。

涵盖范围：

- **全局 CSS 工具类**：`.o-sr-only`、`.o-hide-scrollbar`、`.o-txt-*`、`.o-svg-icon`、`.o-rotating`、动画过渡类
- **全局 SCSS Mixin**：`@include hover`、`@include respond()`、`@include x-svg-hover`
- **全局 TS 工具函数**：`debounce`、`throttleRAF`、`getRoundClass`、`createTopZIndex`、类型判断、DOM 工具、VNode/Slot 工具
- **全局 Composable**：`useFormField`、`useRenderWithCtx`、`useSlotFirstElement`
- **内部共享组件**：`InBox`、`InInput`、`InTextarea`、`ClientOnly`、`OPopup`、`OPopover`

参考文档索引：

| 文件                                                             | 用途                                         |
| ---------------------------------------------------------------- | -------------------------------------------- |
| [`css-classes.md`](global-utilities/references/css-classes.md)   | 全局 CSS 工具类 + SCSS Mixin 速查            |
| [`ts-utilities.md`](global-utilities/references/ts-utilities.md) | 全局 TS 工具函数 + Composable + 内部组件速查 |

自动触发关键词：sr-only / o-sr-only、hide-scrollbar、svg-icon、rotating、fade-in、zoom-fade、respond mixin、hover mixin、getRoundClass、createTopZIndex、debounce、throttleRAF、isString、isEmptySlot、useFormField、useRenderWithCtx、InBox、InInput、ClientOnly、OPopup、OPopover、全局类、全局方法、有哪些全局

> **维护约束：** 当 `_styles/`、`_utils/`、`_composables/`、`_hooks/` 或 `_components/` 目录下的全局资源发生新增、重命名、废弃等变更时，必须同步更新此 skill 的 `SKILL.md` 快速索引表和对应 reference 文档。详见 [SKILL.md → 维护规则](global-utilities/SKILL.md#维护规则强制)。

## Skill 触发机制

每个 skill 的 `SKILL.md` 文件头部的 `description` 字段定义了触发条件。AI agent 在对话中检测到匹配话题时自动加载对应 skill 的完整内容并遵循其规范。你也可以在对话中主动提及相关关键词，确保 skill 被触发。
