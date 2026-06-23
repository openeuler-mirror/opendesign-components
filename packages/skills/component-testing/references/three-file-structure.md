# 三个测试文件的职责边界

> 用于：判断某个测试维度应该放哪个文件。

---

## 文件结构

```
src/<ComponentName>/__tests__/
├── OComponent.index.test.ts        # 结构 + 行为 + token wiring
├── OComponent.responsive.test.ts   # 视口 × size 尺寸数值
└── OComponent.ssr.test.ts          # SSR + hydration
```

文件名固定：`<ComponentName>.<type>.test.ts`。**只有这 3 种 type**，不要新建 `*.visual.test.ts` / `*.a11y.test.ts` 等——理由见根 SKILL.md「合并教训」段（先合再分，不要一上来就拆细）。

---

## `*.index.test.ts`

### 测什么

- **静态契约**：按 `types.ts` 的 prop 顺序，每个 prop 一条 test
  - DOM 结构（class 注入、tag 切换、内部节点出现/消失）
  - 默认值（不传该 prop 时的表现）
  - 单主题视觉语义（variant 背景/边框等，不含 THEMES 循环）

- **动态契约**：用户操作触发的状态变化
  - click / 键盘 Enter+Space
  - disabled / loading 状态阻断 emit
  - 不含 THEMES 循环的 hover/active wiring

- **视觉契约（双主题）**：所有 THEMES 循环的 token wiring 断言（从静态/动态契约中抽离）
  - color 4态 token 互不相同
  - disabled 文字色切换到 disabled token
  - hover / active 系 token 与 base 不同
  - outline 4态 border-color 两两不同

- **暴露方法**：组件通过 `defineExpose` 暴露的方法
  - `selectAll()` / `clearAll()` 等状态操作方法
  - `dataColumns` / `dataColumnMap` 等数据访问属性
  - 需用 `ref` 获取组件实例 + `await flush()` 等待 DOM 更新

- **子配置契约**（复杂组件）：组件的子配置类型（如 `DataTableColumnT`、`SelectOptionT` 等）
  - `column.fixed` / `column.width` / `column.formatter` 等（DataTable）
  - `option.disabled` / `option.label` 等（Select）
  - 每个 field 一条 test，单独一个 describe

- **插槽契约**（复杂组件）：组件提供的具名插槽
  - `slot=header` / `slot=empty` / `slot=th_${key}` 等
  - 验证插槽内容替换默认渲染

### 不测什么

- ❌ 按断点取的具体 px 数值（→ responsive）
- ❌ SSR 字符串内容（→ ssr）
- ❌ 真实 `:hover` / `:active` 后读 `borderColor`（不稳定，用 wiring 替代）
- ❌ 像素级颜色 RGB 硬编码（用 token wiring）

### 用例数

**至少 = `types.ts` 的 prop 数**。一条 test 集中断言该 prop 的所有视觉表现（不要拆成 N 条）。

复杂组件额外加上：

- 子配置类型字段数
- 插槽数量
- exposed 方法数量

### 骨架

