/**
 * OButton 单组件契约测试（功能 + 视觉合一）。
 *
 * 组织原则（同 ODataTable 范本）：
 *   1. 静态契约：按 types.ts 的 prop 顺序，每个 prop 一条用例
 *      - DOM 结构 / class 注入（功能契约）
 *      - 默认值 / 单主题视觉语义（variant 背景/边框等）
 *   2. 动态契约：用户操作触发的状态变化
 *      - 事件 emit（click / keyboard）
 *      - disabled / loading 对 click 的拦截
 *   3. 视觉契约：双主题 light / dark 下 token wiring
 *      - color 4态 token 互不相同
 *      - disabled 文字色切换到 disabled token
 *      - hover / active 系 token 与 base 不同
 *      - outline 4态 border-color 两两不同
 *   4. 插槽契约：具名插槽渲染替换
 *      - default / icon / suffix
 *
 * 命名规范：OButton <prop / 场景> - <中文描述>
 *
 * 不归属本文件的维度：
 *   - 按断点取的尺寸数值（fontSize / icon / padding / height）→ OButton.responsive.test.ts
 *   - SSR 字符串渲染 + hydration mismatch                  → OButton.ssr.test.ts
 *   - 像素级渲染 / 跨浏览器渲染差异                          → E2E 截图回归
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h, markRaw } from 'vue';
import OButton from '../OButton.vue';
import OForm from '../../form/OForm.vue';
import OIconAddRaw from '../../icon-components/OIconAdd/OIconAdd.vue';
import { THEMES, paintThemed, isTransparent } from '../../../__tests__/_helpers/theme';

const OIconAdd = markRaw(OIconAddRaw);

// ============================================================================
// 静态契约：按 types.ts 的 prop 顺序，每个 prop 一条用例
//
// 只验 DOM 结构 / class 注入 / 默认值 / 单主题视觉语义（variant 背景透明等），
// 双主题 token wiring 断言统一移至「视觉契约」块。
// ============================================================================
describe('静态契约（按 types.ts 属性）', () => {
  test('OButton color - 各枚举值注入 o-btn-{color} 类，未传时默认 normal', async () => {
    for (const c of ['normal', 'primary', 'success', 'warning', 'danger', 'brand'] as const) {
      const screen = render(OButton, { props: { color: c }, slots: { default: c } });
      const el = screen.getByText(c).element() as HTMLElement;
      expect(el.classList.contains(`o-btn-${c}`)).toBe(true);
    }
    const def = render(OButton, { slots: { default: 'def' } });
    expect((def.getByText('def').element() as HTMLElement).classList.contains('o-btn-normal')).toBe(true);
  });

  test('OButton variant - 各枚举值注入 o-btn-{variant} 类 + 渲染产物符合 variant 语义，默认 outline', async () => {
    for (const v of ['solid', 'outline', 'text'] as const) {
      const screen = render(OButton, { props: { variant: v, color: 'primary' }, slots: { default: v } });
      const el = screen.getByText(v).element() as HTMLElement;
      expect(el.classList.contains(`o-btn-${v}`)).toBe(true);
      const cs = getComputedStyle(el);
      if (v === 'outline') {
        expect(cs.borderTopWidth).toBe('1px');
        expect(cs.borderTopStyle).toBe('solid');
        expect(isTransparent(cs.backgroundColor)).toBe(true);
      } else if (v === 'solid') {
        expect(isTransparent(cs.backgroundColor)).toBe(false);
      } else {
        expect(isTransparent(cs.backgroundColor)).toBe(true);
        expect(cs.paddingLeft).toBe('0px');
      }
    }
    const def = render(OButton, { slots: { default: 'def' } });
    expect((def.getByText('def').element() as HTMLElement).classList.contains('o-btn-outline')).toBe(true);
  });

  test('OButton color=brand variant=solid - 背景使用 linear-gradient + border 为 none', async () => {
    const screen = render(OButton, { props: { color: 'brand', variant: 'solid' }, slots: { default: 'B' } });
    const el = screen.getByRole('button').element() as HTMLElement;
    const cs = getComputedStyle(el);
    expect(cs.backgroundImage).toContain('gradient');
    expect(cs.borderTopWidth).toBe('0px');
  });

  test('OButton size - 各枚举值注入 o-btn-{size} 类，未显式时取 defaultSize=medium', async () => {
    for (const s of ['large', 'medium', 'small'] as const) {
      const screen = render(OButton, { props: { size: s }, slots: { default: s } });
      const el = screen.getByText(s).element() as HTMLElement;
      expect(el.classList.contains(`o-btn-${s}`)).toBe(true);
    }
    const def = render(OButton, { slots: { default: 'def' } });
    expect((def.getByText('def').element() as HTMLElement).classList.contains('o-btn-medium')).toBe(true);
  });

  test('OButton round - pill 注入 class + 自定义值写入 --btn-radius 内联样式', async () => {
    const pill = render(OButton, { props: { round: 'pill', size: 'large' }, slots: { default: 'p' } });
    const pillEl = pill.getByText('p').element() as HTMLElement;
    expect(pillEl.classList.contains('o-btn-round-pill')).toBe(true);
    expect(parseFloat(getComputedStyle(pillEl).borderTopLeftRadius)).toBeGreaterThanOrEqual(20);

    const custom = render(OButton, { props: { round: '12px' }, slots: { default: 'c' } });
    const customEl = custom.getByText('c').element() as HTMLElement;
    expect(customEl.classList.contains('o-btn-round-pill')).toBe(false);
    expect(customEl.style.getPropertyValue('--btn-radius')).toBe('12px');
    expect(getComputedStyle(customEl).borderTopLeftRadius).toBe('12px');
  });

  test('OButton loading - 渲染 .o-btn-prefix.loading + 旋转动画运行 + 覆盖 icon slot', async () => {
    const screen = render(OButton, {
      props: { loading: true },
      slots: { default: 'X', icon: () => h('span', { 'data-slot-icon': 'true' }, 'I') },
    });
    const el = screen.getByRole('button').element() as HTMLElement;
    expect(el.querySelector('.o-btn-prefix.loading')).not.toBeNull();
    const rotating = el.querySelector('.o-rotating') as HTMLElement;
    expect(rotating).not.toBeNull();
    expect(getComputedStyle(rotating).animationName).not.toBe('none');
    expect(el.querySelector('[data-slot-icon="true"]')).toBeNull();
  });

  test('OButton disabled - 注入 o-btn-disabled 类 + 不透传原生 disabled 属性', async () => {
    const dis = render(OButton, { props: { disabled: true, color: 'primary' }, slots: { default: 'D' } });
    const elDis = dis.container.querySelector('.o-btn') as HTMLButtonElement;
    expect(elDis.classList.contains('o-btn-disabled')).toBe(true);
    expect(elDis.hasAttribute('disabled')).toBe(false);
  });

  test('OButton size/round/disabled - 继承自 OForm（未显式传时取表单值）', async () => {
    const screen = render({
      render: () =>
        h(
          OForm,
          { model: {}, size: 'small', round: '4px', disabled: true },
          {
            default: () => h(OButton, {}, { default: () => 'Submit' }),
          },
        ),
    });
    const btn = screen.container.querySelector('.o-btn') as HTMLElement;
    expect(btn).not.toBeNull();
    expect(btn.classList.contains('o-btn-small')).toBe(true);
    expect(btn.style.getPropertyValue('--btn-radius')).toBe('4px');
    expect(btn.classList.contains('o-btn-disabled')).toBe(true);
  });

  test('OButton href - 渲染 <a> 标签且 href 透传，强覆盖 tag prop', async () => {
    const screen = render(OButton, {
      props: { href: 'https://example.com', tag: 'button' },
      slots: { default: 'Link' },
    });
    const el = screen.getByRole('link').element() as HTMLAnchorElement;
    expect(el.tagName).toBe('A');
    expect(el.getAttribute('href')).toBe('https://example.com');
  });

  test('OButton icon - 仅 icon 时推导 icon-only + variant=text + 几何为正方形；与 default slot 共存时不推导', async () => {
    const only = render(OButton, { props: { icon: OIconAdd } });
    const elOnly = only.container.querySelector('.o-btn') as HTMLElement;
    expect(elOnly.classList.contains('o-btn-icon-only')).toBe(true);
    expect(elOnly.classList.contains('o-btn-text')).toBe(true);
    const rect = elOnly.getBoundingClientRect();
    expect(rect.width).toBeCloseTo(rect.height, 0);

    const both = render(OButton, { props: { icon: OIconAdd }, slots: { default: 'X' } });
    const elBoth = both.container.querySelector('.o-btn') as HTMLElement;
    expect(elBoth.classList.contains('o-btn-icon-only')).toBe(false);
    expect(elBoth.classList.contains('o-btn-outline')).toBe(true);

    const explicit = render(OButton, { props: { icon: OIconAdd, variant: 'solid' } });
    const elExplicit = explicit.container.querySelector('.o-btn') as HTMLElement;
    expect(elExplicit.classList.contains('o-btn-solid')).toBe(true);
    expect(elExplicit.classList.contains('o-btn-text')).toBe(false);
  });

  test('OButton tag - 切换底层 DOM 元素，默认 button 时附 type="button"', async () => {
    const def = render(OButton, { slots: { default: 'def' } });
    const elDef = def.getByRole('button').element() as HTMLButtonElement;
    expect(elDef.tagName).toBe('BUTTON');
    expect(elDef.getAttribute('type')).toBe('button');

    const divCase = render(OButton, { props: { tag: 'div' }, slots: { default: 'div' } });
    const elDiv = divCase.getByText('div').element() as HTMLElement;
    expect(elDiv.tagName).toBe('DIV');
    expect(elDiv.getAttribute('type')).toBe('');
  });
});

// ============================================================================
// 动态契约：用户操作 → 组件响应（emit + 行为拦截）
//
// 只验 emit / 行为拦截，不含 THEMES 循环的视觉 token wiring 断言。
// hover/active 视觉切换的 token wiring → 视觉契约块。
// ============================================================================
describe('动态契约（用户交互 → 组件响应）', () => {
  test('OButton click - 用户点击时 emit click(MouseEvent)', async () => {
    const onClick = vi.fn();
    const screen = render({ render: () => h(OButton, { onClick }, { default: () => 'X' }) });
    await screen.getByRole('button').click();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
  });

  test('OButton disabled - 用户点击时阻止 emit click', async () => {
    const onClick = vi.fn();
    const screen = render({
      render: () => h(OButton, { disabled: true, onClick }, { default: () => 'X' }),
    });
    await screen.getByRole('button').click();
    expect(onClick).not.toHaveBeenCalled();
  });

  test('OButton loading - 用户点击时阻止 emit click', async () => {
    const onClick = vi.fn();
    const screen = render({
      render: () => h(OButton, { loading: true, onClick }, { default: () => 'X' }),
    });
    await screen.getByRole('button').click();
    expect(onClick).not.toHaveBeenCalled();
  });

  test('OButton keyboard - 焦点状态按 Enter / Space 触发 click', async () => {
    const onClick = vi.fn();
    const screen = render({ render: () => h(OButton, { onClick }, { default: () => 'X' }) });
    const btn = screen.getByRole('button').element() as HTMLButtonElement;
    btn.focus();
    await userEvent.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledTimes(1);
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
  });
});

// ============================================================================
// 双主题视觉契约：light / dark 下读 token wiring，确保两主题各自解析正确且互不相同
//
// 组织原则（同 ODataTable 范本）：
//   每个「视觉承载点」拆为 for-theme 循环用例：
//     证明在 light 和 dark 下 token 都解析为合理值（非透明 / 可见 / 互不相同）
//     注：跨主题对比（light ≠ dark）仅适用于两主题确实不同色的属性，
//         OButton 的 primary 系 token 在 e.light 和 e.dark 下设计为同色值，
//         故不做 light≠dark 断言。
//
// 视觉承载点（按 variant × color 语义）：
//   - solid bg-color：5 color × 2 theme 各解析为非透明色
//   - outline bd-color：5 color × 2 theme 各解析为可见边框
//   - 4态 token（color/bd-color/bg-color）：互不相同（6 color × 2 theme）
//   - disabled 文字色：切换到 disabled token
//   - hover / active wiring：6 color × 3 variant 矩阵下与 base 不同
//   - outline 状态层级：4态 border-color 两两不同
//
// 颜色断言策略：用 `getPropertyValue('--token').trim()` 比较 token 字面值。
// 跨主题对比仅适用于两主题确实不同色的属性（如 ODataTable header bg），
// OButton 的 primary 系 token 在两主题下设计为同色值，不做 light≠dark 断言。
//
// 不归属本文件：按断点取的尺寸数值 → responsive.test.ts
// ============================================================================
describe('视觉契约（双主题 light / dark）', () => {
  // ---- solid 背景非透明（双主题各自解析正确）----
  for (const theme of THEMES) {
    test(`OButton variant=solid @${theme} - 5 color 各 bg-color 解析为非透明色`, async () => {
      for (const c of ['normal', 'primary', 'success', 'warning', 'danger'] as const) {
        const screen = render(OButton, { props: { color: c, variant: 'solid' }, slots: { default: `${c}-s` } });
        const el = screen.container.querySelector('.o-btn') as HTMLElement;
        paintThemed(screen.container, theme, el);
        expect(isTransparent(getComputedStyle(el).backgroundColor)).toBe(false);
      }
    });
  }

  // ---- outline 边框可见（双主题各自解析正确）----
  for (const theme of THEMES) {
    test(`OButton variant=outline @${theme} - 5 color 各 bd-color 解析为可见边框`, async () => {
      for (const c of ['normal', 'primary', 'success', 'warning', 'danger'] as const) {
        const screen = render(OButton, { props: { color: c, variant: 'outline' }, slots: { default: `${c}-o` } });
        const el = screen.container.querySelector('.o-btn') as HTMLElement;
        paintThemed(screen.container, theme, el);
        const cs = getComputedStyle(el);
        expect(cs.borderTopWidth).not.toBe('0px');
        expect(cs.borderTopStyle).toBe('solid');
      }
    });
  }

  // ---- 4态 token 互不相同（双主题）----
  for (const theme of THEMES) {
    test(`OButton color @${theme} - 各枚举值注入 o-btn-{color} 类 + 4 态 token 互不相同`, async () => {
      for (const c of ['normal', 'primary', 'success', 'warning', 'danger', 'brand'] as const) {
        const screen = render(OButton, { props: { color: c }, slots: { default: c } });
        const el = screen.getByText(c).element() as HTMLElement;
        paintThemed(screen.container, theme, el);
        const cs = getComputedStyle(el);
        const tokens = new Set([
          cs.getPropertyValue('--btn-color').trim(),
          cs.getPropertyValue('--btn-color-hover').trim(),
          cs.getPropertyValue('--btn-color-active').trim(),
          cs.getPropertyValue('--btn-color-disabled').trim(),
        ]);
        expect(tokens.size).toBe(4);
      }
    });
  }

  // ---- disabled 文字色切换（双主题各自解析正确）----
  for (const theme of THEMES) {
    test(`OButton disabled @${theme} - 文字色切换到 disabled token（与 enabled 不同）`, async () => {
      const dis = render(OButton, { props: { disabled: true, color: 'primary' }, slots: { default: 'D' } });
      const def = render(OButton, { props: { color: 'primary' }, slots: { default: 'def' } });
      const elDis = dis.container.querySelector('.o-btn') as HTMLButtonElement;
      const elDef = def.container.querySelector('.o-btn') as HTMLButtonElement;
      paintThemed(dis.container, theme, elDis);
      paintThemed(def.container, theme, elDef);
      expect(getComputedStyle(elDis).color).not.toBe(getComputedStyle(elDef).color);
    });
  }

  // ---- hover wiring 矩阵（双主题）----
  // hover/active 都不依赖真实事件触发，统一走 token wiring 断言：
  //   - 真实 hover：在 vitest test:ui 面板下用户鼠标位置不可控
  //   - 真实 :active：vitest-browser 无 userEvent.pointer，按住不释放语义无法稳定模拟
  // 像素级 :hover / :active 视觉切换由 E2E 截图回归兜底。
  for (const theme of THEMES) {
    test(`OButton hover wiring @${theme} - 6 color × 3 variant 矩阵下 hover 系 token 与 base 不同`, async () => {
      for (const c of ['normal', 'primary', 'success', 'warning', 'danger', 'brand'] as const) {
        for (const v of ['outline', 'solid', 'text'] as const) {
          const screen = render(OButton, { props: { color: c, variant: v }, slots: { default: `${c}-${v}` } });
          const el = screen.container.querySelector('.o-btn') as HTMLElement;
          paintThemed(screen.container, theme, el);
          const cs = getComputedStyle(el);

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
  }

  // ---- active wiring 矩阵（双主题）----
  for (const theme of THEMES) {
    test(`OButton active wiring @${theme} - 6 color × 3 variant 矩阵下 active 系 token 与 base 不同`, async () => {
      for (const c of ['normal', 'primary', 'success', 'warning', 'danger', 'brand'] as const) {
        for (const v of ['outline', 'solid', 'text'] as const) {
          const screen = render(OButton, { props: { color: c, variant: v }, slots: { default: `${c}-${v}` } });
          const el = screen.container.querySelector('.o-btn') as HTMLElement;
          paintThemed(screen.container, theme, el);
          const cs = getComputedStyle(el);

          if (v === 'outline') {
            expect(cs.getPropertyValue('--btn-bd-color-active').trim()).not.toBe(cs.getPropertyValue('--btn-bd-color').trim());
          } else if (v === 'solid') {
            const prop = c === 'brand' ? '--btn-bg-image' : '--btn-bg-color';
            expect(cs.getPropertyValue(`${prop}-active`).trim()).not.toBe(cs.getPropertyValue(prop).trim());
          } else {
            expect(cs.getPropertyValue('--btn-color-active').trim()).not.toBe(cs.getPropertyValue('--btn-color').trim());
          }
        }
      }
    });
  }

  // ---- 状态层级（双主题）----
  for (const theme of THEMES) {
    test(`OButton 状态层级 @${theme} - outline 4 态（base/hover/active/disabled）的 border-color token 两两不同`, async () => {
      const screen = render(OButton, { props: { color: 'primary', variant: 'outline' }, slots: { default: '4' } });
      const el = screen.container.querySelector('.o-btn') as HTMLElement;
      paintThemed(screen.container, theme, el);
      const cs = getComputedStyle(el);
      const borders = new Set([
        cs.getPropertyValue('--btn-bd-color').trim(),
        cs.getPropertyValue('--btn-bd-color-hover').trim(),
        cs.getPropertyValue('--btn-bd-color-active').trim(),
        cs.getPropertyValue('--btn-bd-color-disabled').trim(),
      ]);
      expect(borders.size).toBe(4);
    });
  }
});

// ============================================================================
// 插槽契约：OButton 提供 default / icon / suffix 三个具名插槽
//
// 这一块测的是「插槽位被正确替换」的渲染契约
// ============================================================================
describe('插槽契约（具名插槽）', () => {
  test('OButton slot=default - 渲染 slot 文案内容', async () => {
    const screen = render(OButton, { slots: { default: () => 'Hello' } });
    expect(screen.getByText('Hello').element()).not.toBeNull();
  });

  test('OButton slot=icon - 替换 icon prop 渲染，loading 时 icon slot 被强制替换为旋转图标', async () => {
    // 非 loading：icon slot 替代 icon prop
    const screen = render(OButton, {
      slots: {
        icon: () => h('span', { class: 'custom-slot-icon' }, 'SI'),
        default: () => 'X',
      },
    });
    const el = screen.container.querySelector('.o-btn') as HTMLElement;
    expect(el.querySelector('.custom-slot-icon')).not.toBeNull();
    expect(el.querySelector('.custom-slot-icon')?.textContent).toBe('SI');

    // loading 时 icon slot 被覆盖为旋转图标
    const loadingScreen = render(OButton, {
      props: { loading: true },
      slots: {
        icon: () => h('span', { 'data-slot-icon': 'true' }, 'I'),
        default: () => 'X',
      },
    });
    const loadingEl = loadingScreen.container.querySelector('.o-btn') as HTMLElement;
    expect(loadingEl.querySelector('[data-slot-icon="true"]')).toBeNull();
    expect(loadingEl.querySelector('.o-rotating')).not.toBeNull();
  });

  test('OButton slot=suffix - 渲染 .o-btn-suffix 容器及 slot 内容', async () => {
    const screen = render(OButton, {
      slots: {
        suffix: () => h('span', { class: 'custom-suffix' }, 'S'),
        default: () => 'X',
      },
    });
    const el = screen.getByRole('button').element() as HTMLElement;
    const suffixWrap = el.querySelector('.o-btn-suffix');
    expect(suffixWrap).not.toBeNull();
    expect(suffixWrap?.querySelector('.custom-suffix')?.textContent).toBe('S');
  });

  test('OButton slot=suffix - 未传 suffix slot时不渲染 .o-btn-suffix 容器', async () => {
    const screen = render(OButton, { slots: { default: () => 'X' } });
    const el = screen.getByRole('button').element() as HTMLElement;
    expect(el.querySelector('.o-btn-suffix')).toBeNull();
  });
});
