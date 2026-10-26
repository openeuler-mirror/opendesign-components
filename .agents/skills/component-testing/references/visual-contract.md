# 视觉契约断言策略

> 用于：判断颜色 / 状态 / 视觉相关的断言怎么写才稳。

---

## 核心原则：**不硬编码 RGB**

| 反模式                                     | 问题                                                              |
| ------------------------------------------ | ----------------------------------------------------------------- |
| `expect(cs.color).toBe('rgb(0, 47, 167)')` | token 调一下就全挂；视觉迁移到新主题完全不能维护                  |
| `expect(cs.borderColor).toBe('#002fa7')`   | 同上 + 浏览器返回 rgb 不返回 hex，根本不会过                      |
| 真实 `hover()` 后读 `borderColor` 对比变化 | `transition: all` 让读到的是过渡中间值；UI 模式下用户鼠标位置影响 |

**改用 4 种稳定策略**：

---

## 策略 1：variant 语义契约（默认态视觉特征）

每个 variant 有明确的视觉特征，断言这些特征**存在**而非具体颜色值：

```ts
const cs = getComputedStyle(el);
if (variant === 'outline') {
  expect(cs.borderTopWidth).toBe('1px'); // 必有边框
  expect(cs.borderTopStyle).toBe('solid');
  expect(isTransparent(cs.backgroundColor)).toBe(true); // 背景透明
} else if (variant === 'solid') {
  expect(isTransparent(cs.backgroundColor)).toBe(false); // 必有非透明背景
} else {
  // text
  expect(isTransparent(cs.backgroundColor)).toBe(true);
  expect(cs.paddingLeft).toBe('0px'); // text 无 padding
}
```

**判断透明辅助**（已提取到 [`_helpers/theme.ts`](../../../opendesign/__tests__/_helpers/theme.ts)）：

```ts
import { isTransparent } from '../../../__tests__/_helpers/theme';
```

**特殊形态例外**：单独写一条 test，不要塞进矩阵循环。例：

```ts
test('OButton color=brand variant=solid - 背景使用 linear-gradient（特殊形态）', async () => {
  // .o-btn-brand 强制 border: none + 渐变背景
  expect(cs.backgroundImage).toContain('gradient');
  expect(cs.borderTopWidth).toBe('0px');
});
```

---

## 策略 2：4 态 token 互不相同

证明用户**视觉上能区分**默认/hover/active/disabled 4 种状态，但不绑定具体 RGB：

```ts
const cs = getComputedStyle(el);
const tokens = new Set([
  cs.getPropertyValue('--btn-color').trim(),
  cs.getPropertyValue('--btn-color-hover').trim(),
  cs.getPropertyValue('--btn-color-active').trim(),
  cs.getPropertyValue('--btn-color-disabled').trim(),
]);
expect(tokens.size).toBe(4);
```

**为什么这是有用的契约**：如果有人把 `--btn-color-active` 不小心写成跟 `--btn-color` 同一个 token，用户按下按钮**没有视觉反馈**，单测照样过——除非有这条断言。

---

## 策略 3：状态 wiring 矩阵（替代真实事件触发）

**`:hover` 和 `:active` 都不要依赖真实事件触发**（理由见下方），统一用 CSS 变量层断言：

```ts
test('OComp hover wiring - N color × M variant 矩阵下 hover 系 token 与 base 不同', async () => {
  for (const c of [
    /* colors */
  ] as const) {
    for (const v of [
      /* variants */
    ] as const) {
      const screen = render(OComp, { props: { color: c, variant: v } });
      const el = screen.container.querySelector('.o-<comp>') as HTMLElement;
      const cs = getComputedStyle(el);

      // 按 variant 选承载状态的属性
      if (v === 'outline') {
        expect(cs.getPropertyValue('--btn-bd-color-hover').trim()).not.toBe(cs.getPropertyValue('--btn-bd-color').trim());
      } else if (v === 'solid') {
        const prop = c === 'brand' ? '--btn-bg-image' : '--btn-bg-color';
        expect(cs.getPropertyValue(`${prop}-hover`).trim()).not.toBe(cs.getPropertyValue(prop).trim());
      } else {
        expect(cs.getPropertyValue('--btn-color-hover').trim()).not.toBe(cs.getPropertyValue('--btn-color').trim());
      }
    }
  }
});
```

### 不同 variant 的「状态承载属性」