```ts
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h, markRaw, ref } from 'vue';
import OComp from '../OComp.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { THEMES, paintThemed, isTransparent } from '../../../__tests__/_helpers/theme';

describe('静态契约（按 types.ts 属性）', () => {
  test('OComp <prop> - 各枚举值注入 o-<comp>-{prop} 类 + 默认值', async () => {
    for (const v of [
      /* enum values */
    ] as const) {
      const screen = render(OComp, { props: { [prop]: v }, slots: { default: v } });
      const el = screen.getByText(v).element() as HTMLElement;
      expect(el.classList.contains(`o-<comp>-${v}`)).toBe(true);
      // 单主题视觉语义（variant 背景/边框等）— 不含 THEMES 循环
    }
    // 默认值断言
  });
});

describe('动态契约（用户交互 → 组件响应）', () => {
  test('OComp click - 用户点击时 emit click(MouseEvent)', async () => {
    const onClick = vi.fn();
    const screen = render({ render: () => h(OComp, { onClick }, { default: () => 'X' }) });
    await screen.getByRole('button').click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // exposed 方法测试
  test('OComp exposed - <方法名> <效果>', async () => {
    const compRef = ref<any>(null);
    const screen = render({
      setup() {
        return () => h(OComp as any, { ref: compRef });
      },
    });
    await flush();
    expect(compRef.value).toBeTruthy();
    compRef.value.<方法名>();
    await flush();
    // 断言 DOM 或状态变化
  });
});

describe('视觉契约（双主题 light / dark）', () => {
  // ---- variant 视觉承载点：for-theme + 跨主题对比 ----
  for (const theme of THEMES) {
    test(`OComp variant=solid @${theme} - bg-color 解析为非透明色`, async () => {
      const screen = render(OComp, { props: { color: 'primary', variant: 'solid' } });
      const el = screen.container.querySelector('.o-<comp>') as HTMLElement;
      paintThemed(screen.container, theme, el);
      expect(isTransparent(getComputedStyle(el).backgroundColor)).toBe(false);
    });
  }

  test('OComp variant=solid color=primary - light / dark 下 backgroundColor 解析值不同', async () => {
    const lightScreen = render(OComp, { props: { color: 'primary', variant: 'solid' } });
    const darkScreen = render(OComp, { props: { color: 'primary', variant: 'solid' } });
    const elL = lightScreen.container.querySelector('.o-<comp>') as HTMLElement;
    const elD = darkScreen.container.querySelector('.o-<comp>') as HTMLElement;
    paintThemed(lightScreen.container, 'e.light', elL);
    paintThemed(darkScreen.container, 'e.dark', elD);
    expect(getComputedStyle(elL).backgroundColor).not.toBe(getComputedStyle(elD).backgroundColor);
  });

  for (const theme of THEMES) {
    test(`OComp variant=outline @${theme} - bd-color 解析为可见边框`, async () => {
      const screen = render(OComp, { props: { color: 'primary', variant: 'outline' } });
      const el = screen.container.querySelector('.o-<comp>') as HTMLElement;
      paintThemed(screen.container, theme, el);
      const cs = getComputedStyle(el);
      expect(cs.borderTopWidth).not.toBe('0px');
      expect(cs.borderTopStyle).toBe('solid');
    });
  }

  test('OComp variant=outline color=primary - light / dark 下 borderTopColor 解析值不同', async () => {
    const lightScreen = render(OComp, { props: { color: 'primary', variant: 'outline' } });
    const darkScreen = render(OComp, { props: { color: 'primary', variant: 'outline' } });
    const elL = lightScreen.container.querySelector('.o-<comp>') as HTMLElement;
    const elD = darkScreen.container.querySelector('.o-<comp>') as HTMLElement;
    paintThemed(lightScreen.container, 'e.light', elL);
    paintThemed(darkScreen.container, 'e.dark', elD);
    expect(getComputedStyle(elL).borderTopColor).not.toBe(getComputedStyle(elD).borderTopColor);
  });

  // ---- 4态 token 互不相同（双主题）----
  for (const theme of THEMES) {
    test(`OComp color @${theme} - 4 态 token 互不相同`, async () => {
      for (const c of [
        /* colors */
      ] as const) {
        const screen = render(OComp, { props: { color: c }, slots: { default: c } });
        const el = screen.getByText(c).element() as HTMLElement;
        paintThemed(screen.container, theme, el);
        const cs = getComputedStyle(el);
        const tokens = new Set([
          cs.getPropertyValue('--<comp>-color').trim(),
          cs.getPropertyValue('--<comp>-color-hover').trim(),
          cs.getPropertyValue('--<comp>-color-active').trim(),
          cs.getPropertyValue('--<comp>-color-disabled').trim(),
        ]);
        expect(tokens.size).toBe(4);
      }
    });
  }

  // ---- disabled 文字色切换（双主题 + 跨主题对比）----
  for (const theme of THEMES) {
    test(`OComp disabled @${theme} - 文字色切换到 disabled token`, async () => {
      const dis = render(OComp, { props: { disabled: true } });
      const def = render(OComp, {});
      const elDis = dis.container.querySelector('.o-<comp>') as HTMLElement;
      const elDef = def.container.querySelector('.o-<comp>') as HTMLElement;
      paintThemed(dis.container, theme, elDis);
      paintThemed(def.container, theme, elDef);
      expect(getComputedStyle(elDis).color).not.toBe(getComputedStyle(elDef).color);
    });
  }

  test('OComp disabled color=primary - light / dark 下 disabled 文字色解析值不同', async () => {
    const lightDis = render(OComp, { props: { disabled: true, color: 'primary' } });
    const darkDis = render(OComp, { props: { disabled: true, color: 'primary' } });
    const elL = lightDis.container.querySelector('.o-<comp>') as HTMLElement;
    const elD = darkDis.container.querySelector('.o-<comp>') as HTMLElement;
    paintThemed(lightDis.container, 'e.light', elL);
    paintThemed(darkDis.container, 'e.dark', elD);
    expect(getComputedStyle(elL).color).not.toBe(getComputedStyle(elD).color);
  });

  // hover / active wiring 矩阵 — 同样用 THEMES 循环
  for (const theme of THEMES) {
    test(`OComp hover wiring @${theme} - N color × M variant 矩阵下 hover 系 token 与 base 不同`, async () => {
      // ...
    });
  }
});

// 复杂组件：子配置契约（如 DataTableColumnT、SelectOptionT）
describe('子配置契约（按 <ConfigType> 字段）', () => {
  test('OComp <配置类型>.<field> - <表现>', async () => {
    // DataTable 示例：column.fixed → 注入 fixed 类与定位样式
    // Select 示例：option.disabled → 不可点击
    const screen = render(OComp, { props: { data, columns: [{ <field>: <value> }] } });
    await flush();
    // 断言子配置生效
  });
});

// 复杂组件：插槽契约
describe('插槽契约（具名插槽）', () => {
  test('OComp slot=<name> - <效果>', async () => {
    const screen = render(OComp, {
      props: { data, columns },
      slots: { <name>: () => h('div', { class: 'custom-slot' }, 'X') },
    });
    expect(screen.container.querySelector('.custom-slot')).not.toBeNull();
  });

  // 已知问题：插槽未实现
  test.fails('OComp slot=<name> - 插槽内容渲染', async () => {
    // types.ts 有定义但模板未渲染
  });
});
```

