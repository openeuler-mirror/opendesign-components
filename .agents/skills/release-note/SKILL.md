---
name: release-note
description: Release Note 生成指南。当被要求写 release note、生成版本日志、更新 changelog、总结版本变更、确认版本号、归类 feat/fix/breaking change/style 变更、处理 sp 版本、发布 scripts 包版本日志时应用。
metadata:
  version: '1.2.0'
---

# Release Note 生成指南

> **触发场景：** 写 release note / 生成版本日志 / 更新 changelog / 归类版本变更 / 确认版本号 / sp 版本 / scripts 包发布 / 整理 feat/fix/breaking change

> **上下文：** 本项目是一个 Vue 3 组件库。release note 的读者是**组件库使用者**（调用方），而非仓库内部开发者。判断变更是否值得写入 release note、以及归入哪个分区，始终以「对组件库使用者是否可见/有影响」为第一标准。

> **详细规范按话题分放在 references 目录下：**
>
> - **提交分区判断**（分区归属、Style 边界）→ [`references/classification.md`](references/classification.md)
> - **Scope 规范化**（组件名称、hooks 命名）→ [`references/scope-format.md`](references/scope-format.md)
> - **版本占位符替换**（@since NEXT → 实际版本号）→ [`references/version-placeholder.md`](references/version-placeholder.md)

---

## 第零步：与用户确认版本信息（必须最先执行）

在做任何分析之前，先询问用户：

1. **对比基准版本**：从哪个 tag 开始统计提交？
2. **要发布的新版本号**：release note 的标题 `## <version>` 应该写什么？

可以先运行以下命令让用户参考：

```bash
git tag --sort=-version:refname | head -10
```

- `@opensig/opendesign` 的 tag 格式：`1.2.3`、`1.2.3-sp1`、`1.2.3-sp2`
- `@opensig/open-scripts` 的 tag 格式：`scripts-1.0.6`

**不得假设版本号，必须得到用户明确确认后再继续。**

---

## 第一步：记录当前分支并获取提交列表

用户确认 `<last_tag>` 和 `<new_version>` 后，先记录当前签出的分支：

```bash
git branch --show-current
```

**release note 基于当前签出的分支统计**，`git log <last_tag>..HEAD` 只统计当前分支可达的提交。记录该分支名，在输出 release note 草稿时告知用户。

获取范围内的原始提交：

```bash
git log <last_tag>..HEAD --format="%h %s" --no-merges
```

`--no-merges` 过滤 merge commit（在本项目中格式为 `!123 type(scope): desc`），只保留原始 commit，避免重复计入。

---

## 第二步～第四步

逐条判断提交的分区归属 → Style 分区边界 → scope 名称规范化，详见：

- [`references/classification.md`](references/classification.md)（分区归属判断 + Style 边界）
- [`references/scope-format.md`](references/scope-format.md)（scope → 条目名称规范化）

---

## 第五步：按模块聚合，评估净变化

**以用户视角看净变化，而不是逐条枚举 commit。**

将同一组件/模块的所有提交归为一组后，先整体评估这个模块在两个版本之间的**净状态差异**，再决定怎么写：

**规则一：新建模块，后续修改对用户无感**

若某组件在这个版本区间内从无到有（第一个 commit 是新建），则后续对它的所有 fix/refactor 对用户来说都是"建设过程"，不应拆分列出。整个模块只算一条 `### Features` 条目，描述最终功能，不提中间的修复过程。

```markdown
# 正确：一条新增，描述最终能力

- **ODatePicker:** 新增日期时间系列选择器

# 错误：把建设期的 fix 也列出

- **ODatePicker:** 新增日期时间系列选择器
- **ODatePicker:** 修复检视问题（← 对用户无意义，删除）
```

**规则二：已有模块的多次变更，看净效果**

若多次提交修改了同一已有组件，先判断这些变更对用户的净效果：

- 若后续提交**撤销或覆盖**了前面的变更（如先改了某默认值，又改回去），净效果为零，**整组跳过**
- 若多次提交方向一致（都是 fix、都是新增），合并为一个条目，子项描述各自的独立修复点
- 若多次提交跨分区（如既有 fix 又有 feature），则分别归入对应分区，但都只取净效果描述

**聚合后的格式：**

同一组件净变化有多个独立点时，用嵌套列表：

