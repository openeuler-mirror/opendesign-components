# 组件文档页面编写规范

> **关联参考：** 文档页面是文档体系的上层。注释标注（JSDoc tag、运行时警告）见 [`annotations.md`](annotations.md)；Demo case 编写见 [`cases.md`](cases.md)。

> **上下文：** `__docs__/` 目录下有两类文件——自动生成的 API 表格（`*-api.*.md`）和手动维护的文档页面（`index.zh-CN.md` / `index.en-US.md`）。核心原则（唯一真相来源、禁止手动编辑自动生成文件）见 [`SKILL.md`](../SKILL.md)「核心原则」章节。管线运行逻辑详见 [`pipeline.md`](pipeline.md)。

---

## 文档管线总览

手动维护的文件是 `index.zh-CN.md` 和 `index.en-US.md`，每次修改都要**同步更新中英文两份**。自动生成的 `*-api.*.md` 禁止手动编辑——详见 [`SKILL.md`](../SKILL.md)「核心原则」。管线运行逻辑见 [`pipeline.md`](pipeline.md)。

---

## 行内标签语法 ^[]()``

> 本节是 `^[]()` 行内标签语法的**唯一定义处**。以下所有场景（sidebar、标题、CSS 变量表、注入键等）涉及行内标签时，格式细节统一引用本节，各场景小节只写语义用法。

文档 Markdown 支持一种行内标签语法，用于在文本中插入注解标签（版本号、废弃标记、实验性标记等）。该语法在侧边栏菜单、锚点导航和 API 表格中均能正确渲染。

### 语法格式

```
^[content](color)`tooltip`
```

| 部分      | 是否必填                        | 说明                                     |
| --------- | ------------------------------- | ---------------------------------------- |
| `content` | 必填                            | 标签显示的文字                           |
| `color`   | 推荐必填（省略时默认 `normal`） | 标签颜色，可选值见下方                   |
| `tooltip` | 可选                            | 反引号包裹，hover 时以气泡形式展示的内容 |

**可选颜色**（对应 OTag 的 `color` 属性）：

| 颜色      | 语义        | 常见用途                   |
| --------- | ----------- | -------------------------- |
| `primary` | 新增/版本   | `@since` 版本号标注        |
| `danger`  | 废弃/危险   | `@deprecated` 废弃标记     |
| `warning` | 实验性/注意 | `@experimental` 实验性标记 |
| `success` | 稳定/推荐   | 稳定功能标注               |
| `normal`  | 默认/中性   | 无特殊语义的标签           |

**放置位置：** 行内标签统一放在**首列文本后面**（与 gen:api 输出格式 `name + annotationLabel` 一致）。无 tooltip 时渲染为 `<OTag>`，有 tooltip 时渲染为 `<OPopover>` 包裹 `<OTag>`。

**开发阶段占位符：** `NEXT` 是版本占位符，发布确认版本号后替换为实际版本号（如 `1.2.4`），配合 release-note skill。

### 手动使用速查

以下表格列出所有需要**手动写**行内标签的场景及对应格式。API 表格（`*-api.*.md`）中的行内标签由 gen:api 自动生成，**不要手动编辑**。

| 场景               | 标签格式                                        | 位置                                 |
| ------------------ | ----------------------------------------------- | ------------------------------------ |
| 新增组件 sidebar   | `^[NEXT](primary)` → 发布后 `^[1.2.4](primary)` | frontmatter sidebar 字段，组件名后面 |
| Demo 标题标注版本  | `^[NEXT](primary)` → 发布后 `^[1.2.4](primary)` | 标题文本后面                         |
| CSS 变量新增       | `^[NEXT](primary)` → 发布后 `^[1.3.0](primary)` | 变量名列，变量名后面                 |
| CSS 变量废弃       | `^[deprecated](danger)`废弃说明``               | 变量名列，变量名后面                 |
| 实验性组件 sidebar | `^[experimental](warning)`                      | frontmatter sidebar 字段，组件名后面 |
| 实验性组件标题     | `^[experimental](warning)`说明``                | 标题文本后面                         |
| 废弃组件 sidebar   | `^[deprecated](danger)`废弃说明``               | frontmatter sidebar 字段，组件名后面 |
| 废弃组件标题       | `^[deprecated](danger)`废弃说明``               | 标题文本后面                         |
| 注入键新增属性     | `^[NEXT](primary)` → 发布后 `^[1.1.0](primary)` | 属性名列，属性名后面                 |

### 管线渲染流程

行内标签语法的完整渲染管线见 [`pipeline.md`](pipeline.md)「行内标签渲染管线」章节。

---

## 新增组件的 since 声明

当**整个组件是新增的**时，所有 prop/event/slot/expose 都在同一版本引入，逐项标注 `@since` 是冗余的。因此 `since` 版本声明在组件整体层面——`index.*.md` 的 sidebar 字段加版本行内标签（见「行内标签语法」速查表）：

```yaml
sidebar: ONewComponent 新组件名称 ^[NEXT](primary)
kind: input
```

英文文档同步：

```yaml
sidebar: ONewComponent ^[NEXT](primary)
```

**关键区分：**

