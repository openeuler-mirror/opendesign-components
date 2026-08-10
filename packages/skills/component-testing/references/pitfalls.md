# 测试踩坑速查

> 用于：测试失败 / 行为诡异时第一个看的文档。按现象找匹配项，定位真因 + 修法。

---

## 一、Playwright Locator 相关

### Strict mode violation：同一 test 多次 `render()` 后选择器报 ≥2 个匹配

**现象**：

```
Error: strict mode violation: locator('body').getByText('D') resolved to 2 elements
```

**真因**：vitest-browser-vue 的 `screen.getByText` / `getByRole` 是 Playwright Locator，在 body 范围搜索。一个 test 内多次 `render()` 会把多个组件挂到 body，匹配 ≥2 个就 fail。

**修法**：用各自 wrapper 的 `container.querySelector` 从自己根节点取：

```ts
// ❌ 跨 wrapper strict mode 冲突
const dis = render(OComp, { props: { disabled: true }, slots: { default: 'D' } });
const def = render(OComp, { slots: { default: 'D' } }); // 同文案撞车
const elDis = dis.getByText('D').element(); // 从 body 搜，命中 2 个 → fail

// ✅ 各自 container 取根节点
const elDis = dis.container.querySelector('.o-<comp>') as HTMLElement;
const elDef = def.container.querySelector('.o-<comp>') as HTMLElement;
```

适用所有需要**并排对比两个 wrapper** 的测试（disabled vs 默认、light vs dark、hover before vs after）。

---

## 二、视觉断言时序相关

### hover 后立刻读 `borderColor` 拿到旧值（过渡中间值）

**现象**：

```ts
const before = getComputedStyle(el).borderTopColor;
await btn.hover();
const after = getComputedStyle(el).borderTopColor;
expect(after).not.toBe(before); // ❌ 挂：before === after
```

**真因**：`style.scss` 一般有 `transition: all var(--o-duration-s)`，hover 触发后边框颜色处于过渡中，立刻读到的是过渡起点。

**修法 1**：禁用 transition 后再读

```ts
el.style.transition = 'none';
const before = getComputedStyle(el).borderTopColor;
await btn.hover();
const after = getComputedStyle(el).borderTopColor;
expect(after).not.toBe(before); // ✓
```

**修法 2（推荐）**：直接断言 token wiring，不依赖事件触发——参见 [visual-contract.md](./visual-contract.md) 策略 3。

### `pnpm test:ui` 面板里 hover 测试红色，CLI 跑过

**现象**：CLI `pnpm test:run` 全过，开 UI 模式 `pnpm test:ui` 同一个用例红色。

**真因**：UI 模式下浏览器面板里用户鼠标位置不可控——可能已经悬停在 button 上：

1. `before` 读到的就是 hover 色
2. `await btn.hover()` 把 Playwright 鼠标移到 button 中心，颜色不变
3. `after === before` → 断言失败

**修法**：所有 hover/active 测试**统一改用 token wiring 断言**（[visual-contract.md](./visual-contract.md) 策略 3），不再用真实 `hover()`。这是项目层面的决定。

---

## 三、伪类相关（：active / :focus-visible）

### `:active` 怎么也触发不到

**真因**：

- `userEvent.pointer / mouse.down` API 在 vitest-browser 不存在
- `dispatchEvent('mousedown')` 不会触发 `:active` 伪类（伪类由浏览器内部管理）
- 键盘 `'{Space>}'` 仅在 focus 时短暂触发 `:active`，读 computed style 时机不稳定

**修法**：用 active wiring 矩阵替代真实触发，参见 [visual-contract.md](./visual-contract.md) 策略 3。

### `:focus-visible` 触发后 outline 没出现

**真因**：`:focus-visible` 只在"非鼠标 focus"时触发（键盘 Tab、JS focus）。`userEvent.click()` 或鼠标交互后 focus 不一定触发。

