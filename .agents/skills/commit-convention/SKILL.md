---
name: commit-convention
description: 提交信息与 PR 交付规范。当被要求写提交信息 / commit message、改写或合并提交（squash / fixup / cherry-pick）、创建或更新 PR、向上游（up）交付、填写 Co-Authored-By trailer、填写 AI 参与声明（Agent 平台 / 模型 / Prompt 上下文）、遇到 ai-assisted / ai-compliance-failed / ai-co-authored 标签时应用。凡涉及 git 提交信息的产出，以及以 openeuler/opendesign-components 为目标的 PR，动手前必须查阅本 skill。
metadata:
  version: '1.0.0'
---

# 提交信息与 PR 交付规范

本仓提交信息格式、AI 使用声明，以及向上游（`up` = openeuler/opendesign-components）交付 PR 的规范。AI 声明部分依据 openEuler 社区[《生成式AI工具使用与开源贡献政策》](https://www.openeuler.org/zh/community/ai-coding-assistants/)——上游门禁强制校验 PR 与 commit 的 AI 披露一致性，缺失或不一致会被拦截。

## 提交信息格式

格式：`<type>(<scope>): <gitmoji> <中文摘要>`

- `<type>`：取 Conventional Commits（feat / fix / docs / style / refactor / perf / test / chore / build / ci），破坏性变更加 `!`，如 `refactor(popup)!: ♻️ …`
- `<scope>`：组件名带 `O` 前缀（`OStep`、`OInput`），或模块 / 包名（`popup`、`docs`、`scripts`）
- `<gitmoji>`：Unicode 字符本体，常用对照见文末
- `<中文摘要>`：动词开头、说清做了什么、不超过 50 字符，可带 issue 号

正文（可选）用中文展开根因与改动点，尾行写 `fixes #<issue号>` 关联 issue。

**AI 参与的提交**在正文之后空一行追加 trailer（模型名必须与 PR 披露一致）：

```text
Co-Authored-By: <AI 模型名及版本>
```

完整示例：

```text
fix(OFigure): 🐛 新增 tag 属性支持自定义根渲染标签，修复 Markdown 场景 hydration mismatch (#172)

OFigure 根元素 tag 硬编码为 href ? 'a' : 'div'，在 Markdown 渲染场景
图片被 <p> 包裹时因嵌套违规触发 hydration mismatch。

- types.ts 新增 tag prop（String，默认 'div'），与 OButton 同构
- OFigure.vue 根元素 tag 改为 href 优先、否则取 props.tag
- 新增静态契约 / SSR 字符串渲染 / SSR 水合三类回归用例

fixes #172

Co-Authored-By: Claude Sonnet 4.6
```

合并 / 改写提交（squash、rebase、cherry-pick）时保留原提交的 `Co-Authored-By` trailer，避免门禁在合并提交上失配。

## 上游 PR 模板

向 `up` 创建 PR 时，描述必须沿用以下骨架（该模板为上游平台级配置，仓库内无对应文件；使用 `gitcode-pr-create` 等 skill 创建 PR 时，以本模板为准而非其通用模板）：

```markdown
<!-- 感谢您的合入申请! -->

### 当前PR是否有AI参与:

[x] 是

[ ] 否

1. AI Agent 平台: <平台名及版本，如 opencode 1.0.233>
2. AI 模型: <模型名及版本，须与 commit 的 Co-Authored-By 完全一致>
3. Prompt上下文: <一句话核心意图，如“按 issue #172 的定位实现 OFigure 的 tag prop，并按组件库规范补充回归用例”>

参考：openEuler社区[《生成式AI工具使用与开源贡献政策》](https://www.openeuler.org/zh/community/ai-coding-assistants/)

### PR功能描述 / 为什么需要这个合入:

<根因 / 改动点 / 影响面>

### 该PR关联的issue

_(格式为fixes #<issue号>, 或者resolves #<issue号>)_: fixes #<issue号>

### 希望检视人员了解:

<复核重点、验证证据、默认行为是否变化>
```

填写要点：

- **如实勾选**是否有 AI 参与；勾「是」时三项必填，平台写实际使用的 Agent 平台及版本，模型写实际模型名及版本
- **Prompt上下文**写核心意图而非完整提示词，不得留空或语义不明
- 未参与 AI 的提交，声明段勾「否」即可，commit 不加 `Co-Authored-By` trailer

## 门禁校验（实测行为）

- commit 含 `Co-Authored-By` → PR 被打 `ai-co-authored` 标签；检测到 AI 生成代码 → `ai-includes-code`
- PR 声明 AI 参与但 commit 缺 `Co-Authored-By` trailer，或 PR 披露模型与 trailer 不一致 → `ai-compliance-failed`，PR 被门禁拦截
- CLA 状态由平台在 PR 上标记（`openeuler-cla/yes` / `openeuler-cla/no`），首次提 PR 需在网页端签署

## 政策要点

openEuler 社区[《生成式AI工具使用与开源贡献政策》](https://www.openeuler.org/zh/community/ai-coding-assistants/)：开发者对提交内容的正确性、安全性、合规性承担最终责任，不能以「内容由 AI 生成」免责；AI 参与的贡献须完整披露 Agent 平台、模型与 Prompt 摘要，保证审查可追溯。

## gitmoji 常用对照

| gitmoji | type               |
| ------- | ------------------ |
| ✨      | feat               |
| 🐛      | fix                |
| ♻️      | refactor           |
| 📝      | docs               |
| ✅      | test               |
| 🎨      | style              |
| ⚡️     | perf               |
| 🔧      | chore / build / ci |

完整语义以 [gitmoji.dev](https://gitmoji.dev) 为准。