| variant | 状态承载属性                           | 例外                                 |
| ------- | -------------------------------------- | ------------------------------------ |
| outline | `--btn-bd-color`（边框承载，文字也变） | —                                    |
| solid   | `--btn-bg-color`（背景承载）           | brand+solid 是 `--btn-bg-image` 渐变 |
| text    | `--btn-color`（文字承载）              | —                                    |

**示例**：brand+solid 走渐变 → 用 `--btn-bg-image-active` 与 `--btn-bg-image` 比，不能用 `--btn-bg-color`（会拿到 `none` 字符串）。

---

## 策略 4：状态层级（4 态可分辨性细化版）

聚焦单一 variant + 单一 color，验证 4 态在承载属性上**全部不重复**：

```ts
test('OComp 状态层级 - outline 4 态（base/hover/active/disabled）的 border-color token 两两不同', async () => {
  const cs = getComputedStyle(el);
  const borders = new Set([
    cs.getPropertyValue('--btn-bd-color').trim(),
    cs.getPropertyValue('--btn-bd-color-hover').trim(),
    cs.getPropertyValue('--btn-bd-color-active').trim(),
    cs.getPropertyValue('--btn-bd-color-disabled').trim(),
  ]);
  expect(borders.size).toBe(4);
});
```

跟策略 2 类似，但锁定到 variant + 承载属性。互补使用。

---

## 为什么不真实触发 `:hover` / `:active`

| 状态             | 不能真实触发的原因                                                                                                                                                                                               |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `:hover`         | **UI 模式下用户鼠标位置不可控**——可能已经悬在 button 上，`before === after === hover 色`，断言失败。CLI 模式过、UI 模式挂，是同一段代码                                                                          |
| `:active`        | vitest-browser 的 `userEvent` **没有 `pointer/mouse.down` API**；`dispatchEvent('mousedown')` 不触发 `:active` 伪类（伪类由浏览器内部管理）；键盘 `'{Space>}'` 仅在 focus 时短暂触发，读 computed style 时机不稳 |
| `:focus-visible` | 可以用 `userEvent.tab()` 触发，但断言时机仍不稳定                                                                                                                                                                |
| `:disabled`      | DOM attribute，不属于伪类问题——本项目 disabled 不透传原生属性，靠 class，看 [pitfalls.md](./pitfalls.md)                                                                                                         |

**像素级真实状态切换 → 兜底给 E2E 截图回归**。

---

## 双主题（light + dark）双跑

**样式相关测试必须在 light + dark 两个主题下都跑**——dark 主题 token 解析值不同，wiring 在 light 通过不代表 dark 也通过（可能 dark 漏配某态、写错指向等）。

### 前提：两个主题 CSS 都加载

[`setup.ts`](../../../opendesign/__tests__/setup.ts) 已经同时 import 了 e.light 和 e.dark：

```ts
import '@opensig/opendesign-token/themes/e.light.token.css';
import '@opensig/opendesign-token/themes/e.dark.token.css';
document.documentElement.setAttribute('data-o-theme', 'e.light'); // 默认 light
```

### 范式：scope 主题到 wrapper container（推荐）

**不要动 `document.documentElement.setAttribute`**（污染全局 + 跨 test 残留）。挂到 container：CSS 变量通过继承到 button，同时用 fill1 token 给 container 一个主题色背景，UI 面板里 light/dark 视觉反差明显。

```ts
import { THEMES, paintThemed } from '../../../__tests__/_helpers/theme';

for (const theme of THEMES) {
  test(`OComp <场景> @${theme} - <断言摘要>`, async () => {
    const screen = render(OComp, { props: {...} });
    const el = screen.container.querySelector('.o-<comp>') as HTMLElement;
    paintThemed(screen.container, theme, el);

    const cs = getComputedStyle(el);
    // wiring 断言不变，token 解析值会随主题变
  });
}
```

**为什么挂 container 不只挂 button**：button 自己挂 attribute 已经能让断言通过（token 在 button scope 内解析正确），但 UI 面板里看到的还是白底 + 蓝按钮，light 和 dark 视觉几乎一致。container 挂 attribute + 设主题背景色，能让 UI 面板里 light=浅灰底、dark=深黑底，**一眼看清主题切换**。

### 多元素对比场景（如 disabled vs default）

两个 wrapper 各自挂主题：

```ts
for (const theme of THEMES) {
  test(`OComp disabled @${theme} - 文字色切换`, async () => {
    const dis = render(OComp, { props: { disabled: true } });
    const def = render(OComp, {});
    const elDis = dis.container.querySelector('.o-<comp>') as HTMLElement;
    const elDef = def.container.querySelector('.o-<comp>') as HTMLElement;
    paintThemed(dis.container, theme, elDis); // 两个都要
    paintThemed(def.container, theme, elDef);
    expect(getComputedStyle(elDis).color).not.toBe(getComputedStyle(elDef).color);
  });
}
```

