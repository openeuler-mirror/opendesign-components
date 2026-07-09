/**
 * ODivider 单组件契约测试。
 *
 * 组织原则：
 *   1. 静态契约：按 types.ts 的 prop 顺序，每个 prop 一条用例
 *   2. 视觉契约：双主题下 variant 视觉语义
 *   3. 插槽契约：default 插槽渲染标签内容
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import ODivider from '../ODivider.vue';
import { THEMES, paintThemed, isTransparent } from '../../../__tests__/_helpers/theme';

describe('静态契约（按 types.ts 属性）', () => {
  test('ODivider variant - 各枚举值注入 o-divider-{variant} 类，默认 solid', async () => {
    for (const v of ['solid', 'dashed', 'dotted'] as const) {
      const screen = render(ODivider, { props: { variant: v } });
      const el = screen.container.querySelector('.o-divider') as HTMLElement;
      expect(el.classList.contains(`o-divider-${v}`)).toBe(true);
    }
    const def = render(ODivider, {});
    expect((def.container.querySelector('.o-divider') as HTMLElement).classList.contains('o-divider-solid')).toBe(true);
  });

  test('ODivider direction - h/v 注入对应类，默认 h', async () => {
    const hScreen = render(ODivider, { props: { direction: 'h' } });
    expect((hScreen.container.querySelector('.o-divider') as HTMLElement).classList.contains('o-divider-h')).toBe(true);

    const vScreen = render(ODivider, { props: { direction: 'v' } });
    expect((vScreen.container.querySelector('.o-divider') as HTMLElement).classList.contains('o-divider-v')).toBe(true);

    const def = render(ODivider, {});
    expect((def.container.querySelector('.o-divider') as HTMLElement).classList.contains('o-divider-h')).toBe(true);
  });

  test('ODivider labelPosition - 有 slot 时注入 o-divider-label-{position} 类', async () => {
    for (const p of ['left', 'center', 'right'] as const) {
      const screen = render(ODivider, { props: { labelPosition: p }, slots: { default: () => 'Label' } });
      const el = screen.container.querySelector('.o-divider') as HTMLElement;
      expect(el.classList.contains(`o-divider-label-${p}`)).toBe(true);
    }
    // 默认 center
    const def = render(ODivider, { slots: { default: () => 'L' } });
    expect((def.container.querySelector('.o-divider') as HTMLElement).classList.contains('o-divider-label-center')).toBe(true);
  });

  test('ODivider darker - 注入 o-divider-darker 类', async () => {
    const screen = render(ODivider, { props: { darker: true } });
    expect((screen.container.querySelector('.o-divider') as HTMLElement).classList.contains('o-divider-darker')).toBe(true);

    const def = render(ODivider, {});
    expect((def.container.querySelector('.o-divider') as HTMLElement).classList.contains('o-divider-darker')).toBe(false);
  });

  test('ODivider role - 根元素有 role=separator', async () => {
    const screen = render(ODivider, {});
    const el = screen.container.querySelector('.o-divider') as HTMLElement;
    expect(el.getAttribute('role')).toBe('separator');
  });

  test('ODivider direction=h - 渲染 .o-divider-line 子元素', async () => {
    const screen = render(ODivider, { props: { direction: 'h' } });
    const lines = screen.container.querySelectorAll('.o-divider-line');
    expect(lines.length).toBe(1);
  });

  test('ODivider direction=h + slot - 渲染两条 line + label', async () => {
    const screen = render(ODivider, {
      props: { direction: 'h' },
      slots: { default: () => 'Text' },
    });
    const lines = screen.container.querySelectorAll('.o-divider-line');
    expect(lines.length).toBe(2);
    const label = screen.container.querySelector('.o-divider-label');
    expect(label?.textContent).toBe('Text');
  });
});

describe('视觉契约（双主题 light / dark）', () => {
  for (const theme of THEMES) {
    test(`ODivider variant=solid @${theme} - line 有可见边框`, async () => {
      const screen = render(ODivider, { props: { variant: 'solid', direction: 'h' } });
      const el = screen.container.querySelector('.o-divider-line') as HTMLElement;
      paintThemed(screen.container, theme, el);
      const cs = getComputedStyle(el);
      // solid 分割线应有可见的 border-top 或 background
      expect(cs.borderTopWidth).not.toBe('0px');
    });
  }

  for (const theme of THEMES) {
    test(`ODivider darker @${theme} - darker 模式边框颜色与普通模式不同`, async () => {
      const dark = render(ODivider, { props: { darker: true } });
      const normal = render(ODivider, {});
      const elDark = dark.container.querySelector('.o-divider-line') as HTMLElement;
      const elNormal = normal.container.querySelector('.o-divider-line') as HTMLElement;
      paintThemed(dark.container, theme, elDark);
      paintThemed(normal.container, theme, elNormal);
      // darker 和 normal 的视觉表现应不同
      const csDark = getComputedStyle(elDark);
      const csNormal = getComputedStyle(elNormal);
      // 至少一个属性不同
      const isDifferent = csDark.borderTopColor !== csNormal.borderTopColor;
      expect(isDifferent).toBe(true);
    });
  }
});

describe('插槽契约（具名插槽）', () => {
  test('ODivider slot=default - 渲染标签内容', async () => {
    const screen = render(ODivider, {
      slots: { default: () => h('span', { class: 'custom' }, 'Custom') },
    });
    const label = screen.container.querySelector('.o-divider-label');
    expect(label?.querySelector('.custom')?.textContent).toBe('Custom');
  });

  test('ODivider - 无 slot 时不渲染 label', async () => {
    const screen = render(ODivider, {});
    expect(screen.container.querySelector('.o-divider-label')).toBeNull();
  });
});