| 场景                     | since 声明方式               | 位置                            |
| ------------------------ | ---------------------------- | ------------------------------- |
| 新增组件                 | sidebar 字段加版本行内标签   | `index.*.md` frontmatter        |
| 已有组件新增 prop/event  | 逐项 `@since NEXT` JSDoc tag | types.ts / .vue defineEmits     |
| 已有组件新增 slot/expose | 逐项 `@since NEXT` JSDoc tag | .vue defineSlots / defineExpose |

新增组件时，各 API 项（props/events/slots/expose）**不再单独写 `@since`**——注释侧只需写 `@zh-CN` / `@en-US` / `@default`，版本信息由文档侧 sidebar 统一声明。

---

## Demo 标题的版本标注

已有组件新增功能时，在 Demo 标题加版本行内标签（见「行内标签语法」速查表），帮助读者快速判断版本兼容性：

```markdown
### 清除功能 ^[NEXT](primary)

通过 `clearable` 属性开启输入框右侧的清除图标。
```

每次新增功能时，在 `index.zh-CN.md` 和 `index.en-US.md` 的相关 Demo 标题旁加版本行内标签。

---

## 废弃 prop 的警告块

当某个 prop 废弃时，在 `index.zh-CN.md` 中 **API 部分之前**加入警告块（prop 名称列的废弃行内标签由 gen:api 自动生成，此处 blockquote 是补充说明）：

```markdown
> [!WARNING]
> `type` 属性已废弃，请使用 [`variant`](#variant) 代替。该属性将在 **v2.0.0** 中移除。
```

英文文档同步：

```markdown
> [!WARNING]
> The `type` prop is deprecated. Use [`variant`](#variant) instead. It will be removed in **v2.0.0**.
```

---

## CSS 变量表维护

CSS 变量表**手动维护**（不由 `gen:api` 生成），每次改动 `style/var.scss` 后必须同步更新。中英文两份都要更新。版本标注在变量名列加行内标签（见「行内标签语法」速查表）。

**新增 CSS 变量时**：

```markdown
### CSS 变量

| CSS 变量                               | 描述           |
| -------------------------------------- | -------------- |
| --btn-color                            | 按钮文字颜色   |
| --btn-loading-opacity ^[NEXT](primary) | 加载状态透明度 |
```

**废弃/重命名 CSS 变量时**（属于 BREAKING CHANGE），旧变量保留一个版本做向后兼容，变量名列加废弃标签、描述列说明替代方案和移除版本：

```markdown
| ~~--btn-bg~~ ^[deprecated](danger)`请使用 --btn-background，将在 v2.0.0 移除` | 按钮背景色（旧） |
| --btn-background ^[1.4.0](primary) | 按钮背景色（替代 `--btn-bg`） |
```

CSS 变量表格式以当前组件已有样式为准（部分组件有"默认值"列，如有则保留）。

---

## 实验性功能/组件的文档处理

frontmatter 只支持 `sidebar` 和 `kind` 字段，**不存在** `status: experimental` 等自定义字段。实验性状态通过行内标签 + blockquote 同时标注（行内标签格式见「行内标签语法」速查表）：

**① sidebar 字段加 experimental 行内标签：**

```yaml
sidebar: OVirtualList 虚拟列表 ^[experimental](warning)
kind: display
```

英文文档同步：

```yaml
sidebar: OVirtualList ^[experimental](warning)
```

**② 标题加 experimental 行内标签 + blockquote 详细说明：**

```markdown
# OVirtualList ^[experimental](warning)`API 尚未稳定`

> 当前版本中，OVirtualList 的 API 尚未稳定，后续版本可能在无预告的情况下进行破坏性变更。请勿在生产环境中依赖具体的 prop 名称或事件签名。
```

英文文档同步：

```markdown
# OVirtualList ^[experimental](warning)`API not yet stable`

> The API of OVirtualList is not stable yet. Breaking changes may be introduced in future versions without prior notice.
```

标题行内标签提供快速视觉指示，blockquote 提供完整说明。

**③ 实验性 case 与普通 case 分开放置**（case 编写细节见 [`cases.md`](cases.md)）：

```markdown
## 示例

<!-- @usage VirtualListUsage -->
<!-- @case VirtualListBasic -->

<!-- 实验性功能单独放，让读者一眼看到分隔 -->
<!-- @case VirtualListVirtual -->
```

---

## 废弃整个组件的文档处理

sidebar 字段加 deprecated 行内标签，标题加 deprecated 行内标签 + blockquote 详细说明（行内标签格式见「行内标签语法」速查表）：

```yaml
sidebar: OOldComponent 旧组件 ^[deprecated](danger)`请迁移到 ONewComponent，将在 v2.0.0 移除`
```

英文文档同步：

```yaml
sidebar: OOldComponent ^[deprecated](danger)`Migrate to ONewComponent, will be removed in v2.0.0`
```

```markdown
# OOldComponent ^[deprecated](danger)`请迁移到 ONewComponent，将在 v2.0.0 移除`

> **废弃预告（Deprecated）**
>
> OOldComponent 已废弃，请迁移到 [ONewComponent](/components/new-component)。该组件将在 **v2.0.0** 中移除。
```