**修法**：用 `userEvent.tab()` 或 `el.focus()` 主动设 focus，但断言时机仍可能不稳。**推荐**：跟 hover/active 一样走 wiring 断言。

---

## 四、组件 / Vue 相关

### Vue warn：`received a Component that was made a reactive object`

**现象**：

```
[Vue warn]: Vue received a Component that was made a reactive object.
This can lead to unnecessary performance overhead and should be avoided by
marking the component with `markRaw` or using `shallowRef` instead of `ref`.
```

**真因**：把 Vue 组件直接传给 prop（如 `icon: OIconAdd`），Vue 把组件本身变成响应式对象。

**修法**：`markRaw` 包一下

```ts
import { markRaw } from 'vue';
import OIconAddRaw from '../../icon-components/OIconAdd/OIconAdd.vue';

const OIconAdd = markRaw(OIconAddRaw);

render(OComp, { props: { icon: OIconAdd } }); // ✓ 无 warn
```

### 空 `<svg>` 把按钮撑到 ~300px 宽

**真因**：HTML 规范规定 SVG 没有 `width`/`height` 属性也没 CSS 时，**intrinsic size = 300×150**（跟 `<img>` 没 src 时一样）。`.o-btn` 的 `height: var(--btn-height)` 锁死了高度，但 width 是 content-based，所以只在横向被撑长。

**修法**：用真实 icon 组件（带 `.o-svg-icon` class，全局 `width:1em; height:1em`）

```ts
import OIconAddRaw from '../../icon-components/OIconAdd/OIconAdd.vue';
const OIconAdd = markRaw(OIconAddRaw);
// 不要用 IconStub = markRaw({ render: () => h('svg') })
```

### `new MouseEvent(type, { pageX, pageY })` 报 TS2353

**现象**：

```
TS2353: Object literal may only specify known properties, and 'pageX' does not exist in type 'MouseEventInit'.
```

**真因**：DOM 规范的 `MouseEventInit` 类型未声明 `pageX`/`pageY`（它们是 `MouseEvent` 实例上的只读属性，不属于 init dict），但 jsdom / 浏览器运行时**确实支持**从构造参数注入。TypeScript 的对象字面量冗余属性检查拦截了这个赋值。

**修法**：用 `createMouseEvent` helper（位于 `__tests__/_helpers/dom.ts`），通过中间变量绕过冗余属性检查：

```ts
import { createMouseEvent } from '../../../__tests__/_helpers/dom';

// ❌ TS2353
container.dispatchEvent(new MouseEvent('mousedown', { pageX: 100, pageY: 100, bubbles: true }));

// ✅ 类型安全 + 运行时正确
container.dispatchEvent(createMouseEvent('mousedown', 100, 100, { bubbles: true }));
```

**适用场景**：任何需要模拟鼠标拖拽 / 点击坐标的交互测试（如 image-viewer 的拖拽缩放、figure 的预览交互等）。组件读取 `e.pageX`/`e.pageY` 时必须用此 helper 设置坐标，否则 jsdom 默认 `pageX = 0` 会导致拖拽偏移为零。

---

## 五、CSS 变量 / 属性相关

### `style.borderRadius` 是空字符串

**真因**：opendesign 的 `round` prop 把值写入 CSS 自定义属性（`--<comp>-radius`），不直接 set 到 `border-radius`。

**修法 1**：断言 inline style 上的 CSS 变量

```ts
expect(customEl.style.getPropertyValue('--<comp>-radius')).toBe('12px');
```

**修法 2**：断言 cascade 后的真实值

```ts
expect(getComputedStyle(customEl).borderTopLeftRadius).toBe('12px');
```

### disabled prop 在 DOM 上找不到 `disabled` 属性

**真因**：opendesign 的 disabled 仅注入 class + onClick 内部 `preventDefault`，**不透传 HTML 原生 disabled 属性**。

**修法**：断言 class 而非 attribute

```ts
expect(el.classList.contains('o-<comp>-disabled')).toBe(true);
// ❌ 不要 expect(el.hasAttribute('disabled')).toBe(true)
```

