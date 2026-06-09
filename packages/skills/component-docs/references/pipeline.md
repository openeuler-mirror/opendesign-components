# 文档管线运行逻辑

> 本文件是 `component-docs` skill 的补充参考，详细说明文档生成管线的内部机制。日常写文档不需要读此文件——只在想理解管线底层逻辑时查阅。

---

## 文件职责划分

| 文件                | 维护方式     | 内容                                                             | 何时修改                                 |
| ------------------- | ------------ | ---------------------------------------------------------------- | ---------------------------------------- |
| `types.ts`          | 手动         | props 的 JSDoc 注释（@zh-CN/@en-US/@default/@since/@deprecated） | 新增/废弃/修改 props                     |
| `.vue` defineEmits  | 手动         | events 的 JSDoc 注释                                             | 新增/废弃/修改 events                    |
| `.vue` defineExpose | 手动         | expose 的 JSDoc 注释（纯文本，无 tag）                           | 新增/废弃 expose 方法                    |
| `*-api.zh-CN.md`    | **自动生成** | props/events/slots/expose 的 API 表格                            | **禁止手动编辑**，由 `pnpm gen:api` 生成 |
| `*-api.en-US.md`    | **自动生成** | 同上（英文版）                                                   | **禁止手动编辑**                         |
| `index.zh-CN.md`    | 手动         | 组件文档主体（示例引用、行内标签、警告块、CSS 变量表、注入章节） | 新增/废弃功能、更新 CSS 变量             |
| `index.en-US.md`    | 手动         | 同上（英文版）                                                   | 与中文版同步更新                         |
| `__case__/*.vue`    | 手动         | Demo 文件（<docs> + <script> + <template>）                      | 新增/修改 demo                           |
| `style/var.scss`    | 手动         | CSS 变量定义                                                     | 新增/修改 CSS 变量                       |

---

## gen:api 提取规则

`pnpm gen:api` 从以下源头提取信息：

| 提取目标 | 提取位置                                 | 提取内容                                                                                                                                 |
| -------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| props    | `types.ts` 的 JSDoc                      | @zh-CN/@en-US → 说明列，@default → 默认值列，required → 必填列，@since/@deprecated/@experimental → 名称列追加行内标签，其余 tag → 其它列 |
| events   | `.vue` 的 defineEmits JSDoc              | 注解标签提取逻辑同 props（名称列行内标签 + 其它列），但表格不含默认值列和必填列（仅 4 列）                                               |
| slots    | `types.ts` / `.vue` defineSlots 的 JSDoc | @zh-CN/@en-US → 说明列，@since/@deprecated/@experimental → 名称列追加行内标签（表格仅 3 列，无"其它"列）                                 |
| expose   | `.vue` 的 defineExpose JSDoc             | 注释文本 → 说明列，@since/@deprecated/@experimental → 名称列追加行内标签（表格仅 3 列，无"其它"列）                                      |

> **表格列差异：** props 6 列（名称/类型/默认值/必填/说明/其它）、events 4 列（名称/签名/说明/其它）、slots 3 列（名称/签名/说明）、expose 3 列（名称/类型/说明）。slots 和 expose 没有"其它"列——所有注解标签统一渲染到名称列行内展示。

注解标签（@since/@deprecated/@experimental）在**所有四类表格中统一渲染为行内标签语法 `^[]()``**，由 popover.ts markdown 插件解析为 `<OTag>` 或 `<OPopover>`+`<OTag>` HTML，颜色按标签类型区分。名称列无注解标签的组件表格与以前完全一致。

---

## 行内标签渲染管线

`^[]()`` 行内标签语法跨越 Markdown 编译与 Vue 运行时，完整渲染管线如下：

```
JSDoc 注解标签（@since/@deprecated/@experimental）
      ↓ generateApi.ts（ANNOTATION_TAG_DEFS 映射）
  生成 ^[]()`` 语法写入 *-api.*.md
      ↓ popover.ts（markdown-it 插件）
  解析 ^[]()`` 语法，渲染为 HTML（带 data-annotation-* 属性）
      ↓ getHeads.ts（运行时 DOM 提取）
  从 data-annotation-* 属性还原 ^[]()`` 语法，供锚点组件使用
      ↓ inlineTag.ts（renderInlineTagContent）
  将 ^[]()`` 语法转为 VNode（OTag / OPopover+OTag）
      ↓
  侧边栏菜单 + 锚点导航展示行内标签
```

### 各模块职责

