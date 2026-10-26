/**
 * OBadge 单组件契约测试。
 *
 * 组织原则：
 *   1. 静态契约：按 types.ts prop 顺序（value / max / color / dot / offset）
 *   2. 视觉契约：双主题 color 视觉语义
 *   3. 插槽契约：default / content
 */
import { test, expect, describe } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OBadge from '../OBadge.vue';
import { THEMES, paintThemed, isTransparent } from '../../../__tests__/_helpers/theme';

describe('静态契约（按 types.ts 属性）', () => {
  test('OBadge value - 字符串值直接显示', async () => {
    const screen = render(OBadge, { props: { value: 'New' }, slots: { default: () => 'Box' } });
    const label = screen.container.querySelector('.o-badge-label');
    expect(label?.textContent).toBe('New');
  });

  test('OBadge value - 数字小于 max 时直接显示', async () => {
    const screen = render(OBadge, { props: { value: 5 }, slots: { default: () => 'B' } });
    const label = screen.container.querySelector('.o-badge-label');
    expect(label?.textContent).toBe('5');
  });

  test('OBadge value - 数字超过 max 时显示 {max}+', async () => {
    const screen = render(OBadge, { props: { value: 100, max: 99 }, slots: { default: () => 'B' } });
    const label = screen.container.querySelector('.o-badge-label');
    expect(label?.textContent).toBe('99+');
  });

  test('OBadge value - 数字等于 max 时直接显示（不超 max）', async () => {
    const screen = render(OBadge, { props: { value: 99, max: 99 }, slots: { default: () => 'B' } });
    const label = screen.container.querySelector('.o-badge-label');
    expect(label?.textContent).toBe('99');
  });

  test('OBadge max - 自定义 max 值', async () => {
    const screen = render(OBadge, { props: { value: 15, max: 10 }, slots: { default: () => 'B' } });
    const label = screen.container.querySelector('.o-badge-label');
    expect(label?.textContent).toBe('10+');
  });

  test('OBadge color - 各枚举值注入 o-badge-{color} 类，默认 primary', async () => {
    for (const c of ['primary', 'success', 'warning', 'danger'] as const) {
      const screen = render(OBadge, { props: { color: c }, slots: { default: () => 'B' } });
      const el = screen.container.querySelector('.o-badge') as HTMLElement;
      expect(el.classList.contains(`o-badge-${c}`)).toBe(true);
    }
    const def = render(OBadge, { slots: { default: () => 'B' } });
    expect((def.container.querySelector('.o-badge') as HTMLElement).classList.contains('o-badge-primary')).toBe(true);
  });

  test('OBadge dot - 注入 o-badge-dot 类且不显示内容', async () => {
    const screen = render(OBadge, { props: { dot: true }, slots: { default: () => 'B' } });
    const el = screen.container.querySelector('.o-badge') as HTMLElement;
    expect(el.classList.contains('o-badge-dot')).toBe(true);
    const label = screen.container.querySelector('.o-badge-label');
    expect(label?.textContent).toBe('');
  });

  test('OBadge offset - 数字偏移写入 style', async () => {
    const screen = render(OBadge, { props: { offset: [10, 20] }, slots: { default: () => 'B' } });
    const content = screen.container.querySelector('.o-badge-content') as HTMLElement;
    const cs = getComputedStyle(content);
    // offset [10, 20] → right: -10px, top: 20px
    expect(cs.right).toBe('-10px');
    expect(cs.top).toBe('20px');
  });

  test('OBadge offset - 字符串偏移写入 style', async () => {
    const screen = render(OBadge, { props: { offset: ['5px', '10px'] }, slots: { default: () => 'B' } });
    const content = screen.container.querySelector('.o-badge-content') as HTMLElement;
    const cs = getComputedStyle(content);
    expect(cs.right).toBe('calc(5px * -1)');
    expect(cs.top).toBe('10px');
  });

  test('OBadge - 无 default slot 时注入 o-badge-only 类', async () => {
    const screen = render(OBadge, { props: { value: '5' } });
    const el = screen.container.querySelector('.o-badge') as HTMLElement;
    expect(el.classList.contains('o-badge-only')).toBe(true);
  });

  test('OBadge - 有 default slot 时不注入 o-badge-only', async () => {
    const screen = render(OBadge, { props: { value: '5' }, slots: { default: () => 'Box' } });
    const el = screen.container.querySelector('.o-badge') as HTMLElement;
    expect(el.classList.contains('o-badge-only')).toBe(false);
  });

  test('OBadge - 渲染 sup.o-badge-content 子元素', async () => {
    const screen = render(OBadge, { props: { value: '3' }, slots: { default: () => 'B' } });
    const content = screen.container.querySelector('.o-badge-content');
    expect(content?.tagName).toBe('SUP');
  });
});

describe('视觉契约（双主题 light / dark）', () => {
  for (const theme of THEMES) {
    test(`OBadge color @${theme} - 4 color 各背景非透明`, async () => {
      for (const c of ['primary', 'success', 'warning', 'danger'] as const) {
        const screen = render(OBadge, { props: { color: c, value: '1' }, slots: { default: () => `${c}-b` } });
        const el = screen.container.querySelector('.o-badge-content') as HTMLElement;
        paintThemed(screen.container, theme, el);
        expect(isTransparent(getComputedStyle(el).backgroundColor)).toBe(false);
      }
    });
  }

  for (const theme of THEMES) {
    test(`OBadge dot @${theme} - dot 模式背景非透明`, async () => {
      const screen = render(OBadge, { props: { dot: true }, slots: { default: () => 'D' } });
      const el = screen.container.querySelector('.o-badge-content') as HTMLElement;
      paintThemed(screen.container, theme, el);
      expect(isTransparent(getComputedStyle(el).backgroundColor)).toBe(false);
    });
  }
});

describe('插槽契约（具名插槽）', () => {
  test('OBadge slot=default - 渲染默认插槽内容', async () => {
    const screen = render(OBadge, {
      props: { value: '1' },
      slots: { default: () => h('span', { class: 'box' }, 'Box') },
    });
    expect(screen.container.querySelector('.box')?.textContent).toBe('Box');
  });

  test('OBadge slot=content - 替换徽标内容', async () => {
    const screen = render(OBadge, {
      props: { value: '1' },
      slots: {
        default: () => 'Box',
        content: () => h('span', { class: 'custom-badge' }, 'Custom'),
      },
    });
    expect(screen.container.querySelector('.custom-badge')).not.toBeNull();
    expect(screen.container.querySelector('.o-badge-label')).toBeNull();
  });
});