---

## `*.responsive.test.ts`

### 测什么

- 不同视口下，组件几何/字号/间距数值是否符合设计稿
- **字面 px 变量**：矩阵精确比对 `toBeCloseTo(n, 0)`
- **token 链变量**：只断言「跃迁前后值发生变化」，不硬比对绝对 px
- **级联区间**：断言无专属覆盖的区间级联自上游断点值

### 不测什么

- ❌ 颜色 / token wiring（→ index）
- ❌ 行为 / emit（→ index）
- ❌ SSR（→ ssr）

### 跑哪些视口

**完全由组件的 `style/media.scss` 决定**：

| `media.scss` 写了              | 至少跑哪些视口                 |
| ------------------------------ | ------------------------------ |
| 无                             | `desktop` 一个就够             |
| `@include respond('<=laptop')` | `desktop` + `laptop` / `pad_h` |
| `@include respond('<=pad_v')`  | 上面 + `pad_v` / `phone`       |
| `@include respond('phone')`    | 全 5 个                        |

**不强求 5 个全跑**。

### 骨架（字面 px 变量精确比对 + 级联一致性）

```ts
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { markRaw } from 'vue';
import OComp from '../OComp.vue';
import OIconRaw from '../../icon-components/OIconAdd/OIconAdd.vue';
import { BREAKPOINTS, setViewport } from '../../../__tests__/_helpers/viewport';

const OIcon = markRaw(OIconRaw);

type Metrics = { fontSize: number; iconSize: number; height: number /* 各维度数值 */ };
type SizeKey = 'large' | 'medium' | 'small';

async function renderAt(bp: keyof typeof BREAKPOINTS, size: SizeKey) {
  await setViewport(bp);
  const screen = render(OComp, { props: { size, icon: OIcon }, slots: { default: size } });
  return screen.container.querySelector('.o-<comp>') as HTMLElement;
}

function measure(el: HTMLElement): Metrics {
  const cs = getComputedStyle(el);
  return {
    fontSize: parseFloat(cs.fontSize),
    iconSize: parseFloat(cs.fontSize), // 或从 prefix 子元素读取
    height: el.getBoundingClientRect().height,
  };
}

function assertMetrics(el: HTMLElement, exp: Metrics) {
  const m = measure(el);
  expect(m.fontSize).toBeCloseTo(exp.fontSize, 0);
  expect(m.iconSize).toBeCloseTo(exp.iconSize, 0);
  expect(m.height).toBeCloseTo(exp.height, 0);
}

// 按 size 组织 STOPS 表（仅包含 media.scss 有专属覆盖的断点）
const LARGE_STOPS: Record<'desktop' | 'laptop' | 'pad_v', Metrics> = {
  desktop: { fontSize: 16, iconSize: 24, height: 40 },
  laptop: { fontSize: 14, iconSize: 20, height: 36 },
  pad_v: { fontSize: 14, iconSize: 16, height: 32 },
};

describe('响应式契约（size=large @断点矩阵）', () => {
  for (const bp of Object.keys(LARGE_STOPS) as (keyof typeof LARGE_STOPS)[]) {
    const exp = LARGE_STOPS[bp];
    test(`OComp large @${bp} - 字号${exp.fontSize}/icon${exp.iconSize}/高${exp.height}`, async () => {
      const el = await renderAt(bp, 'large');
      assertMetrics(el, exp);
    });
  }

  // 级联一致性：无专属覆盖的区间级联自上游
  test('OComp large @pad_h - 无专属覆盖，级联自 laptop', async () => {
    const el = await renderAt('pad_h', 'large');
    assertMetrics(el, LARGE_STOPS.laptop);
  });

  test('OComp large @phone - 无专属覆盖，级联自 pad_v', async () => {
    const el = await renderAt('phone', 'large');
    assertMetrics(el, LARGE_STOPS.pad_v);
  });
});

// 其他 size 同理…
```