**a11y 隐患**：screen reader 不会读出 disabled 状态、键盘 Tab 仍能聚焦。这是已知 L1 级问题，未来修改 button 实现后测试也要同步改。

### token wiring 断言全部相等（4 态 Set.size === 1）

**真因**：jsdom 环境下 `getPropertyValue('--var')` 返回空字符串，所有空字符串去重后 size === 1。

**修法**：**确认在 vitest browser mode 而非 jsdom**。检查 vitest.config.ts 应该有：

```ts
import { playwright } from '@vitest/browser-playwright'

browser: {
  enabled: true,
  provider: playwright(),
}
```

---

## 六、环境 / 设置相关

### Browser Mode 下样式全没 / Token 报错

**真因**：`dist/index.css` 缺失。`setup.ts` 第一行 `import '../dist/index.css'`，没构建过该文件会报错。

**修法**：

```bash
pnpm -C packages/opendesign build:style
```

### `afterEach(() => document.body.innerHTML = '')` 卸载报错

**真因**：Vitest 每个测试后自动卸载组件，提前清空 body 会破坏 Vue unmount 流程。

**修法**：**禁止这么做**。需要清理副作用挂载（如 `ssrHydrateAndCompare` 的 root）改用专门的 ref：

```ts
let mountedRoot: HTMLElement | null = null;
afterEach(() => {
  if (mountedRoot) {
    mountedRoot.remove();
    mountedRoot = null;
  }
});
```

注意：`ssrHydrateAndCompare` 返回的对象含 `root` 属性，赋给 `mountedRoot` 即可在 afterEach 中清理。

### 组件卸载后事件监听 / ResizeObserver 未清理（内存泄漏）

**现象**：组件多次挂载/卸载后，事件监听或 ResizeObserver 持续累积不释放。

**真因**：`onMounted` 回调中使用 `Promise.then()` / `await` 延续异步逻辑，在该延续中调用 `useEventListener` / `useResizeObserver` 等 VueUse composable。此时组件 effect scope 已关闭（Vue 的 `injectHook` 在回调同步返回后立即 `scope.off()`），`tryOnScopeDispose` 返回 `false`，清理函数不被注册。组件卸载时 `scope.stop()` 无法触发清理。

**修法**：捕获 composable 返回的 stop 函数，在 `onUnmounted` 中手动调用。详细原理与修复手法见 [clean-code: async-scope-cleanup.md](../../clean-code/references/async-scope-cleanup.md)。测试方法见 [resource-cleanup.md](./resource-cleanup.md)。

---

## 七、其他

### Vitest UI 面板里有些 ct 测试看不到

**真因**：`*.ct.test.ts`（如果有）由 playwright-ct 跑，不在 vitest 体系下；vitest.config.ts 的 `exclude` 把它过滤掉了。

**修法**：项目当前**没有 ct 测试**，所有测试走 vitest browser mode 一套。如果未来有 ct，需要单独的 `pnpm test:ct` 入口。

### `count()` 不自动等待 SPA 渲染完成

**修法**：用 `toHaveCount(n)` 替代（内置 retry），或先 `await expect(locator.first()).toBeVisible()` 等待第一个出现。

### 绝对定位元素跑出容器外但 `toBeVisible()` 通过

**真因**：Playwright 的 `toBeVisible()` 不检查是否在视口内。

**修法**：`position:absolute/fixed` 元素额外用 `boundingBox()` 校验位置，或 `toBeInViewport()`。

---

## 八、异步渲染 / exposed 方法相关

### 调用 exposed 方法后立即断言，DOM 还没更新

**现象**：

```ts
tableRef.value.selectAll();
const checked = screen.container.querySelectorAll('input:checked');
expect(checked.length).toBe(data.length); // ❌ 失败：checked.length === 0
```

**真因**：exposed 方法触发 Vue 状态更新，DOM 更新需要经过 `nextTick` + `requestAnimationFrame`。

