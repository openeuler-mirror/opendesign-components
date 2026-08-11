# 全局 TS 工具函数、Composable 与内部组件速查

> **源码位置：** `packages/opendesign/src/`
> **详细 API 文档：** [opendesign AGENTS.md → 内部共享组件 / 内部公用工具](../../opendesign/AGENTS.md)

本文档为快速发现索引。每个条目标注了源码路径，可在对应文件中查看完整实现和类型签名。

---

## 全局工具函数（`_utils/`）

> **原则：** 优先复用，禁止重新实现同类逻辑。

### `global.ts` — 全局配置 ref

| 导出            | 类型                       | 说明                                       |
| --------------- | -------------------------- | ------------------------------------------ |
| `defaultSize`   | `Ref<string>`              | 默认尺寸（`'medium'`），组件 size fallback |
| `defaultRound`  | `Ref<string \| undefined>` | 全局圆角模式（`'pill'` / `undefined`）     |
| `defaultZIndex` | `Ref<number>`              | 浮层初始 z-index（默认 1000）              |
| `mediaPoint`    | `Ref<{ phone, pad }>`      | 断点数值                                   |

### `style-class.ts` — 圆角 class 计算

```ts
import { getRoundClass } from '../../_utils/style-class';

const round = getRoundClass(props, 'select');
// round.class → computed<string>   圆角 class（如 'o_box-pill'）
// round.style → computed<string|undefined>  内联 style 覆盖
```

> 所有支持 `round` prop 的组件必须通过此函数，禁止自行计算。

### `z-index.ts` — 浮层 z-index 分配

| 导出                     | 说明                         |
| ------------------------ | ---------------------------- |
| `createTopZIndex()`      | 分配并返回下一个浮层 z-index |
| `removeZIndex(current?)` | 浮层关闭时归还               |
| `getZIndex()`            | 获取当前顶层值               |

### `helper.ts` — 通用工具

| 导出                   | 说明                                  |
| ---------------------- | ------------------------------------- |
| `debounce(fn, wait)`   | 防抖（默认首次立即执行）              |
| `debounceRAF(fn)`      | 以 requestAnimationFrame 为周期的防抖 |
| `throttleRAF(fn)`      | rAF 节流                              |
| `chunk(arr, size)`     | 数组分块                              |
| `pick(source, keys)`   | 对象字段筛选                          |
| `formateToString(val)` | 任意值转字符串                        |

### `is.ts` — 类型判断

`isString`、`isNumber`、`isBoolean`、`isArray`、`isObject`、`isFunction`、`isNil`、`isUndefined`、`isNull`、`isNumeric`

### `keycode.ts` — 键盘键值常量

`Enter`、`Esc`、`Tab`、`Space`、`ArrowUp`、`ArrowDown`、`ArrowLeft`、`ArrowRight`、`Backspace`

> 禁止在组件内硬编码键名字符串，必须从此处导入。

### `dom.ts` — DOM 工具

| 导出                         | 说明                  |
| ---------------------------- | --------------------- |
| `getScrollParents(el)`       | 获取所有可滚动祖先    |
| `getCssVariable(key, el?)`   | 读取 CSS 自定义属性值 |
| `isElementHidden(el)`        | 判断元素是否不可见    |
| `checkElementOverflow(opts)` | 检测元素是否溢出容器  |
| `scrollTo(y, opts)`          | 平滑滚动              |

### `vue-utils.ts` — VNode / Slot 工具

| 导出                              | 说明                                         |
| --------------------------------- | -------------------------------------------- |
| `isEmptySlot(slot?)`              | 判断 slot 是否为空                           |
| `getFirstElement(vn)`             | 获取 VNode 树中的第一个 HTMLElement          |
| `useSlotFirstElement()`           | composable，响应式追踪 slot 首个 DOM 元素    |
| `mergeClass(...classList)`        | 合并多种形式的 class                         |
| `getRenderableComponent(content)` | 将任意内容转为可渲染函数                     |
| `resolveHtmlElement(elRef)`       | 将 Ref/组件实例解析为 `Promise<HTMLElement>` |

### `icons.ts` — 图标 shallowRef

```ts
import { iconClose, iconChevronDown } from '../../_utils/icons';
```

> 组件内部图标统一从此处导入，支持全局替换。**禁止在组件内直接 import SVG 文件。**

### `unique-id.ts` — 唯一 id 生成

```ts
const getId = useGetUniqueId();
const id = getId(); // 如 'o-1', 'o-2', ...
```

---

## 全局 Composable（`_composables/` + `_hooks/`）

### `useFormField(props, emit)` — 表单控件接入

```ts
import { useFormField } from '../../_composables/use-form-field';

const { effectiveColor, inputId, isFocus, onFocus, onBlur, notifyChange } = useFormField(props, emit);
```

> 所有具备用户输入语义的组件（OInput、OSelect、ODatePicker 等）必须通过此 composable 接入表单系统，不要直接 inject `formItemInjectKey`。

### `useRenderWithCtx()` — 上下文继承渲染

```ts
import { useRenderWithCtx } from '../../_hooks/use-render-with-ctx';

const { renderWithCtx, mountWithCtx, cleanup } = useRenderWithCtx();
```

> 函数式弹窗、命令式 API 等组件树外挂载场景使用。在 setup 同步期捕获 `appContext + provides` 快照，使后续在非 setup 作用域中挂载的组件仍能正常 inject。

---

## 内部共享组件（`_components/`）

> **原则：** 优先复用，禁止另起炉灶。

### `InBox`（`_components/in-box`）

输入框视觉外壳。提供 size / variant / color / round / disabled / readonly 状态，不含输入逻辑。

**适用场景：** 内容自定义但需要输入框外观（DatePicker、Select、TimePicker 等）。

### `InInput`（`_components/in-input`）

在 InBox 基础上增加输入逻辑：value / placeholder / clearable / formatter / validator。

**适用场景：** 纯文本单行输入优先使用此组件。

### `InTextarea`（`_components/in-textarea`）

多行文本版本的 InInput。支持 rows / resize / minLength / maxLength / 字符计数。

### `ClientOnly`（`_components/client-only.ts`）

```vue
import ClientOnly from '../../_components/client-only.vue';

<ClientOnly>
  <OPopup>...</OPopup>
</ClientOnly>
```

> 包裹一切使用 `Teleport` 或 `OPopup` 的内容，防止 SSR hydration mismatch。

### `OPopup`（`src/popup/`）

所有浮层的底层容器。负责定位、触发、z-index、响应式（手机端自动降级为 click）。

**适用场景：** 组件自身的「展开面板」——触发元素与弹出内容是强绑定的功能关系（Select 下拉列表、DatePicker 日历等）。内容通过 `#content` slot 传入。

### `OPopover`（`src/popover/`）

OPopup 的语义封装。预设 `trigger='hover'`、带箭头、提供 `title` / `content` slot。

**适用场景：** 对某个元素的补充说明、提示气泡，内容与触发元素是「解释」关系而非功能关系。
