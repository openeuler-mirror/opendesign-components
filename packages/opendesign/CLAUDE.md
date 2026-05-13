# packages/opendesign CLAUDE.md

`@opensig/opendesign` 组件库源码包。

**依赖**：根目录 CLAUDE.md 的 CSS 变量规范、CSS 值优先级规则、响应式断点。

## 命令

```bash
pnpm build            # 完整构建：gen:icon + build:component + build:style
pnpm build:component  # 构建 ES/CJS（preserveModules，不打包 vue/dayjs/@vueuse）
pnpm build:style      # 编译所有 SCSS 到 es/lib 对应路径
pnpm gen:icon         # 从 SVG 重新生成图标组件
pnpm lint             # ESLint（排除 __demo__ 和 __docs__）
pnpm type-check       # vue-tsc 类型检查
```

构建产物：`es/`（ESM）、`lib/`（CJS）、`dist/opendesign.min.js`（UMD）。

## 组件文件结构

每个组件位于 `src/<ComponentName>/`，固定包含：

```
OComponent.vue       # 模板 + <script setup>
index.ts             # Object.assign(_OComp, { install(app) {...} }) + 重导出类型
types.ts             # props 对象，每个 prop 带 @zh-CN/@en-US JSDoc 注释
style/
  var.scss           # 组件局部 CSS 自定义属性（含具体 px 值）
  style.scss         # 结构样式，引用 var.scss 中的局部变量
  media.scss         # 响应式断点覆盖，覆盖 var.scss 中的变量
  index.scss         # @use var + style + media
  index.ts           # 导入外部依赖样式后导入 index.scss
```

主题扩展样式（`theme-ascend.scss` 等）**不推荐添加**，仅在设计稿明确要求主题差异时才按需开发。

新组件完成后需在 `src/index.ts` 追加具名导出。

## 代码规范

- **圈复杂度**：单个函数不超过 **8**。超过时拆分为多个小函数。
- **函数长度**：单个函数不超过 **300 行**（不计空行和注释）。`use*` composable 函数除外。

## SSR 兼容

本组件库支持服务端渲染，代码 review 时需重点检查以下问题：

### 浏览器/服务端专属 API

- **禁止在模块顶层、`<script setup>` 直接执行处、`created` / `beforeCreate` 中访问浏览器 API**（`window`、`document`、`navigator`、`localStorage`、`matchMedia`、`MutationObserver`、`ResizeObserver` 等）。这些只能在 `onMounted` / 事件处理器 / 用户交互回调中使用。
- 需要在非 mounted 上下文中判断环境时，用 `typeof window !== 'undefined'` 守卫，不要直接访问。
- **props 默认值不能依赖运行时环境**（如 `default: () => window.innerWidth`），应为静态值或 `undefined`。

### Hydration Mismatch

以下模式会导致服务端渲染的 HTML 与客户端 hydration 时的 DOM 不一致，review 时必须识别：

- **随机值/时间戳**：`Math.random()`、`Date.now()`、`new Date()` 在 setup / 模板中直接使用，服务端与客户端结果不同。
- **无效 HTML 嵌套**：如 `<div>` 嵌套在 `<p>` 内、`<a>` 嵌套 `<a>`，浏览器会自动修正 DOM 导致结构与服务端不符。
- **条件渲染依赖客户端状态**：`v-if="isClient"` 类的判断在服务端渲染为 false 而客户端为 true，产生结构差异。初始渲染必须与服务端一致，状态差异延迟到 `onMounted` 之后触发。
- **Teleport / OPopup 未包 `ClientOnly`**：Teleport 内容在 SSR 中的挂载点与客户端不同，必须用 `ClientOnly` 包裹。
- **时区和日期格式化**：服务端与客户端时区可能不同，避免在 SSR 路径上格式化时间展示。

### 模块级单例状态

- **禁止在模块顶层定义可变的响应式状态**（如 `const state = reactive({})`），在 SSR 下所有请求共享同一个模块实例，会导致用户间状态污染。
- 需要跨组件共享状态时使用 `provide/inject` 在组件树内传递，或将状态初始化放在 `setup()` 内。
- `_utils/global.ts` 中的 `defaultSize`、`defaultZIndex` 等全局 ref 是组件库配置，不是请求级状态，属于允许的例外。

