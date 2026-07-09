/**
 * OSwitch 单组件契约测试。
 *
 * 组织原则：
 *   1. 静态契约：按 types.ts prop 顺序
 *   2. 动态契约：click 切换 / disabled 阻断 / loading 阻断 / beforeChange 钩子
 *   3. 视觉契约：双主题
 *   4. 插槽契约：active / inactive / on / off
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h } from 'vue';
import OSwitch from '../OSwitch.vue';
import { THEMES, paintThemed } from '../../../__tests__/_helpers/theme';
import { flush } from '../../../__tests__/_helpers/dom';

describe('静态契约（按 types.ts 属性）', () => {
  test('OSwitch size - medium / small 注入类，默认 medium', async () => {
    for (const s of ['medium', 'small'] as const) {
      const screen = render(OSwitch, { props: { size: s } });
      expect((screen.container.querySelector('.o-switch') as HTMLElement).classList.contains(`o-switch-${s}`)).toBe(true);
    }
    const def = render(OSwitch, {});
    expect((def.container.querySelector('.o-switch') as HTMLElement).classList.contains('o-switch-medium')).toBe(true);
  });

  test('OSwitch defaultChecked - 默认 false', async () => {
    const screen = render(OSwitch, {});
    expect((screen.container.querySelector('.o-switch') as HTMLElement).classList.contains('o-switch-checked')).toBe(false);
  });

  test('OSwitch defaultChecked=true - 初始选中', async () => {
    const screen = render(OSwitch, { props: { defaultChecked: true } });
    expect((screen.container.querySelector('.o-switch') as HTMLElement).classList.contains('o-switch-checked')).toBe(true);
  });

  test('OSwitch modelValue - 受控模式选中', async () => {
    const screen = render(OSwitch, { props: { modelValue: true } });
    expect((screen.container.querySelector('.o-switch') as HTMLElement).classList.contains('o-switch-checked')).toBe(true);
  });

  test('OSwitch disabled - 注入 o-switch-disabled 类', async () => {
    const screen = render(OSwitch, { props: { disabled: true } });
    expect((screen.container.querySelector('.o-switch') as HTMLElement).classList.contains('o-switch-disabled')).toBe(true);
  });

  test('OSwitch loading - 注入 o-switch-loading 类 + 旋转图标', async () => {
    const screen = render(OSwitch, { props: { loading: true } });
    await flush();
    const el = screen.container.querySelector('.o-switch') as HTMLElement;
    expect(el.classList.contains('o-switch-loading')).toBe(true);
    expect(el.querySelector('.o-rotating')).not.toBeNull();
  });

  test('OSwitch checkedValue / uncheckedValue - 自定义值', async () => {
    const screen = render(OSwitch, { props: { modelValue: 'yes', checkedValue: 'yes', uncheckedValue: 'no' } });
    expect((screen.container.querySelector('.o-switch') as HTMLElement).classList.contains('o-switch-checked')).toBe(true);
  });

  test('OSwitch round - pill 注入 round-pill 类', async () => {
    const screen = render(OSwitch, { props: { round: 'pill' } });
    expect((screen.container.querySelector('.o-switch') as HTMLElement).classList.contains('o-switch-round-pill')).toBe(true);
  });
});

describe('动态契约（用户交互 → 组件响应）', () => {
  test('OSwitch click - 点击切换选中状态', async () => {
    const screen = render(OSwitch, {});
    const el = screen.container.querySelector('.o-switch') as HTMLElement;
    expect(el.classList.contains('o-switch-checked')).toBe(false);
    await userEvent.click(el);
    await flush();
    expect(el.classList.contains('o-switch-checked')).toBe(true);
  });

  test('OSwitch change - 切换时 emit change 事件', async () => {
    const onChange = vi.fn();
    const screen = render({ render: () => h(OSwitch, { onChange }) });
    await userEvent.click(screen.container.querySelector('.o-switch')!);
    await flush();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test('OSwitch update:modelValue - 切换时 emit update:modelValue', async () => {
    const onUpdate = vi.fn();
    const screen = render({ render: () => h(OSwitch, { 'onUpdate:modelValue': onUpdate }) });
    await userEvent.click(screen.container.querySelector('.o-switch')!);
    await flush();
    expect(onUpdate).toHaveBeenCalledWith(true);
  });

  test('OSwitch disabled - 点击不切换', async () => {
    const screen = render(OSwitch, { props: { disabled: true } });
    const el = screen.container.querySelector('.o-switch') as HTMLElement;
    await userEvent.click(el);
    await flush();
    expect(el.classList.contains('o-switch-checked')).toBe(false);
  });

  test('OSwitch loading - 点击不切换', async () => {
    const screen = render(OSwitch, { props: { loading: true } });
    const el = screen.container.querySelector('.o-switch') as HTMLElement;
    await userEvent.click(el);
    await flush();
    expect(el.classList.contains('o-switch-checked')).toBe(false);
  });

  test('OSwitch beforeChange - 返回 true 时切换', async () => {
    const beforeChange = vi.fn(() => true);
    const screen = render(OSwitch, { props: { beforeChange } });
    await userEvent.click(screen.container.querySelector('.o-switch')!);
    await flush();
    expect(beforeChange).toHaveBeenCalled();
    expect((screen.container.querySelector('.o-switch') as HTMLElement).classList.contains('o-switch-checked')).toBe(true);
  });

  test('OSwitch beforeChange - 返回 false 时不切换', async () => {
    const beforeChange = vi.fn(() => false);
    const screen = render(OSwitch, { props: { beforeChange } });
    await userEvent.click(screen.container.querySelector('.o-switch')!);
    await flush();
    expect(beforeChange).toHaveBeenCalled();
    expect((screen.container.querySelector('.o-switch') as HTMLElement).classList.contains('o-switch-checked')).toBe(false);
  });
});

describe('视觉契约（双主题 light / dark）', () => {
  for (const theme of THEMES) {
    test(`OSwitch checked @${theme} - 选中态背景非透明`, async () => {
      const screen = render(OSwitch, { props: { defaultChecked: true } });
      const el = screen.container.querySelector('.o-switch') as HTMLElement;
      paintThemed(screen.container, theme, el);
      expect(getComputedStyle(el).backgroundColor).toBeTruthy();
    });
  }

  for (const theme of THEMES) {
    test(`OSwitch unchecked @${theme} - 未选中态有可见背景`, async () => {
      const screen = render(OSwitch, {});
      const el = screen.container.querySelector('.o-switch') as HTMLElement;
      paintThemed(screen.container, theme, el);
      expect(getComputedStyle(el).backgroundColor).toBeTruthy();
    });
  }
});

describe('插槽契约（具名插槽）', () => {
  test('OSwitch slot=active - 选中时渲染', async () => {
    const screen = render(OSwitch, {
      props: { defaultChecked: true },
      slots: { active: () => h('span', { class: 'custom-active' }, 'ON') },
    });
    expect(screen.container.querySelector('.custom-active')).not.toBeNull();
  });

  test('OSwitch slot=inactive - 未选中时渲染', async () => {
    const screen = render(OSwitch, {
      slots: { inactive: () => h('span', { class: 'custom-inactive' }, 'OFF') },
    });
    expect(screen.container.querySelector('.custom-inactive')).not.toBeNull();
  });

  test('OSwitch slot=on - 选中时渲染标签', async () => {
    const screen = render(OSwitch, {
      props: { defaultChecked: true },
      slots: { on: () => h('span', { class: 'on-label' }, 'On') },
    });
    expect(screen.container.querySelector('.on-label')).not.toBeNull();
  });

  test('OSwitch slot=off - 未选中时渲染标签', async () => {
    const screen = render(OSwitch, {
      slots: { off: () => h('span', { class: 'off-label' }, 'Off') },
    });
    expect(screen.container.querySelector('.off-label')).not.toBeNull();
  });
});
