/**
 * OTag 单组件契约测试。
 *
 * 组织原则：
 *   1. 静态契约：按 types.ts prop 顺序（color / variant / size / round / closable / visible / defaultVisible / beforeClose）
 *   2. 动态契约：close 事件 / visible 双向绑定 / beforeClose 钩子
 *   3. 视觉契约：双主题 token wiring
 *   4. 插槽契约：default / icon
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h, ref } from 'vue';
import OTag from '../OTag.vue';
import { THEMES, paintThemed, isTransparent } from '../../../__tests__/_helpers/theme';
import { flush } from '../../../__tests__/_helpers/dom';

describe('静态契约（按 types.ts 属性）', () => {
  test('OTag color - 各枚举值注入 o-tag-{color} 类，默认 normal', async () => {
    for (const c of ['normal', 'info', 'primary', 'success', 'warning', 'danger'] as const) {
      const screen = render(OTag, { props: { color: c }, slots: { default: () => c } });
      const el = screen.container.querySelector('.o-tag') as HTMLElement;
      expect(el.classList.contains(`o-tag-${c}`)).toBe(true);
    }
    const def = render(OTag, { slots: { default: () => 'D' } });
    expect((def.container.querySelector('.o-tag') as HTMLElement).classList.contains('o-tag-normal')).toBe(true);
  });

  test('OTag variant - solid / outline 注入类，默认 solid', async () => {
    for (const v of ['solid', 'outline'] as const) {
      const screen = render(OTag, { props: { variant: v }, slots: { default: () => v } });
      const el = screen.container.querySelector('.o-tag') as HTMLElement;
      expect(el.classList.contains(`o-tag-${v}`)).toBe(true);
    }
    const def = render(OTag, { slots: { default: () => 'D' } });
    expect((def.container.querySelector('.o-tag') as HTMLElement).classList.contains('o-tag-solid')).toBe(true);
  });

  test('OTag size - large / medium / small 注入类，默认 large', async () => {
    for (const s of ['large', 'medium', 'small'] as const) {
      const screen = render(OTag, { props: { size: s }, slots: { default: () => s } });
      const el = screen.container.querySelector('.o-tag') as HTMLElement;
      expect(el.classList.contains(`o-tag-${s}`)).toBe(true);
    }
    const def = render(OTag, { slots: { default: () => 'D' } });
    expect((def.container.querySelector('.o-tag') as HTMLElement).classList.contains('o-tag-large')).toBe(true);
  });

  test('OTag round - pill 注入 round-pill 类', async () => {
    const screen = render(OTag, { props: { round: 'pill' }, slots: { default: () => 'P' } });
    const el = screen.container.querySelector('.o-tag') as HTMLElement;
    expect(el.classList.contains('o-tag-round-pill')).toBe(true);
  });

  test('OTag closable - 注入 o-tag-closable 类并渲染关闭按钮', async () => {
    const screen = render(OTag, { props: { closable: true }, slots: { default: () => 'C' } });
    const el = screen.container.querySelector('.o-tag') as HTMLElement;
    expect(el.classList.contains('o-tag-closable')).toBe(true);
    expect(el.querySelector('.o-tag-close')).not.toBeNull();
  });

  test('OTag visible - 默认可见', async () => {
    const screen = render(OTag, { slots: { default: () => 'V' } });
    expect(screen.container.querySelector('.o-tag')).not.toBeNull();
  });

  test('OTag visible=false - 不渲染', async () => {
    const screen = render(OTag, { props: { visible: false }, slots: { default: () => 'H' } });
    expect(screen.container.querySelector('.o-tag')).toBeNull();
  });

  test('OTag defaultVisible=false - 不渲染', async () => {
    const screen = render(OTag, { props: { defaultVisible: false }, slots: { default: () => 'H' } });
    expect(screen.container.querySelector('.o-tag')).toBeNull();
  });

  test('OTag 根元素为 span', async () => {
    const screen = render(OTag, { slots: { default: () => 'X' } });
    const el = screen.container.querySelector('.o-tag');
    expect(el?.tagName).toBe('SPAN');
  });
});

describe('动态契约（用户交互 → 组件响应）', () => {
  test('OTag close - 点击关闭按钮 emit close 事件', async () => {
    const onClose = vi.fn();
    const screen = render({
      render: () => h(OTag, { closable: true, onClose }, { default: () => 'X' }),
    });
    await flush();
    const closeBtn = screen.container.querySelector('.o-tag-close') as HTMLElement;
    await userEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('OTag close - 点击关闭后 emit update:visible=false', async () => {
    const onUpdateVisible = vi.fn();
    const screen = render({
      render: () => h(OTag, { closable: true, 'onUpdate:visible': onUpdateVisible }, { default: () => 'X' }),
    });
    await flush();
    const closeBtn = screen.container.querySelector('.o-tag-close') as HTMLElement;
    await userEvent.click(closeBtn);
    expect(onUpdateVisible).toHaveBeenCalledWith(false);
  });

  test('OTag close - 关闭后 DOM 中移除标签', async () => {
    const screen = render(OTag, { props: { closable: true }, slots: { default: () => 'X' } });
    await flush();
    expect(screen.container.querySelector('.o-tag')).not.toBeNull();
    const closeBtn = screen.container.querySelector('.o-tag-close') as HTMLElement;
    await userEvent.click(closeBtn);
    await flush();
    expect(screen.container.querySelector('.o-tag')).toBeNull();
  });

  test('OTag beforeClose - 返回 true 时关闭', async () => {
    const beforeClose = vi.fn(() => true);
    const screen = render(OTag, {
      props: { closable: true, beforeClose },
      slots: { default: () => 'X' },
    });
    await flush();
    const closeBtn = screen.container.querySelector('.o-tag-close') as HTMLElement;
    await userEvent.click(closeBtn);
    await flush();
    expect(beforeClose).toHaveBeenCalled();
    expect(screen.container.querySelector('.o-tag')).toBeNull();
  });

  test('OTag beforeClose - 返回 false 时不关闭', async () => {
    const beforeClose = vi.fn(() => false);
    const screen = render(OTag, {
      props: { closable: true, beforeClose },
      slots: { default: () => 'X' },
    });
    await flush();
    const closeBtn = screen.container.querySelector('.o-tag-close') as HTMLElement;
    await userEvent.click(closeBtn);
    await flush();
    expect(beforeClose).toHaveBeenCalled();
    expect(screen.container.querySelector('.o-tag')).not.toBeNull();
  });
});

describe('视觉契约（双主题 light / dark）', () => {
  for (const theme of THEMES) {
    test(`OTag variant=solid @${theme} - 背景非透明`, async () => {
      const screen = render(OTag, { props: { variant: 'solid', color: 'primary' }, slots: { default: () => 'S' } });
      const el = screen.container.querySelector('.o-tag') as HTMLElement;
      paintThemed(screen.container, theme, el);
      expect(isTransparent(getComputedStyle(el).backgroundColor)).toBe(false);
    });
  }

  for (const theme of THEMES) {
    test(`OTag variant=outline @${theme} - 背景透明 + 有边框`, async () => {
      const screen = render(OTag, { props: { variant: 'outline', color: 'primary' }, slots: { default: () => 'O' } });
      const el = screen.container.querySelector('.o-tag') as HTMLElement;
      paintThemed(screen.container, theme, el);
      const cs = getComputedStyle(el);
      expect(isTransparent(cs.backgroundColor)).toBe(true);
      expect(cs.borderTopWidth).not.toBe('0px');
    });
  }
});

describe('插槽契约（具名插槽）', () => {
  test('OTag slot=default - 渲染标签内容', async () => {
    const screen = render(OTag, { slots: { default: () => 'Hello' } });
    const label = screen.container.querySelector('.o-tag-label');
    expect(label?.textContent).toBe('Hello');
  });

  test('OTag slot=icon - 渲染图标插槽', async () => {
    const screen = render(OTag, {
      slots: {
        icon: () => h('span', { class: 'custom-icon' }, 'I'),
        default: () => 'Text',
      },
    });
    const iconWrap = screen.container.querySelector('.o-tag-icon');
    expect(iconWrap?.querySelector('.custom-icon')).not.toBeNull();
  });

  test('OTag - 无 icon slot 时不渲染 .o-tag-icon', async () => {
    const screen = render(OTag, { slots: { default: () => 'X' } });
    expect(screen.container.querySelector('.o-tag-icon')).toBeNull();
  });
});