### 骨架（token 链变量变化断言）

```ts
import { resolveTokenPx } from '../../../__tests__/_helpers/dom';

describe('响应式契约（size=large token 链跨断点）', () => {
  test('OComp large - --<comp>-icon-size 在 desktop → laptop → pad_v 各跃迁端点值变化', async () => {
    const d = resolveTokenPx(await renderAt('desktop', 'large'), '--<comp>-icon-size');
    const l = resolveTokenPx(await renderAt('laptop', 'large'), '--<comp>-icon-size');
    const pv = resolveTokenPx(await renderAt('pad_v', 'large'), '--<comp>-icon-size');
    expect(d).not.toBe(l); // icon_size-m → icon_size-s
    expect(l).not.toBe(pv); // icon_size-s → icon_size-xs
  });

  test('OComp large - fontSize 在 desktop → laptop 跨过 <=laptop 阈值时值变化', async () => {
    const d = parseFloat(getComputedStyle(await renderAt('desktop', 'large')).fontSize);
    const l = parseFloat(getComputedStyle(await renderAt('laptop', 'large')).fontSize);
    expect(d).not.toBe(l); // font_size-text1 → font_size-tip1
  });
});
```

**文件头注释模板**（每个 responsive.test.ts 必须有，说明该组件的 media.scss 结构）：

```ts
/**
 * OComp 响应式契约测试。
 *
 * --------------------------------------------------------------------------
 * 按 size 各自的 media 声明组织矩阵（关键设计原则）
 * --------------------------------------------------------------------------
 *
 * 不要不分 size 统统跑 5 视口。每个 size 在 media.scss 中实际声明了哪些 respond 块，
 * 就只对应那些视口跃迁；未声明的断点段由级联自动继承上游，单独写一条「级联一致性」
 * 用例锁定即可。
 *
 *   .o-<comp>-large    media.scss 声明 N 个 respond：…→ …个值区间
 *   .o-<comp>-medium   media.scss 声明 N 个 respond：…→ …个值区间
 *   .o-<comp>-small    media.scss 声明 N 个 respond：…→ …个值区间
 *
 * --------------------------------------------------------------------------
 * 两类断言策略
 * --------------------------------------------------------------------------
 *
 *   ① 字面 px 变量：矩阵精确比对
 *   ② token 链变量：只断言「跃迁前后值发生变化」
 *
 * 不归属本文件的维度：
 *   - 行为 / class 注入 / emit → OComp.index.test.ts
 */
```

完整示例 → [OButton.responsive.test.ts](../../../opendesign/src/button/__tests__/OButton.responsive.test.ts) / [ODataTable.responsive.test.ts](../../../opendesign/src/data-table/__tests__/ODataTable.responsive.test.ts)。

---

## `*.ssr.test.ts`

### 测什么

**两个 describe，对应 SSR 完整链路的前后两段**：

| describe           | 测什么                                             | 抓什么 bug                                                                                                                   |
| ------------------ | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **SSR 字符串渲染** | `renderToString` 不抛 + HTML 包含预期内容          | 服务端不兼容的 API（模块顶层访问 `window`/`document`、props 默认值依赖运行时环境）                                           |
| **客户端水合**     | `mount(root, true)` 后 console 无 `[Hh]ydrat` 警告 | 服务端首帧 HTML 与客户端 hydrate 时的虚拟 DOM 不一致（随机值、`Date.now()`、`v-if="isClient"`、未包 ClientOnly 的 Teleport） |

### 不测什么

- ❌ 视觉 / 像素 / 颜色
- ❌ 响应式