英文文档同步：

```markdown
# OOldComponent ^[deprecated](danger)`Migrate to ONewComponent, will be removed in v2.0.0`

> **Deprecated**
>
> OOldComponent is deprecated. Please migrate to [ONewComponent](/components/new-component). It will be removed in **v2.0.0**.
```

---

## provide/inject 注入键的文档编写

当注入键评估为适合对外导出后（评估过程见 [`annotations.md`](annotations.md)），在 `index.zh-CN.md`（和 `index.en-US.md`）中增加 **"## 注入（Injection）"** 章节。属性名列加版本行内标签（见「行内标签语法」速查表）：

```markdown
## 注入（Injection）

在自定义组件中与 OForm 表单体系集成时，可注入 `formItemInjectKey` 获取字段上下文 ^[1.1.0](primary)：

\`\`\`typescript
import { inject } from 'vue';
import { formItemInjectKey } from '@opensig/opendesign';

const formItemCtx = inject(formItemInjectKey, null);
\`\`\`

| 属性          | 类型                        | 说明                  |
| ------------- | --------------------------- | --------------------- |
| fieldHandlers | FieldHandlersT              | 注册/注销字段的处理器 |
| fieldResult   | Ref\<FieldResultT \| null\> | 字段验证结果          |
```

注入键的版本/弃用规则：

- **新增注入键或接口新增属性**：属性名列加 `^[NEXT](primary)` 行内标签
- **接口删除/重命名属性**：属于 BREAKING CHANGE，需提前一个大版本警告
- **废弃整个注入键**：章节头部加 blockquote 废弃说明，从 `index.ts` 移除导出（经过一个大版本过渡）
- **接口尚不稳定**：章节标题加 `^[experimental](warning)` 行内标签

---

## gen:api 运行流程

每次新增、修改、废弃任何 props / events / slots / expose 后，**必须手动运行** `pnpm gen:api`（Vite 开发服务器不会自动运行 gen:api，详见 [`pipeline.md`](pipeline.md)）。运行后检查 git diff，确认自动生成的表格内容是否符合预期。

---

## 工作流

```
已有组件新增 prop/event（文档侧）
  1. index.zh-CN.md + index.en-US.md：相关 Demo 标题加版本行内标签（见速查表）
  2. → 注释侧见 annotations.md
  3. pnpm gen:api → 确认生成结果

新增组件（文档侧）
  1. index.zh-CN.md + index.en-US.md：sidebar 字段加版本行内标签（见速查表）
  2. → 注释侧无需逐项写 @since，见 annotations.md
  3. pnpm gen:api → 确认生成结果

新增 CSS 变量
  1. style/var.scss：添加变量定义
  2. index.zh-CN.md + index.en-US.md 的 CSS 变量表：变量名列加版本行内标签（见速查表）
  3. 若变量是废弃重命名：旧变量名加废弃标签，新变量名加版本标签

涉及 provide/inject 注入键（文档侧）
  1. → 评估是否对外见 annotations.md
  2. 适合对外且已导出 → 在 index.md 中写"## 注入"章节（用法示例 + 属性表 + 行内标签）
  3. 适合对外但未导出 → 向用户建议导出，待确认后补文档

废弃 prop/event（文档侧）
  1. index.zh-CN.md + index.en-US.md：在 API 部分前加废弃 WARNING blockquote 块
  2. → 注释侧 + 运行时警告见 annotations.md
  3. pnpm gen:api

新增实验性功能（文档侧）
  1. → 实验性 case 见 cases.md
  2. index.zh-CN.md + index.en-US.md：将实验性 case 单独引用，与普通 case 分开
  3. 若整个组件是实验性的：sidebar + 标题加 experimental 行内标签（见速查表），blockquote 加详细说明
  4. pnpm gen:api

废弃整个组件（文档侧）
  1. sidebar + 标题加 deprecated 行内标签（见速查表），blockquote 加详细说明
  2. → 注释侧见 annotations.md
  3. pnpm gen:api
```

---

## 检查清单

- [ ] `index.zh-CN.md` 和 `index.en-US.md` 中新功能有版本行内标签（sidebar、标题、CSS 变量、注入键）
- [ ] `index.zh-CN.md` 和 `index.en-US.md` 中废弃 API 有 WARNING blockquote 块
- [ ] 修改了 `style/var.scss` 后同步更新了 CSS 变量表（中英文）
- [ ] 废弃/重命名 CSS 变量时变量名列加了废弃行内标签，描述列说明替代方案和移除版本
- [ ] 实验性组件 sidebar 和标题有 experimental 行内标签，blockquote 有详细说明
- [ ] 实验性 case 与普通 case 在 `index.md` 中分开放置
- [ ] 对外公开的注入键有"## 注入"文档章节（用法示例 + 属性表 + 版本行内标签）
- [ ] 注入键接口删除/重命名属性时，文档中标注了 BREAKING CHANGE 和迁移方式
- [ ] 重命名/删除导出 TypeScript 类型时在文档中说明了迁移方式
- [ ] 运行了 `pnpm gen:api`，自动生成文件已更新