| 模块                    | 位置                    | 职责                                                                                            |
| ----------------------- | ----------------------- | ----------------------------------------------------------------------------------------------- |
| `inlineTagConstants.ts` | `packages/docs/shared/` | 共享常量：正则 `TAG_REG_EXP`、颜色类型 `TagColor`、间距 `TAG_INLINE_MARGIN_LEFT`                |
| `popover.ts`            | `plugins/markdown/`     | markdown-it 插件：`^[]()`` 语法 → HTML（`<OTag>`/`<OPopover>`），写入 `data-annotation-\*` 属性 |
| `inlineTag.ts`          | `src/utils/`            | `renderInlineTagContent()`：文本 → VNode（用于侧边栏、锚点等非 Markdown 场景）                  |
| `getHeads.ts`           | `src/utils/`            | `extractTitleWithTags()`：从 DOM `data-annotation-*` 属性还原 `^[]()`` 语法                     |

### 语法细节

- **正则（两条，职责不同）**：
  - Markdown 编译（`popover.ts`）：`/^\^\[([^\]]*)\](?:\((normal|primary|success|warning|danger)\))?(`[^`]\*`)?/` — color **可选**（省略时默认 `normal`），行级 inline rule 匹配（无 `g` flag）
  - 运行时 VNode 渲染（`inlineTagConstants.ts`）：`/\^\[([^\]]*)\]\((normal|primary|success|warning|danger)\)(?:`([^`]\*)`)?/g` — color **必填**，全文匹配（带 `g` flag）
- **data-annotation 属性**：`data-annotation-text`（内容）、`data-annotation-color`（颜色）、`data-annotation-tooltip`（tooltip，可选）
- **渲染差异**：
  - 无 tooltip → `<OTag size="small" variant="outline">` 行内标签
  - 有 tooltip → `<OPopover>` 包裹 `<OTag class="tooltip">`，hover 展示气泡

### gen:api 注解标签映射

`ANNOTATION_TAG_DEFS` 定义了 JSDoc 标签到行内标签的映射规则：

| JSDoc 标签      | color       | display | 输出语法                                     |
| --------------- | ----------- | ------- | -------------------------------------------- |
| `@since`        | `(primary)` | `text`  | `^[版本号](primary)`——显示版本号文本         |
| `@deprecated`   | `(danger)`  | `name`  | `^[deprecated](danger)`说明``——显示标签名    |
| `@experimental` | `(warning)` | `name`  | `^[experimental](warning)`说明``——显示标签名 |

`display: 'text'` 显示 tag 的 text 字段（如版本号），`display: 'name'` 显示标签名（如"deprecated"）。`@since` 无 text时不渲染标签。

---

## Vite 插件处理流程

文档站通过 `packages/docs/plugins/` 下的 Vite 插件处理 Demo 文件：

### injectDemoAndApi.ts

- 解析 `index.md` 中的 `<!-- @usage -->`、`<!-- @case -->`、`<!-- @api -->` 指令
- `@usage` → 注入 `<DemoUsage>` 包装组件（交互 playground）
- `@case` → 注入 `<DemoContainer>` 包装组件（预览 + 代码切换）
- `@api` → 注入自动生成的 API 表格文件
- 处理主题可见性（`:a/:k/:e/:d` 后缀）

### injectDemoDocs.ts

- 提取 `<docs lang="md">` 自定义块
- 按 `<!-- zh-CN -->` / `<!-- en-US -->` 分割为虚拟模块
- 附带到 `_sfc_main.__docs`

### injectDemoSource.ts

- 提取 case .vue 文件的源代码
- 移除 `<docs>` 块后作为展示代码
- 附带到 `_sfc_main.DemoSource`

---

## 自动生成 vs 手动维护对照

| 操作               | 需要改的文件                                            | 需要跑的命令                    |
| ------------------ | ------------------------------------------------------- | ------------------------------- |
| 新增 prop          | types.ts + index.md（行内标签） + **case**（如有 demo） | pnpm gen:api                    |
| 新增 event         | .vue defineEmits + index.md（行内标签）                 | pnpm gen:api                    |
| 新增 slot          | types.ts + index.md（行内标签）                         | pnpm gen:api                    |
| 新增 expose        | .vue defineExpose                                       | pnpm gen:api                    |
| 废弃 prop          | types.ts + .vue（log.warn） + index.md（WARNING block） | pnpm gen:api                    |
| 新增 CSS 变量      | style/var.scss + index.md（CSS 变量表）                 | 无（CSS 变量不由 gen:api 管理） |
| 修改 case          | **case**/\*.vue                                         | 无（Vite HMR 自动更新）         |
| 修改 index.md 文档 | index.zh-CN.md + index.en-US.md                         | 无（手动维护）                  |

**重要提醒：** `pnpm docs:dev` 的 Vite 开发服务器不会自动监听 types.ts 变化并重新运行 gen:api。修改源码注释后必须手动执行 `pnpm gen:api`。
