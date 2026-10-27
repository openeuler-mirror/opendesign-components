# 组件注释标注规范

> **关联参考：** 新增/废弃 API 的完整流程横跨注释标注和文档编写。注释标注（JSDoc tag、运行时警告）由本文件覆盖；Demo case 编写见 [`cases.md`](cases.md)；文档页面编写（行内标签、警告块、CSS 变量表）见 [`doc-pages.md`](doc-pages.md)。

> **上下文：** 本项目是 `@opensig/opendesign` Vue 3 组件库。核心原则（唯一真相来源、禁止手动编辑自动生成文件、每次修改后必须运行 gen:api）见 [`SKILL.md`](../SKILL.md)「核心原则」章节。

---

## @since 版本号的两阶段策略

开发阶段不知道新版本号（版本在写 release note 时才确认），`@since` 采用占位符策略：

- **开发阶段**：新增 API 时写 `@since NEXT` 作为占位符——保证不遗漏，也便于后续批量替换
- **发布阶段**：确认版本号后（由 [`release-note`](../../release-note/SKILL.md) skill 完成），批量将 `@since NEXT` 替换为实际版本号，再运行 `pnpm gen:api`

批量替换命令：

```bash
# 自动查找包含 @since NEXT 的文件并替换
grep -rl '@since NEXT' packages/opendesign/src/ | xargs sed -i 's/@since NEXT/@since <确认的版本号>/g'
```

### 新增组件 vs 新增 API 的 since 策略

- **新增组件**：`since` 在组件整体层面声明（sidebar 字段 `^[NEXT](primary)`），各 API 项不单独写 `@since` → 详见 [`doc-pages.md`](doc-pages.md)
- **新增 API**（已有组件上新增 prop/event/slot/expose）：逐项标注 `@since NEXT`，各 API 类型的写法差异见下方表格

---

## types.ts JSDoc 规范

### 基础格式（所有 props 都必须有）

```typescript
/**
 * @zh-CN 颜色类型
 * @en-US Color type
 * @default 'normal'
 */
color: {
  type: String as PropType<ButtonColorT>,
  default: 'normal',
},
```

必填标签：`@zh-CN`（中文说明）、`@en-US`（英文说明）。有默认值且非 `undefined` 时加 `@default`。

### 缺失 @en-US 时自动补译

审查组件源码时，如果发现某个 JSDoc 注释有 `@zh-CN` 但缺失 `@en-US`，**必须补上 `@en-US` 翻译**——`gen:api` 生成的英文 API 表格会直接使用 `@en-US` 的文本，缺失时该单元格为空。

翻译原则：

- **简洁精准**，与组件库已有注释风格一致（短句、不加冗余修饰）
- **技术术语保持英文原文**：prop 名、类型名、CSS 变量名等不用翻译
- **参考同组件已有注释**：同文件内其他 prop 的 `@en-US` 写法是最好的风格参考

此规则同样适用于 `defineExpose` 注释、`defineEmits` 注释、`<docs lang="md">` 块中的说明文字、以及 `index.en-US.md` 的内容——任何面向英文用户的文档出现缺失时都应补译。

### 新增 API：加 @since

`gen:api` 对不同 API 类型的处理方式不同，`@since` 的写法也有区别：

> **注意：** 如果是**新增组件**（整个组件从零创建），`@since` 不在各 API 项上标注，而是在组件级 `sidebar` 字段中统一声明。下表规则仅适用于**已有组件上新增 API** 的场景。

| API 类型           | `@since` 写法                                             | gen:api 输出                  |
| ------------------ | --------------------------------------------------------- | ----------------------------- |
| **props / events** | JSDoc tag `@since NEXT`（发布时替换为 `@since <版本号>`） | 名称列追加 `^[NEXT](primary)` |
| **slots**          | JSDoc tag `@since NEXT`（与 props/events 写法一致）       | 名称列追加 `^[NEXT](primary)` |
| **expose**         | JSDoc tag `@since NEXT`（与 props/events 写法一致）       | 名称列追加 `^[NEXT](primary)` |

**props / events 的标准写法：**

```typescript
/**
 * @zh-CN 是否显示清除按钮
 * @en-US Whether to show the clear button
 * @since NEXT
 */
clearable: Boolean,
```

