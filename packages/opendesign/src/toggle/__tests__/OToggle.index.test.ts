/**
 * OToggle 单组件契约测试。
 *
 * 组织原则：
 *   1. 静态契约：按 types.ts prop 顺序
 *   2. 动态契约：click 切换 / disabled 阻断
 *   3. 插槽契约：default / icon
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h, markRaw } from 'vue';
import OToggle from '../OToggle.vue';
import OIconAddRaw from '../../icon-components/OIconAdd/OIconAdd.vue';
import { flush } from '../../../__tests__/_helpers/dom';

const OIconAdd = markRaw(OIconAddRaw);

describe('静态契约（按 types.ts 属性）', () => {
  test('OToggle 根元素 class 包含 o-toggle', async () => {
    const screen = render(OToggle, { slots: { default: () => 'T' } });
    expect(screen.container.querySelector('.o-toggle')).not.toBeNull();
  });

  test('OToggle defaultChecked - 默认 false', async () => {
    const screen = render(OToggle, { slots: { default: () => 'T' } });
    expect((screen.container.querySelector('.o-toggle') as HTMLElement).classList.contains('o-toggle-checked')).toBe(false);
  });

  test('OToggle defaultChecked=true - 初始选中', async () => {
    const screen = render(OToggle, { props: { defaultChecked: true }, slots: { default: () => 'T' } });
    expect((screen.container.querySelector('.o-toggle') as HTMLElement).classList.contains('o-toggle-checked')).toBe(true);
  });

  test('OToggle checked - 受控模式选中', async () => {
    const screen = render(OToggle, { props: { checked: true }, slots: { default: () => 'T' } });
    expect((screen.container.querySelector('.o-toggle') as HTMLElement).classList.contains('o-toggle-checked')).toBe(true);
  });

  test('OToggle disabled - 注入 o-toggle-disabled 类', async () => {
    const screen = render(OToggle, { props: { disabled: true }, slots: { default: () => 'D' } });
    expect((screen.container.querySelector('.o-toggle') as HTMLElement).classList.contains('o-toggle-disabled')).toBe(true);
  });

  test('OToggle round - pill 注入 round-pill 类', async () => {
    const screen = render(OToggle, { props: { round: 'pill' }, slots: { default: () => 'P' } });
    expect((screen.container.querySelector('.o-toggle') as HTMLElement).classList.contains('o-toggle-round-pill')).toBe(true);
  });

  test('OToggle icon - 渲染前缀图标', async () => {
    const screen = render(OToggle, { props: { icon: OIconAdd }, slots: { default: () => 'X' } });
    await flush();
    expect(screen.container.querySelector('.o-toggle-prefix')).not.toBeNull();
  });
});

describe('动态契约（用户交互 → 组件响应）', () => {
  test('OToggle click - 点击切换选中状态', async () => {
    const screen = render(OToggle, { slots: { default: () => 'T' } });
    const el = screen.container.querySelector('.o-toggle') as HTMLElement;
    expect(el.classList.contains('o-toggle-checked')).toBe(false);
    await userEvent.click(el);
    await flush();
    expect(el.classList.contains('o-toggle-checked')).toBe(true);
  });

  test('OToggle change - 切换时 emit change 事件', async () => {
    const onChange = vi.fn();
    const screen = render({ render: () => h(OToggle, { onChange }, { default: () => 'T' }) });
    await userEvent.click(screen.container.querySelector('.o-toggle')!);
    await flush();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test('OToggle update:checked - 切换时 emit update:checked', async () => {
    const onUpdate = vi.fn();
    const screen = render({ render: () => h(OToggle, { 'onUpdate:checked': onUpdate }, { default: () => 'T' }) });
    await userEvent.click(screen.container.querySelector('.o-toggle')!);
    await flush();
    expect(onUpdate).toHaveBeenCalledWith(true);
  });

  test('OToggle disabled - 点击不切换', async () => {
    const screen = render(OToggle, { props: { disabled: true }, slots: { default: () => 'D' } });
    const el = screen.container.querySelector('.o-toggle') as HTMLElement;
    await userEvent.click(el);
    await flush();
    expect(el.classList.contains('o-toggle-checked')).toBe(false);
  });
});

describe('插槽契约（具名插槽）', () => {
  test('OToggle slot=default - 渲染标签内容', async () => {
    const screen = render(OToggle, { slots: { default: () => 'Hello' } });
    expect(screen.container.querySelector('.o-toggle')?.textContent).toContain('Hello');
  });

  test('OToggle slot=icon - 替换 icon prop', async () => {
    const screen = render(OToggle, {
      slots: {
        icon: () => h('span', { class: 'custom-icon' }, 'I'),
        default: () => 'X',
      },
    });
    await flush();
    expect(screen.container.querySelector('.o-toggle-prefix .custom-icon')).not.toBeNull();
  });
});