### 选 prop 的标准（不是每个 prop 都补）

| 应补                                                    | 理由                                       |
| ------------------------------------------------------- | ------------------------------------------ |
| 改变 DOM 结构 / 动态组件的 prop（如 `icon: Component`） | 走 `<component :is>` 路径，SSR 易错        |
| 影响内联 style 的 prop（如 `round: string`）            | CSS 变量 SSR 序列化易错点                  |
| 切换底层元素的 prop（如 `tag`, `href`）                 | 元素切换 SSR 路径不同                      |
| 用了全局 ref 的 prop（如 size 走 `defaultSize`）        | SSR 模块级状态隐患                         |
| 纯 class 注入的 prop（color / variant 等）              | **不补** — 零 SSR 风险，机械补会让信噪比差 |

### 骨架

```ts
import { test, expect, describe, afterEach } from 'vitest';
import { markRaw } from 'vue';
import OComp from '../OComp.vue';
import { renderSSR, ssrThenHydrate, spyHydrationErrors } from '../../../__tests__/_helpers/ssr';

describe('SSR 契约（字符串渲染）', () => {
  test('OComp SSR default - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OComp, {}, 'Hi')).resolves.toEqual(expect.any(String));
  });
  // 按 prop 加…
});

describe('SSR 契约（客户端水合）', () => {
  let mountedRoot: HTMLElement | null = null;

  afterEach(() => {
    if (mountedRoot) {
      mountedRoot.remove();
      mountedRoot = null;
    }
  });

  test('OComp hydration default - 无 hydration mismatch 警告', async () => {
    const spy = spyHydrationErrors();
    mountedRoot = await ssrThenHydrate(OComp, {}, 'Hi');
    expect(spy.hasHydrationMismatch()).toBe(false);
    spy.restore();
  });
  // 按 prop 加…

  // 已知问题：组件实现有 SSR bug 但暂不修复
  test.fails('OComp hydration <prop>=<value> - 无 hydration mismatch 警告', async () => {
    const spy = spyHydrationErrors();
    mountedRoot = await ssrThenHydrate(OComp, { <prop>: <value> });
    expect(spy.hasHydrationMismatch()).toBe(false);
    spy.restore();
  });
});
```

完整示例 → [OButton.ssr.test.ts](../../../opendesign/src/button/__tests__/OButton.ssr.test.ts) / [ODataTable.ssr.test.ts](../../../opendesign/src/data-table/__tests__/ODataTable.ssr.test.ts)。

---

## 决策表：测什么放哪个文件

| 想测的内容                                            | 文件              | 理由                                   |
| ----------------------------------------------------- | ----------------- | -------------------------------------- |
| `prop=X` 注入了哪个 class                             | **index**         | 静态契约                               |
| `prop=X` 默认值是什么                                 | **index**         | 静态契约                               |
| token wiring（base/hover/active/disabled 4 态不重复） | **index**         | 静态契约的视觉部分                     |
| variant 视觉语义（outline 有 border / solid 有 bg）   | **index**         | 静态契约的视觉部分                     |
| 用户点击/键盘触发某事件                               | **index**         | 动态契约                               |
| `disabled=true` 阻断 emit                             | **index**         | 动态契约                               |
| icon-only 模式宽高相等                                | **index**         | 几何契约（不属于响应式）               |
| **exposed 方法调用效果**                              | **index**         | 动态契约                               |
| **子配置字段（column.fixed / option.disabled 等）**   | **index**         | 子配置契约                             |
| **slot=header / slot=empty 替换内容**                 | **index**         | 插槽契约                               |
| `size=large @desktop` 高度 40px                       | **responsive**    | 视口数值                               |
| `size=medium @phone` 字号 14px / icon 16px            | **responsive**    | 视口数值                               |
| **token 链变量跨断点值变化**                          | **responsive**    | 视口数值（不硬比对 px）                |
| **级联区间值来自上游断点**                            | **responsive**    | 视口数值                               |
| renderToString 不抛                                   | **ssr**           | SSR 链路                               |
| hydration mismatch 警告                               | **ssr**           | SSR 链路                               |
| 像素级颜色对照设计稿                                  | ❌ **不在本框架** | E2E 截图回归                           |
| 跨浏览器渲染差异                                      | ❌ **不在本框架** | E2E                                    |
| 真实 `:active` mouse.down 后颜色变                    | ❌ **不在本框架** | E2E（vitest userEvent 无 pointer API） |
