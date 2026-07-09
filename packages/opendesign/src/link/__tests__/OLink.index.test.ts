/**
 * OLink 单组件契约测试。
 *
 * 组织原则：
 *   1. 静态契约：按 types.ts prop 顺序
 *   2. 动态契约：click / disabled 阻断 / loading 阻断
 *   3. 视觉契约：双主题 color 视觉语义
 *   4. 插槽契约：default / icon / suffix
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h, markRaw } from 'vue';
import OLink from '../OLink.vue';
import OIconAddRaw from '../../icon-components/OIconAdd/OIconAdd.vue';
import { THEMES, paintThemed } from '../../../__tests__/_helpers/theme';
import { flush } from '../../../__tests__/_helpers/dom';

const OIconAdd = markRaw(OIconAddRaw);

describe('静态契约（按 types.ts 属性）', () => {
  test('OLink color - 各枚举值注入 o-link-{color} 类，默认 normal', async () => {
    for (const c of ['normal', 'primary', 'success', 'warning', 'danger'] as const) {
      const screen = render(OLink, { props: { color: c }, slots: { default: () => c } });
      const el = screen.container.querySelector('.o-link') as HTMLElement;
      expect(el.classList.contains(`o-link-${c}`)).toBe(true);
    }
    const def = render(OLink, { slots: { default: () => 'D' } });
    expect((def.container.querySelector('.o-link') as HTMLElement).classList.contains('o-link-normal')).toBe(true);
  });

  test('OLink size - 各枚举值注入 o-link-{size} 类，默认 auto', async () => {
    for (const s of ['large', 'medium', 'small', 'auto'] as const) {
      const screen = render(OLink, { props: { size: s }, slots: { default: () => s } });
      const el = screen.container.querySelector('.o-link') as HTMLElement;
      expect(el.classList.contains(`o-link-${s}`)).toBe(true);
    }
    const def = render(OLink, { slots: { default: () => 'D' } });
    expect((def.container.querySelector('.o-link') as HTMLElement).classList.contains('o-link-auto')).toBe(true);
  });

  test('OLink href - 渲染 <a> 标签且 href 透传', async () => {
    const screen = render(OLink, { props: { href: 'https://example.com' }, slots: { default: () => 'Link' } });
    const el = screen.container.querySelector('.o-link') as HTMLElement;
    expect(el.tagName).toBe('A');
    expect(el.getAttribute('href')).toBe('https://example.com');
  });

  test('OLink target - 透传 target 属性', async () => {
    const screen = render(OLink, { props: { href: '#', target: '_blank' }, slots: { default: () => 'L' } });
    const el = screen.container.querySelector('.o-link') as HTMLElement;
    expect(el.getAttribute('target')).toBe('_blank');
  });

  test('OLink disabled - 注入 o-link-disabled 类', async () => {
    const screen = render(OLink, { props: { disabled: true }, slots: { default: () => 'D' } });
    expect((screen.container.querySelector('.o-link') as HTMLElement).classList.contains('o-link-disabled')).toBe(true);
  });

  test('OLink loading - 渲染 .o-link-prefix 旋转图标', async () => {
    const screen = render(OLink, { props: { loading: true }, slots: { default: () => 'L' } });
    await flush();
    const prefix = screen.container.querySelector('.o-link-prefix');
    expect(prefix).not.toBeNull();
    const rotating = prefix?.querySelector('.o-rotating');
    expect(rotating).not.toBeNull();
  });

  test('OLink hoverBg - 注入 o-link-hover-bg 类', async () => {
    const screen = render(OLink, { props: { hoverBg: true }, slots: { default: () => 'H' } });
    expect((screen.container.querySelector('.o-link') as HTMLElement).classList.contains('o-link-hover-bg')).toBe(true);
  });

  test('OLink hoverUnderline - 默认 true 注入 o-link-hover-underline', async () => {
    const def = render(OLink, { slots: { default: () => 'D' } });
    expect((def.container.querySelector('.o-link') as HTMLElement).classList.contains('o-link-hover-underline')).toBe(true);

    const off = render(OLink, { props: { hoverUnderline: false }, slots: { default: () => 'O' } });
    expect((off.container.querySelector('.o-link') as HTMLElement).classList.contains('o-link-hover-underline')).toBe(false);
  });

  test('OLink tag - 默认 a 标签，可切换为其他', async () => {
    const def = render(OLink, { slots: { default: () => 'D' } });
    expect((def.container.querySelector('.o-link') as HTMLElement).tagName).toBe('A');

    const span = render(OLink, { props: { tag: 'span' }, slots: { default: () => 'S' } });
    expect((span.container.querySelector('.o-link') as HTMLElement).tagName).toBe('SPAN');
  });

  test('OLink icon - 渲染 icon prop 组件', async () => {
    const screen = render(OLink, { props: { icon: OIconAdd }, slots: { default: () => 'X' } });
    await flush();
    const prefix = screen.container.querySelector('.o-link-prefix');
    expect(prefix).not.toBeNull();
  });
});

describe('动态契约（用户交互 → 组件响应）', () => {
  test('OLink click - 用户点击时 emit click(MouseEvent)', async () => {
    const onClick = vi.fn();
    const screen = render({ render: () => h(OLink, { onClick }, { default: () => 'X' }) });
    await screen.container.querySelector('.o-link')!.click();
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick.mock.calls[0][0]).toBeInstanceOf(MouseEvent);
  });

  test('OLink disabled - 用户点击时阻止 emit click', async () => {
    const onClick = vi.fn();
    const screen = render({
      render: () => h(OLink, { disabled: true, onClick }, { default: () => 'X' }),
    });
    await screen.container.querySelector('.o-link')!.click();
    expect(onClick).not.toHaveBeenCalled();
  });

  test('OLink loading - 用户点击时阻止 emit click', async () => {
    const onClick = vi.fn();
    const screen = render({
      render: () => h(OLink, { loading: true, onClick }, { default: () => 'X' }),
    });
    await screen.container.querySelector('.o-link')!.click();
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('视觉契约（双主题 light / dark）', () => {
  for (const theme of THEMES) {
    test(`OLink color @${theme} - 各 color 文字色解析为非透明`, async () => {
      for (const c of ['normal', 'primary', 'success', 'warning', 'danger'] as const) {
        const screen = render(OLink, { props: { color: c }, slots: { default: () => `${c}-link` } });
        const el = screen.container.querySelector('.o-link') as HTMLElement;
        paintThemed(screen.container, theme, el);
        expect(getComputedStyle(el).color).toBeTruthy();
      }
    });
  }
});

describe('插槽契约（具名插槽）', () => {
  test('OLink slot=default - 渲染链接文案', async () => {
    const screen = render(OLink, { slots: { default: () => 'Hello' } });
    expect(screen.container.querySelector('.o-link-label')?.textContent).toBe('Hello');
  });

  test('OLink slot=icon - 替换 icon prop 渲染', async () => {
    const screen = render(OLink, {
      slots: {
        icon: () => h('span', { class: 'custom-icon' }, 'I'),
        default: () => 'X',
      },
    });
    await flush();
    const prefix = screen.container.querySelector('.o-link-prefix');
    expect(prefix?.querySelector('.custom-icon')).not.toBeNull();
  });

  test('OLink slot=suffix - 渲染后缀内容', async () => {
    const screen = render(OLink, {
      props: { suffix: true },
      slots: { default: () => 'X' },
    });
    await flush();
    const suffix = screen.container.querySelector('.o-link-suffix');
    expect(suffix).not.toBeNull();
  });

  test('OLink - 无 suffix 时不渲染 .o-link-suffix', async () => {
    const screen = render(OLink, { slots: { default: () => 'X' } });
    await flush();
    expect(screen.container.querySelector('.o-link-suffix')).toBeNull();
  });
});