**slots 的写法（使用 JSDoc tag）：**

```typescript
/**
 * @zh-CN 自定义图标
 * @en-US Custom icon slot
 * @since NEXT
 */
```

注解标签（`@since`、`@deprecated`、`@experimental`）现在在 slots/expose 表格中也能渲染到名称列行内展示，与 props/events 的行为一致。

### JSDoc 注解 → 行内标签的映射规则

`gen:api` 将 JSDoc 注解标签转为 `^[]()`` 行内标签语法，具体映射如下：

| JSDoc 标签           | 行内标签输出                     | 说明                                   |
| -------------------- | -------------------------------- | -------------------------------------- |
| `@since NEXT`        | `^[NEXT](primary)`               | 显示版本号，无 tooltip                 |
| `@since 1.2.0`       | `^[1.2.0](primary)`              | 显示实际版本号，无 tooltip             |
| `@deprecated 说明`   | `^[deprecated](danger)`说明``    | 显示"deprecated"，hover 展示废弃详情   |
| `@experimental 说明` | `^[experimental](warning)`说明`` | 显示"experimental"，hover 展示补充说明 |

颜色与语义对应：`since → primary`、`deprecated → danger`、`experimental → warning`。语法详细说明见 [`doc-pages.md`](doc-pages.md)「行内标签语法」章节，管线渲染流程见 [`pipeline.md`](pipeline.md)「行内标签渲染管线」章节。

### 废弃 API：加 @deprecated

**props / events** 废弃时，`@deprecated` 会被 gen:api 渲染为名称列行内标签 `^[deprecated](danger)`废弃说明``，hover 展示废弃详情；同时 IDE 也会识别这个标准 tag 显示删除线提示：

```typescript
/**
 * @zh-CN 已废弃，请使用 `variant` 属性替代，将在 v2.0.0 移除
 * @en-US Deprecated. Use `variant` instead. Will be removed in v2.0.0.
 * @deprecated 请使用 `variant` 替代，将在 v2.0.0 移除
 * @since 1.0.0
 */
type: {
  type: String as PropType<'solid' | 'outline'>,
},
```

- `@zh-CN` / `@en-US`：说明废弃原因 + 替代方案 + 移除版本
- `@deprecated`：中文简短说明（IDE 识别 + gen:api 渲染为 `^[deprecated](danger)`说明``）
- `@since`：保留该 prop 最初引入的版本（不要删除）

**slots / expose** 废弃时，`@deprecated` 同样会被渲染为 `^[deprecated](danger)`说明``，与 props/events 行为一致。

### 实验性 API：加 @experimental

**props / events** API 尚未稳定时，加 `@experimental`（gen:api 渲染为 `^[experimental](warning)`说明``）。**slots / expose** 同样支持 `@experimental` JSDoc tag，渲染方式一致：

```typescript
/**
 * @zh-CN 是否启用虚拟滚动
 * @en-US Whether to enable virtual scrolling
 * @experimental API 尚未稳定，后续版本可能变更
 * @since NEXT
 */
virtual: Boolean,
```

### SSR 兼容性说明

某个 prop/功能依赖浏览器 API（`window`/`document`/`requestAnimationFrame`）时，在 JSDoc 注释中说明降级行为：

```typescript
/**
 * @zh-CN 是否启用虚拟滚动（仅客户端生效，SSR 环境下自动降级为全量渲染）
 * @en-US Enable virtual scrolling (client-side only; falls back to full rendering in SSR)
 * @since NEXT
 */
virtual: Boolean,
```

组件实现中的 SSR 守卫（遵循项目 SSR 规范）：

- 浏览器 API 只能在 `onMounted` / 事件处理器中调用，不能在 `setup()` 顶层直接访问
- 环境判断用 `typeof window !== 'undefined'`（不能用 `import.meta.env` 检查 SSR）
- prop 默认值必须是静态值，不能依赖运行时环境

### 破坏性变更预告

某个默认值或行为将在下个大版本改变时，在说明中提前告知：

```typescript
/**
 * @zh-CN 间距大小。当前默认值为 `'medium'`，v2.0.0 起默认值将改为 `'small'`
 * @en-US Spacing size. Current default is `'medium'`; default will change to `'small'` in v2.0.0.
 */