## 样式约定

- `var.scss`：在组件根选择器上定义局部变量，值可以是具体 px（如 `--btn-height: 32px`）或全局 Token 引用。
- `style.scss`：布局与结构属性引用 `var.scss` 中的局部变量（如 `height: var(--btn-height)`），不直接写 px 值。
- 颜色、圆角、阴影、字号等全局设计 Token 使用 `--o-*` 变量（由 `@opensig/opendesign-token` 提供）。
- 响应式在 `media.scss` 中用断点覆盖 `var.scss` 的局部变量。

`_styles/mixin.scss` 全局注入，组件 SCSS 中可直接使用：

| Mixin                          | 用途                  |
| ------------------------------ | --------------------- |
| `@include hover`               | 仅支持 hover 设备生效 |
| `@include respond('<=laptop')` | 响应式媒体查询        |
| `@include x-svg-hover`         | SVG 旋转关闭效果      |

**断点速查**：响应式断点定义见 [根目录 CLAUDE.md CSS 值优先级规则](/CLAUDE.md#css-%E5%80%BC%E4%BC%98%E5%85%88%E8%A7%84%E5%88%9B)。

## 内部共享组件（`src/_components/`）

**优先复用，禁止另起炉灶。**

### `InBox`（`_components/in-box`）

输入框视觉外壳，提供 size / variant / color / round / disabled / readonly 状态，不含输入逻辑。适用于内容自定义但需要输入框外观的场景（DatePicker、Select、TimePicker 等）。

### `InInput`（`_components/in-input`）

在 `InBox` 基础上增加输入逻辑：value / placeholder / clearable / formatter / validator。纯文本单行输入优先使用此组件而非重新实现。

### `InTextarea`（`_components/in-textarea`）

多行文本版本的 InInput，支持 rows / resize / minLength / maxLength / 字符计数。

### `ClientOnly`（`_components/client-only.ts`）

包裹一切使用 `Teleport` 或 `OPopup` 的内容，防止 SSR hydration mismatch。

### `OPopup`（`src/popup/`）

所有浮层的底层容器，负责定位、触发、z-index、响应式（手机端自动降级为 click）。核心 props：`trigger`、`position`、`wrapper`、`offset`、`unmountOnHide`。

**适用场景：** 组件自身的「展开面板」，即触发元素与弹出内容是强绑定的功能关系（Select 下拉列表、DatePicker 日历、Dropdown 菜单等）。内容通过 `#content` slot 传入。

### `OPopover`（`src/popover/`）

`OPopup` 的语义封装，预设 `trigger='hover'`、带箭头（anchor）、提供 `title` / `content` slot。本身不处理定位，仍委托给内部的 `OPopup`。

**适用场景：** 对某个元素的补充说明、提示气泡，内容与触发元素是「解释」关系而非功能关系（字段说明、图标 tooltip、操作确认等）。新组件若只需悬停提示，优先使用 `OPopover` 而非自行封装 `OPopup`。

## 内部公用工具（`src/_utils/`）

**优先复用，禁止重新实现同类逻辑。**

### `global.ts` — 全局状态 ref

| 导出            | 说明                                                   |
| --------------- | ------------------------------------------------------ |
| `defaultSize`   | 默认尺寸 ref（`'medium'`），组件 size prop 的 fallback |
| `defaultRound`  | 全局圆角模式 ref（`'pill' \| undefined`）              |
| `defaultZIndex` | 浮层初始 z-index ref（默认 1000）                      |
| `mediaPoint`    | 断点数值 ref（`{ phone: 600, pad: 1200 }`）            |

### `style-class.ts`

`getRoundClass(props, 'name')` — 返回 `{ class, style }` computed，统一处理 round/pill 圆角逻辑，所有支持 round prop 的组件必须通过此函数而非自行计算。

### `z-index.ts`

| 导出                     | 说明                         |
| ------------------------ | ---------------------------- |
| `createTopZIndex()`      | 分配并返回下一个浮层 z-index |
| `removeZIndex(current?)` | 浮层关闭时归还               |
| `getZIndex()`            | 获取当前顶层值               |

### `icons.ts` — 图标 shallowRef

组件内部图标（关闭、箭头等）统一从此处导入（`iconClose`、`iconChevronDown` 等），支持全局替换。**禁止在组件内直接 import SVG 文件。**

### `vue-utils.ts` — VNode / Slot 工具

| 导出                              | 说明                                         |
| --------------------------------- | -------------------------------------------- |
| `isEmptySlot(slot?)`              | 判断 slot 是否为空                           |
| `getFirstElement(vn)`             | 获取 VNode 树中的第一个 HTMLElement          |
| `useSlotFirstElement()`           | composable，响应式追踪 slot 首个 DOM 元素    |
| `mergeClass(...classList)`        | 合并多种形式的 class                         |
| `getRenderableComponent(content)` | 将任意内容转为可渲染函数                     |
| `resolveHtmlElement(elRef)`       | 将 Ref/组件实例解析为 `Promise<HTMLElement>` |

### `dom.ts` — DOM 工具

| 导出                         | 说明                  |
| ---------------------------- | --------------------- |
| `getScrollParents(el)`       | 获取所有可滚动祖先    |
| `getCssVariable(key, el?)`   | 读取 CSS 自定义属性值 |
| `isElementHidden(el)`        | 判断元素是否不可见    |
| `checkElementOverflow(opts)` | 检测元素是否溢出容器  |
| `scrollTo(y, opts)`          | 平滑滚动              |

### `helper.ts` — 通用工具

| 导出                   | 说明                     |
| ---------------------- | ------------------------ |
| `debounce(fn, wait)`   | 防抖（默认首次立即执行） |
| `debounceRAF(fn)`      | 以 rAF 为周期的防抖      |
| `throttleRAF(fn)`      | rAF 节流                 |
| `chunk(arr, size)`     | 数组分块                 |
| `pick(source, keys)`   | 对象字段筛选             |
| `formateToString(val)` | 任意值转字符串           |

### `is.ts` — 类型判断

`isString`、`isNumber`、`isBoolean`、`isArray`、`isObject`、`isFunction`、`isNil`、`isUndefined`、`isNull`、`isNumeric` 等。

### `keycode.ts` — 键盘键值常量

`Enter`、`Esc`、`Tab`、`Space`、`ArrowUp/Down/Left/Right`、`Backspace`，用于 `e.key`/`e.code` 比较，禁止在组件内硬编码键名字符串。

### `unique-id.ts`

`useGetUniqueId()` — 返回自增 id 生成函数，用于组件内唯一 DOM id。

## 实现范式

### 范式 A：表单控件（Form Control）

所有具备用户输入语义的组件需接入表单系统。统一通过 `_composables/use-form-field.ts` 的 `useFormField()` 实现，**不要直接 inject `formItemInjectKey`**：

```ts
// src/_composables/use-form-field.ts
const { effectiveColor, inputId, isFocus, onFocus, onBlur, notifyChange } = useFormField(props, emit);
```

`useFormField` 内部处理：

- 从 `formItemInjectKey`（`form/provide.ts`）inject 表单项上下文
- 根据表单验证结果自动覆盖 color prop（error/warning/success）
- 在 focus / blur / change 时通知表单项触发校验

适用：OInput、OSelect、ODatePicker、OTimePicker、OSearch、OInputNumber、OUpload 等。

### 范式 B：组合组件（Group ↔ Item）

「父 provide → 子 inject」模式，父组件掌控选中状态，子组件读取并更新。每对组合组件在各自目录下建 `provide.ts` 定义 `InjectionKey`。

**子组件实现要点：**

1. `inject(groupInjectKey, null)` — null 表示独立使用时降级
2. 状态计算：`isChecked`、`isDisabled` 均优先读取 group 注入值
3. 变更：调用 `groupInjection.updateModelValue()` 通知父组件

**已有实现参考：**

| 父组件         | 子组件        | InjectionKey 文件           |
| -------------- | ------------- | --------------------------- |
| OCheckboxGroup | OCheckbox     | `checkbox-group/provide.ts` |
| ORadioGroup    | ORadio        | `radio-group/provide.ts`    |
| OTab           | OTabPane      | `tab/provide.ts`            |
| OSelect        | OOption       | `select/provide.ts`         |
| ODropdown      | ODropdownItem | `dropdown/provide.ts`       |

### 范式 C：浮层触发器（Trigger + Panel）

含弹出面板的组件根据用途选择基础层：

- **功能性展开面板**（下拉列表、日历、时间选择等）→ 直接使用 `OPopup` + `ClientOnly`
- **解释性气泡/提示**（字段说明、确认提示等）→ 使用 `OPopover`（已内置 hover 触发和箭头）

```vue
<!-- 功能性面板：OPopup -->
<ClientOnly>
  <OPopup trigger="focus" position="bottom-start" :wrapper="wrapperRef">
    <template #content>
      <!-- 面板内容 -->
    </template>
  </OPopup>
</ClientOnly>
```

面板关闭逻辑（点击外部）使用 `date-picker/composables/use-click-outside.ts` 中的实现模式（监听 window click，通过 `e.composedPath()` 判断），**不要使用 `document.addEventListener('click')`**。

复杂的触发器组件（如 DatePicker、TimePicker）将触发输入框逻辑抽取为 `Inner*.vue`（`InnerDatePicker.vue`、`InnerTimePicker.vue`），外层 `O*.vue` 仅负责 InBox 集成与 props 透传。

## 组件文档（`__docs__/`）

每个组件的 `__docs__/` 目录结构固定，文档站通过 Vite 插件自动处理：

```
__docs__/
  index.zh-CN.md          # 文档页入口（中文）
  index.en-US.md          # 文档页入口（英文）
  OComponent-api.zh-CN.md # ⚠️ 自动生成，禁止手动编辑（pnpm gen:api）
  OComponent-api.en-US.md # ⚠️ 自动生成，禁止手动编辑
  __case__/
    ComponentUsage.vue    # 交互式 Usage Demo（必须有，命名为 <Name>Usage.vue）
    ComponentFoo.vue      # 其他 case Demo
```

### index.\*.md 写法

文件顶部必须有 YAML frontmatter，`sidebar` 字段决定侧边栏标题，`kind` 字段决定分类：

```md
---
sidebar: ODatePicker 日期选择器
kind: input
---

# 日期选择器

## 示例

<!-- @usage DatePickerUsage -->
<!-- @case DatePickerMode -->
<!-- @case DatePickerFormat -->

## API

<!-- @api ODatePicker -->
<!-- @api ODateRangePicker -->
```

注释指令说明：

| 指令                            | 作用                                           |
| ------------------------------- | ---------------------------------------------- |
| `<!-- @usage ComponentName -->` | 插入交互式 Usage Demo（`DemoUsage` 组件渲染）  |
| `<!-- @case ComponentName -->`  | 插入普通 case Demo（`DemoContainer` 组件渲染） |
| `<!-- @api OComponentName -->`  | 插入自动生成的 API 表格（读取 `*-api.*.md`）   |

### **case**/\*.vue 写法

每个 case 文件顶部用 `<docs lang="md">` 自定义块写 Demo 说明文字，插件自动提取为 `_sfc_main.__docs`：

```vue
<docs lang="md">
<!-- zh-CN -->

### 使用

这里写中文说明...

<!-- en-US -->

### Usage

English description here...
</docs>
<script setup lang="ts">
// ...
</script>
<template>
  <!-- Demo 内容 -->
</template>
```

**Usage.vue（`@usage` 引用）** 使用 `DemoUsage` 的交互模式，需导出 `_oSchema`、`_oTemplate`（或 `_oCtx`）：

```vue
<script setup lang="ts">
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _oSchema = {
  size: { type: 'list', list: ['large', 'medium', 'small'] },
  disabled: { type: 'boolean' },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  return `<OComponent ${propsToAttrStr(props)} />`;
};
</script>
```

`schema` 类型（`DocDemoSchema`）对应的控件：

| type         | 渲染控件   |
| ------------ | ---------- |
| `'boolean'`  | 开关       |
| `'list'`     | 下拉选择   |
| `'radio'`    | 单选按钮组 |
| `'string'`   | 文本输入框 |
| `'number'`   | 数字输入框 |
| `'textarea'` | 多行文本框 |

**Case.vue（`@case` 引用）** 使用普通 SFC 写法，直接写 `<template>` 即可，无需 `_oSchema`。

## i18n

`useI18n()` 从 `locale` 导入，返回 `{ t, locale }`。语言包在 `locale/lang/`，默认 zh-CN。新增文案需同时在 zh-CN 和 en-US 中添加。