```markdown
- **OTab:**
  - 修复溢出计算逻辑及移动端水合报错
  - 修复lazy模式下的显示问题
```

只有一个独立点时，写成单行：

```markdown
- **OTab:** 修复溢出计算逻辑及移动端水合报错
```

---

## 第六步：格式化输出

生成的版本块插入到对应 release note 文件**头部**：

- `@opensig/opendesign` → `packages/docs/ReleaseNote.opendesign.md`
- `@opensig/open-scripts` → `packages/docs/ReleaseNote.scripts.md`

**格式模板：**

```markdown
## <new_version>

### BREAKING CHANGES

- **OComponentName:** 描述破坏性变更及迁移方式

### Features

- **OComponentName:** 新增功能描述
- **hooks:**
  - 新增 `useXxx`：功能说明

### Bug Fixes

- **OComponentName:** 修复描述（如有 issue 链接：[#IDXXXX](https://atomgit.com/openeuler/opendesign-components/issues/IDXXXX)）

### Style

- **OComponentName:** 样式调整描述

### Code Refactoring

- **OComponentName:** 重构描述

### Chore

- 描述构建、依赖等变更
```

**格式规则：**

1. 没有变更的分区**整体省略**，不写空的 `### Features` 等标题
2. `### BREAKING CHANGES` 若存在，始终放在最前
3. 分区顺序：`BREAKING CHANGES` → `Features` → `Bug Fixes` → `Style` → `Code Refactoring` → `Chore` → `Others`
4. 版本号与用户确认的 `<new_version>` 一致，格式 `## <new_version>`
5. Issue 链接格式：`[#IDXXXX](https://atomgit.com/openeuler/opendesign-components/issues/IDXXXX)`

---

## 完整工作流

```
0. 询问用户：对比的 last_tag 和新版本号 new_version
                                  ← 必须得到明确答复才能继续
1. git branch --show-current      ← 记录当前分支名，后续告知用户
2. git log <last_tag>..HEAD --format="%h %s" --no-merges
                                  ← 获取全部原始提交
3. 对每条提交: git show <hash> --stat
                                  ← 结合实际文件变更判断分区（→ classification.md）
4. 遇到模糊提交，向用户说明变更内容，请用户定夺归属
5. 规范化组件名（→ scope-format.md），同组件多条提交聚合
6. 按模板格式化，插入 release note 文件头部
7. 向用户展示草稿，并注明「以上内容基于分支 <branch>」
8. 批量替换版本占位符（→ version-placeholder.md）
9. pnpm gen:api → 最终确认自动生成文件
```

---

## 常见特殊情况

### patch 版本（sp）

`sp` 版本一般只包含 bug fix，`### Features` 等通常省略。版本号如 `1.2.3-sp1`。

### 废弃版本

若某版本有已知严重问题，在版本块中加入：

```markdown
### Warning

本版本存在 [已知问题描述]，建议升级到 vX.X.X
```

### scripts 包

`open-scripts` 的 release note 格式相同，tag 前缀为 `scripts-`，release note 文件为 `ReleaseNote.scripts.md`。

---

## 检查清单

- [ ] 已与用户确认 `last_tag` 和 `new_version`（不得自行假设）
- [ ] 已记录当前分支名，并在草稿中注明
- [ ] 每条提交已查看实际文件变更（`git show <hash> --stat`），而非仅凭 commit 消息判断分区
- [ ] 分区归属判断遵循「对使用者是否可见/有影响」原则（→ [`classification.md`](references/classification.md))
- [ ] 模糊归属的提交已向用户说明并请用户定夺
- [ ] scope 名称已按规范加 `O` 前缀或保持原名（→ [`scope-format.md`](references/scope-format.md))
- [ ] 同一组件的多条提交已聚合为净变化描述
- [ ] 新建组件只算一条 Features 条目，建设期 fix 不拆分列出
- [ ] 格式模板分区顺序正确（BREAKING → Features → Bug Fixes → Style → Refactoring → Chore）
- [ ] 没有变更的分区整体省略，无空标题
- [ ] 版本占位符已批量替换（`@since NEXT` → 实际版本号、`^[NEXT](primary)` → 实际版本号）（→ [`version-placeholder.md`](references/version-placeholder.md))
- [ ] 替换完成后运行了 `pnpm gen:api` 并检查 git diff