spacing: {
  type: String as PropType<'small' | 'medium' | 'large'>,
  default: 'medium',
},
```

---

## defineEmits 事件的注释

`defineEmits` 定义的事件也是公开 API，注释写在 `.vue` 文件中。JSDoc tag 提取逻辑与 props 一致（`@since`/`@deprecated`/`@experimental` 渲染到名称列，其余 tag 进入"其它"列），但 events 表格不含默认值和必填列。

```typescript
const emit = defineEmits({
  /**
   * @zh-CN 点击按钮时触发
   * @en-US Triggered when the button is clicked
   * @since NEXT
   */
  click: (evt: MouseEvent) => true,
});
```

必填标签与 props 一致：`@zh-CN`、`@en-US`。新增事件加 `@since`，废弃事件加 `@deprecated`（格式同 props）。

---

## defineExpose 方法/属性的注释

`defineExpose` 中的每个方法/属性也是公开 API，**直接在 defineExpose 对象里写 JSDoc 注释**，`gen:api` 会提取注释文本并在"说明"列显示，同时支持 `@since`、`@deprecated`、`@experimental` 等注解标签渲染到名称列行内展示：

**注意：** expose 表格只有 `名称 / 类型 / 说明` 三列，**没有"其它"列**。注解标签（`@since`、`@deprecated`、`@experimental`）统一渲染到名称列行内展示，与 props/events/slots 行为一致：

```typescript
defineExpose({
  /**
   * 聚焦输入框
   * @since 1.2.0
   */
  focus() {
    /* ... */
  },

  /**
   * 已废弃，请使用 `focus()`，将在 v2.0.0 移除
   * @deprecated 请使用 `focus()` 替代
   */
  setFocus() {
    /* ... */
  },
});
```

没有注释的 expose 项，自动生成表格中不会出现"说明"列——因此新增 expose 方法时务必写注释。

---

## 导出的 TypeScript 类型

`types.ts` 通过 `export * from './types'` 将类型别名一并导出，调用者会用这些类型做 TypeScript 开发，因此它们也是公开 API：

```typescript
// 这些都是公开 API，改名/删除 = breaking change
export type ButtonColorT = ColorT | 'brand';
export type ButtonPropsT = ExtractPropTypes<typeof buttonProps>;
```

- **新增导出类型**：无需特殊标注，保持命名语义清晰即可
- **重命名/删除导出类型**：属于 BREAKING CHANGE，需在 `index.zh-CN.md` 里提前说明迁移方式

---

## provide/inject 注入键的导出评估

遇到 provide/inject 时，先读 `provide.ts` 和 `index.ts`，判断注入键是否适合对外导出。

**第一步：判断当前是否已导出**

```typescript
// index.ts 里有这行 → 已对外公开
export { formItemInjectKey } from './provide';

// index.ts 里没有 → 当前仅内部使用
// 但"当前没导出"不代表"不应该导出"
```

**第二步：评估是否适合对外**

读 `provide.ts` 中注入键的接口定义，结合组件用途判断：

| 考量           | 适合对外                                             | 应保持内部                      |
| -------------- | ---------------------------------------------------- | ------------------------------- |
| 谁会 inject？  | 库的使用者可能想自定义组件时注入（如自定义表单字段） | 只有库内部的配套子组件会 inject |
| 接口稳定性     | 接口语义清晰，近期不会大改                           | 还在频繁变动，或是实现细节      |
| 是否有合理场景 | 能想到使用者想扩展该组件的具体场景                   | 暴露出去没有实际用途            |

举例：

- `formItemInjectKey`：外部自定义表单控件需要接入验证体系 → 适合对外
- `cascaderV2InjectKey`：外部可能需要自定义 option 节点 → 适合对外
- `carouselInjectKey`：只有 OCarouselItem 会用 → 保持内部
- `selectOptionInjectKey`：只有 OOption 使用，且接口可能随实现变动 → 保持内部

**第三步：根据评估结果给出建议**

- **已导出 + 适合对外**：确认导出，文档侧写"## 注入"章节（见 [`doc-pages.md`](doc-pages.md)）
- **未导出 + 评估后适合对外**：向用户建议在 `index.ts` 中显式导出；如果接口尚不稳定，可先加 `@experimental`
- **未导出 + 评估后保持内部**：告知用户无需文档操作

---

## 运行时废弃警告

废弃某个 prop 后，在组件 `setup()` 中加入开发环境警告，让调用方在控制台第一时间发现问题。

**优先使用项目已有的 `log.warn()` 工具**（路径：`src/_utils/log.ts`，与 OPagination、OTabPane 等组件保持一致）：

```typescript
import { log } from '../_utils/log';
import { isUndefined } from '../_utils/is';