**修法**：每次 DOM 改变后 `await flush()`：

```ts
import { flush } from '../../../__tests__/_helpers/dom';

tableRef.value.selectAll();
await flush(); // ← 必须
const checked = screen.container.querySelectorAll('input:checked');
expect(checked.length).toBe(data.length); // ✓
```

### OScroller / OPopup / useElementBounding 组件渲染不稳定

**现象**：初始渲染后断言定位/尺寸失败。

**真因**：这些组件依赖 `ResizeObserver` / `requestAnimationFrame` 异步计算布局。

**修法**：渲染后 `await flush()` 再断言：

```ts
const screen = render(ODataTable, { props: { data, columns } });
await flush(); // ← OScroller 稳定后再取 DOM
const root = screen.container.querySelector('.o-data-table');
```

---

## 九、响应式测试相关

### token 链变量跨断点值相同（如 --table-radius）

**现象**：

```ts
const d = resolveTokenPx(await renderAt('desktop', 'medium'), '--table-radius');
const l = resolveTokenPx(await renderAt('laptop', 'medium'), '--table-radius');
expect(d).not.toBe(l); // ❌ 失败：d === l === 4px
```

**真因**：当前主题的 `radius_control-m` 与 `radius_control-s` 别名指向同一个 px 值（4px）。CSSOM 已解析为实际 px，运行时拿不到差异。

**修法**：跳过该跃迁断言，添加注释说明待主题区分后再补：

```ts
// 当前主题 radius_control-m 与 radius_control-s 别名同为 4px，
// 运行时拿不到差异。待主题侧区分开后再补该跃迁断言。
test.todo('ODataTable medium - --table-radius 在 laptop → pad_h 跨过 <=pad 阈值时值变化');
```

### 级联区间断言失败

**现象**：`pad_v` 断言值与 `pad_h` 不同，但 media.scss 未声明 `@<=pad_v`。

**真因**：可能误用了错误的 EXPECTED 表，或组件继承了其他变量的值。

**修法**：检查 media.scss 实际覆盖的 respond 块，只断言有声明覆盖的区间 + 无声明的级联区间。

---

## 十、已知问题标记

### 插槽测试 fail 但 types.ts 有定义

**现象**：传入 slot 函数未被调用。

**真因**：types.ts 定义了插槽类型，但组件模板未实际渲染 `<slot name="xxx">`。

**修法**：用 `test.fails` 标记，锁定当前行为：

```ts
// ⚠️ 已知 L1 偏差：types.ts 定义了 td_${string} 插槽，但模板未渲染
// 标 test.fails 锁定行为，待组件侧补 slot 输出后改回普通断言
test.fails('ODataTable slot=td_${key} - 替换指定列每一行的单元格内容', async () => {
  const screen = render(ODataTable, {
    props: { data, columns },
    slots: { td_email: ({ cellValue }) => h('a', `→${cellValue}`) },
  });
  expect(screen.container.querySelectorAll('a').length).toBe(data.length);
});
```

---

## 十一、排查顺序（L0~L3）

测试失败时按下表顺序排查，**不要直接改测试值让它过**：

| Level                    | 现象                                      | 修哪里                                 |
| ------------------------ | ----------------------------------------- | -------------------------------------- |
| **L0** 测试本身错        | 选择器写错、断言期望值与设计稿/Token 不符 | 修 `*.test.ts`                         |
| **L1** 组件 API 设计偏差 | prop 名/类型/默认值不符合预期             | 修 `src/<comp>/types.ts`               |
| **L2** 组件实现 bug      | 渲染/事件/状态机错                        | 先在测试里 reproduce，再修 `OComp.vue` |
| **L3** Skill / 文档错    | 描述的 class/prop 与源码不符              | 同步修文档 + 当前测试                  |

**例外**：若设计稿和现有组件实现真冲突（Token 错、设计稿过时），属于 L1.5 → 拉 owner 决策，不擅自改测试。