### 哪些测试要双主题，哪些不用

| 类别                              | 是否双主题 | 例子                                                              |
| --------------------------------- | ---------- | ----------------------------------------------------------------- |
| **读 token 解析值的 wiring 断言** | ✅ 必须    | 4 态 token Set / hover wiring / active wiring / 状态层级          |
| **比较两个元素颜色不同**          | ✅ 必须    | disabled vs default 文字色                                        |
| **variant 视觉承载点解析值**      | ✅ 必须    | solid bg 非透明 / outline bd 可见                                 |
| **跨主题对比（light ≠ dark）**    | ✅ 条件性  | 仅当两主题确实不同色时补（如 ODataTable header bg）；同色值时不做 |

**简单判定**：测试里有 `getPropertyValue('--xxx')` 或 `getComputedStyle().color/border-color/background-color` 这类**读颜色/token 的操作** → 必须双主题；只有 `classList.contains` / `getAttribute` / `tagName` / 数值 → 单 light 够用。

### 跨主题对比范式（条件性）

**跨主题对比仅适用于两主题确实使用不同色值的属性**。如果主题设计对某 token 在 light 和 dark 下使用相同色值（如 OButton 的 `--o-color-primary1`），则不做 light≠dark 断言——token 对应什么色值就是什么色值。

ODataTable 的 header 背景 token 在两主题下确实不同色，所以跨主题对比有效。OButton 的 primary 系 token 在两主题下设计为同色值，跨主题对比不适用。

```ts
// 适用于两主题不同色的属性：for-theme 循环 + 跨主题对比
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
```

### 完整示例

参见 [OButton.index.test.ts](../../../opendesign/src/button/__tests__/OButton.index.test.ts) 视觉契约块里的 variant 承载点 + 跨主题对比 + 4态 token + disabled + hover/active wiring 等用例。

参见 [ODataTable.index.test.ts](../../../opendesign/src/data-table/__tests__/ODataTable.index.test.ts) 视觉契约块里的 headerStyle=fill/border=all/stripe/loading + 跨主题对比用例。

---

## 唯一可以真实触发的状态：`disabled`

不是伪类，靠 class 切换。直接 mount 两个 wrapper 对比：

```ts
test('OComp disabled - 文字色切换到 disabled token', async () => {
  // 多次 render 时用 wrapper.container 取自己的根节点（strict mode 避坑）
  const dis = render(OComp, { props: { disabled: true } });
  const def = render(OComp, {});
  const elDis = dis.container.querySelector('.o-<comp>') as HTMLElement;
  const elDef = def.container.querySelector('.o-<comp>') as HTMLElement;
  expect(getComputedStyle(elDis).color).not.toBe(getComputedStyle(elDef).color);
});
```

---

## 几何契约（不是颜色但仍是视觉）

| 维度             | 怎么断言                                                                                                    |
| ---------------- | ----------------------------------------------------------------------------------------------------------- |
| 圆角 pill 形态   | `parseFloat(cs.borderTopLeftRadius) >= 20`（pill 量级远大于普通圆角）                                       |
| 自定义 round 值  | `cs.borderTopLeftRadius` === 设计值（如 `'12px'`）+ `el.style.getPropertyValue('--<comp>-radius')` 校验注入 |
| icon-only 正方形 | `rect.width.toBeCloseTo(rect.height, 0)`                                                                    |
| 动画在跑         | `cs.animationName !== 'none'`（不需要等动画完成，知道在跑就行）                                             |
| 元素是否可见     | 用 `expect(locator).toBeVisible()`，**不要**手算 boundingBox                                                |

---

## 决策表

| 想测什么                              | 用哪个策略                    |
| ------------------------------------- | ----------------------------- |
| outline / solid / text 的视觉特征     | 策略 1（variant 语义）        |
| 4 种状态在该 color 下颜色不同         | 策略 2（4 态 token Set.size） |
| 全 color × variant 矩阵的 hover 链路  | 策略 3（hover wiring 矩阵）   |
| 全 color × variant 矩阵的 active 链路 | 策略 3（active wiring 矩阵）  |
| 4 态在承载属性上两两可分辨            | 策略 4（状态层级）            |
| disabled 视觉切换                     | 真实 render 对比              |
| 像素级 hover/active 真实切换          | ❌ 不做（E2E）                |
| 跨浏览器渲染                          | ❌ 不做（E2E）                |