if (!isUndefined(props.type)) {
  log.warn('[OButton] prop `type` 已废弃，请使用 `variant` 替代，将在 v2.0.0 移除');
}
```

若 `log.ts` 不可用，回退方案（消息格式与 `log.warn` 一致）：

```typescript
if (import.meta.env.DEV && props.type !== undefined) {
  console.warn('[OButton] prop `type` 已废弃，请使用 `variant` 替代，将在 v2.0.0 移除');
}
```

消息格式：`[组件名] prop \`prop名\` 已废弃，请使用 \`替代\` 替代，将在 vX.X 移除`
触发时机：仅检查 prop 是否被传入（`!== undefined`/`!isUndefined`），不检查具体值。

废弃整个组件时，不检查 prop，直接在 setup 入口触发警告。

---

## 工作流

```
已有组件新增 prop/event（注释侧）
  1a. types.ts：写 props 的 @zh-CN / @en-US / @default（如有）/ @since NEXT
  1b. .vue defineEmits：写 events 的 @zh-CN / @en-US / @since NEXT（格式同 props）
  2. → 文档侧（行内标签）见 doc-pages.md；Demo 侧见 cases.md
  3. pnpm gen:api → 确认生成结果

新增组件（注释侧）
  1a. types.ts：写 props 的 @zh-CN / @en-US / @default（如有），无需写 @since
  1b. .vue defineEmits / defineExpose：写注释，无需写 @since（版本由文档侧 sidebar 统一声明）
  2. → 文档侧（sidebar 追加 ^[NEXT](primary)）见 doc-pages.md；Demo 侧见 cases.md
  3. pnpm gen:api → 确认生成结果

新增 expose 方法/属性
  1. defineExpose 对象里：写 JSDoc 注释（`@zh-CN`/`@en-US`/`@since NEXT`）
  2. pnpm gen:api → 确认"说明"列已出现

涉及 provide/inject 注入键
  1. 读 provide.ts + index.ts → 评估是否适合对外导出
  2. 适合对外 → 建议导出，文档侧见 doc-pages.md
  3. 保持内部 → 无需文档操作

废弃 prop/event（注释侧）
  1. types.ts / .vue defineEmits：补充 @deprecated + 更新 @zh-CN/@en-US；保留 @since
  2. .vue setup()：加 log.warn 运行时警告
  3. → 文档侧（WARNING blockquote）见 doc-pages.md
  4. pnpm gen:api

废弃整个组件（注释侧）
  1. 所有 props：@deprecated 标记 + 移除版本说明
  2. .vue setup() 入口：log.warn 加组件级废弃警告（不检查 prop，直接触发）
  3. → 文档侧见 doc-pages.md
  4. pnpm gen:api
```

---

## 检查清单

- [ ] 所有 props / events / slots / expose 都有 `@zh-CN` 和 `@en-US`，缺失的 `@en-US` 已补译
- [ ] `<docs lang="md">` 块中 `<!-- en-US -->` 部分内容完整，缺失的已补译
- [ ] **已有组件**新增的 API 有 `@since NEXT` 占位符（发布时替换为实际版本号）
- [ ] **新增组件**不在各 API 项上写 `@since`，而是在 `index.*.md` sidebar 字段中声明组件级 since
- [ ] 废弃的 API 有 `@deprecated` + 替代说明 + 移除版本
- [ ] 废弃的 prop 在 `.vue` setup() 中有运行时警告（优先用 `log.warn()`）
- [ ] defineEmits 事件有 `@zh-CN` 和 `@en-US`，新增/废弃格式同 props
- [ ] expose 方法/属性在 defineExpose 对象里有 `@zh-CN`、`@en-US`、`@since NEXT` JSDoc 注释
- [ ] 遇到 provide/inject 注入键时：已评估是否适合对外导出
- [ ] 运行了 `pnpm gen:api`，自动生成文件已更新
