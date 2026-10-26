/**
 * ORate 单组件契约测试。
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h } from 'vue';
import ORate from '../ORate.vue';
import { THEMES, paintThemed } from '../../../__tests__/_helpers/theme';
import { flush } from '../../../__tests__/_helpers/dom';

describe('静态契约（按 types.ts 属性）', () => {
  test('ORate count - 默认 5，渲染对应数量的图标项', async () => {
    const screen = render(ORate, {});
    await flush();
    const items = screen.container.querySelectorAll('.o-rate-item');
    expect(items.length).toBe(5);
  });

  test('ORate count=10 - 渲染 10 个图标项', async () => {
    const screen = render(ORate, { props: { count: 10 } });
    await flush();
    const items = screen.container.querySelectorAll('.o-rate-item');
    expect(items.length).toBe(10);
  });

  test('ORate defaultValue - 默认 0', async () => {
    const screen = render(ORate, {});
    await flush();
    const fullItems = screen.container.querySelectorAll('.o-rate-item-status-full');
    expect(fullItems.length).toBe(0);
  });

  test('ORate defaultValue=3 - 3 个 full 状态', async () => {
    const screen = render(ORate, { props: { defaultValue: 3 } });
    await flush();
    const fullItems = screen.container.querySelectorAll('.o-rate-item-status-full');
    expect(fullItems.length).toBe(3);
  });

  test('ORate modelValue - 受控模式', async () => {
    const screen = render(ORate, { props: { modelValue: 2 } });
    await flush();
    const fullItems = screen.container.querySelectorAll('.o-rate-item-status-full');
    expect(fullItems.length).toBe(2);
  });

  test('ORate color - 注入 o-rate-{color} 类', async () => {
    const screen = render(ORate, { props: { color: 'danger' } });
    await flush();
    expect((screen.container.querySelector('.o-rate') as HTMLElement).classList.contains('o-rate-danger')).toBe(true);
  });

  test('ORate readonly - 注入 o-rate-readonly 类', async () => {
    const screen = render(ORate, { props: { readonly: true } });
    await flush();
    expect((screen.container.querySelector('.o-rate') as HTMLElement).classList.contains('o-rate-readonly')).toBe(true);
  });

  test('ORate allowHalf=true - 支持半选', async () => {
    const screen = render(ORate, { props: { allowHalf: true, defaultValue: 2.5 } });
    await flush();
    const halfItems = screen.container.querySelectorAll('.o-rate-item-status-half');
    expect(halfItems.length).toBe(1);
    const fullItems = screen.container.querySelectorAll('.o-rate-item-status-full');
    expect(fullItems.length).toBe(2);
  });

  test('ORate size - 注入 o-rate-{size} 类', async () => {
    const screen = render(ORate, { props: { size: 'large' } });
    await flush();
    expect((screen.container.querySelector('.o-rate') as HTMLElement).classList.contains('o-rate-large')).toBe(true);
  });
});

describe('动态契约（用户交互 → 组件响应）', () => {
  test('ORate change - 点击图标时 emit change', async () => {
    const onChange = vi.fn();
    const screen = render({ render: () => h(ORate, { onChange }) });
    await flush();
    const firstItem = screen.container.querySelector('.o-rate-item') as HTMLElement;
    await userEvent.click(firstItem);
    await flush();
    expect(onChange).toHaveBeenCalledWith(1);
  });

  test('ORate update:modelValue - 点击时 emit update:modelValue', async () => {
    const onUpdate = vi.fn();
    const screen = render({ render: () => h(ORate, { 'onUpdate:modelValue': onUpdate }) });
    await flush();
    const thirdItem = screen.container.querySelectorAll('.o-rate-item')[2] as HTMLElement;
    await userEvent.click(thirdItem);
    await flush();
    expect(onUpdate).toHaveBeenCalledWith(3);
  });

  test('ORate readonly - 点击不触发 change', async () => {
    const onChange = vi.fn();
    const screen = render({ render: () => h(ORate, { readonly: true, onChange }) });
    await flush();
    const firstItem = screen.container.querySelector('.o-rate-item') as HTMLElement;
    await userEvent.click(firstItem);
    await flush();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('ORate clearable - 点击相同值时清零', async () => {
    const onChange = vi.fn();
    const screen = render({ render: () => h(ORate, { clearable: true, defaultValue: 3, onChange }) });
    await flush();
    // 点击第 3 个图标（当前值已为 3），应清零
    const thirdItem = screen.container.querySelectorAll('.o-rate-item')[2] as HTMLElement;
    await userEvent.click(thirdItem);
    await flush();
    expect(onChange).toHaveBeenCalledWith(0);
  });
});

describe('视觉契约（双主题 light / dark）', () => {
  for (const theme of THEMES) {
    test(`ORate @${theme} - full 状态图标有颜色`, async () => {
      const screen = render(ORate, { props: { defaultValue: 3 } });
      await flush();
      const fullItem = screen.container.querySelector('.o-rate-item-status-full') as HTMLElement;
      paintThemed(screen.container, theme, fullItem);
      expect(getComputedStyle(fullItem).color).toBeTruthy();
    });
  }
});

describe('插槽契约（具名插槽）', () => {
  test('ORate slot=icon - 替换图标渲染', async () => {
    const screen = render(ORate, {
      slots: {
        icon: ({ index }: { index: number }) => h('span', { class: `custom-icon-${index}` }, '★'),
      },
    });
    await flush();
    expect(screen.container.querySelector('.custom-icon-0')).not.toBeNull();
  });
});
