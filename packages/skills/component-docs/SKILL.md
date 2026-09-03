---
name: component-docs
description: 组件文档与注释规范指南。涉及 types.ts JSDoc 注释、@since/@deprecated/@experimental 标签、行内标签语法 ^[]()``、@en-US 翻译补译、运行时废弃警告、provide/inject 注入键导出评估、__case__ Demo 编写、Usage playground、<docs lang="md"> 中英分区、文档页面编写、CSS 变量表维护、gen:api 流程时触发。只要在写组件注释、添加新 prop、写 demo case、编辑 index.md 文档、使用行内标签、运行 gen:api，都应主动使用此 skill。
metadata:
  version: '1.0.0'
---

# 组件文档与注释规范指南

> **上下文：** 本项目是 `@opensig/opendesign` Vue 3 组件库。文档体系分为三层——注释标注（源码侧）、Demo case（交互侧）、文档页面（展示侧），三者通过 `pnpm gen:api` 管线联动。

> **详细规范按话题分放在 references 目录下：**
>
> - **注释标注**（JSDoc tag、运行时警告、注入键导出评估）→ [`references/annotations.md`](references/annotations.md)
> - **Demo case 编写**（Usage playground、普通 case、命名约定、主题可见性）→ [`references/cases.md`](references/cases.md)
> - **文档页面编写**（行内标签版本标注、警告块、CSS 变量表、gen:api 流程）→ [`references/doc-pages.md`](references/doc-pages.md)
> - **管线运行逻辑**（Vite 插件提取/渲染、文件依赖关系）→ [`references/pipeline.md`](references/pipeline.md)

---

## 快速索引

| 你在做什么                                            | 看哪个 reference           |
| ----------------------------------------------------- | -------------------------- |
| 写 types.ts 注释、加 @since/@deprecated/@experimental | annotations.md             |
| 新增整个组件（since 在 sidebar 声明，不逐项标注）     | doc-pages.md               |
| 写 defineEmits / defineExpose 注释                    | annotations.md             |
| 补 @en-US 翻译                                        | annotations.md             |
| 加运行时废弃警告（log.warn）                          | annotations.md             |
| 评估 provide/inject 注入键是否应导出                  | annotations.md             |
| 开发新功能，决定写什么 case                           | cases.md                   |
| 写 Usage 交互 playground                              | cases.md                   |
| 写普通 Demo case 文件                                 | cases.md                   |
| 输入类组件 case（OForm + #extra 展示 modelValue）     | cases.md                   |
| 高级 Usage（联动 \_oCtx、条件属性、lang="tsx"）       | cases.md                   |
| case 中的 SSR 安全写法                                | cases.md                   |
| case 中 import opendesign 组件/图标/类型              | cases.md                   |
| case 中变量声明使用包导出类型                         | cases.md                   |
| 处理实验性/废弃功能的 case                            | cases.md                   |
| 编辑 index.zh-CN.md / index.en-US.md                  | doc-pages.md               |
| 加行内标签版本标注、废弃 WARNING block                | doc-pages.md               |
| 在 markdown 中使用行内标签 ^[]()``                    | doc-pages.md               |
| 维护 CSS 变量表                                       | doc-pages.md               |
| 写 provide/inject "## 注入"章节                       | doc-pages.md               |
| 运行 gen:api、理解自动生成规则                        | doc-pages.md / pipeline.md |

---

## @since 版本号的两阶段策略

开发阶段写 `@since NEXT` 占位，发布阶段批量替换为实际版本号。

- **注释侧**（已有组件新增 API 逐项标注 `@since NEXT`）→ [`references/annotations.md`](references/annotations.md)
- **文档侧**（新增组件在 sidebar 字段声明 `^[NEXT](primary)`）→ [`references/doc-pages.md`](references/doc-pages.md)

---

## 核心原则

1. **types.ts / defineEmits / defineExpose 是唯一真相来源**——`pnpm gen:api` 从中提取，自动生成 `*-api.*.md` 表格，**禁止手动编辑这些自动生成文件**
2. **index.zh-CN.md 和 index.en-US.md 手动维护**——每次修改必须同步更新中英文两份
3. **每次新增、修改、废弃任何 API 后必须运行 `pnpm gen:api`**——Vite 开发服务器不会自动重新生成

---

## 场景索引

| 场景                               | 涉及的 reference                                                                                   |
| ---------------------------------- | -------------------------------------------------------------------------------------------------- |
| 新增 prop/event/slot（已有组件上） | annotations.md → cases.md → doc-pages.md → `pnpm gen:api`                                          |
| 新增整个组件                       | annotations.md → doc-pages.md（sidebar `^[NEXT](primary)`）→ cases.md → `pnpm gen:api`             |
| 废弃 prop/event/slot               | annotations.md（@deprecated + log.warn）→ doc-pages.md（WARNING block）→ `pnpm gen:api`            |
| 新增实验性组件/功能                | annotations.md（@experimental）→ cases.md（单独 case）→ doc-pages.md（blockquote）→ `pnpm gen:api` |
| 废弃整个组件                       | annotations.md（全部 @deprecated）→ doc-pages.md（废弃预告）→ `pnpm gen:api`                       |
| 发布前批量替换版本号               | 配合 release-note skill → annotations.md + doc-pages.md → `pnpm gen:api`                           |

每个场景的详细步骤见对应 reference 的「工作流」章节。

---

## 检查清单总览

- [ ] 注释侧：JSDoc 注释完整、@since/@deprecated/@experimental 正确标注 → [`annotations.md`](references/annotations.md)「检查清单」
- [ ] Demo 侧：case 格式正确、SSR 安全、导入规范 → [`cases.md`](references/cases.md)「质量检查点」
- [ ] 文档侧：行内标签版本标注、WARNING block、CSS 变量表、注入章节 → [`doc-pages.md`](references/doc-pages.md)「检查清单」
- [ ] 运行了 `pnpm gen:api`，自动生成文件已更新
