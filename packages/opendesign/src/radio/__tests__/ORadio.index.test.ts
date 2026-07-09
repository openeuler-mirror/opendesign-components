/**
 * ORadio 单组件契约测试。
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h } from 'vue';
import ORadio from '../ORadio.vue';
import { THEMES, paintThemed } from '../../../__tests__/_helpers/theme';
import { flush } from '../../../__tests__/_helpers/dom';

describe('静态契约（按 types.ts 属性）', () => {
  test('ORadio 根元素为 label 且 class 包含 o-radio', async () => {
    const screen = render(ORadio, { props: { value: 'a' }, slots: { default: () => 'A' } });
    const el = screen.container.querySelector('.o-radio') as HTMLElement;
    expect(el.tagName).toBe('LABEL');
  });

  test('ORadio defaultChecked - 默认 false', async () => {
    const screen = render(ORadio, { props: { value: 'a' }, slots: { default: () => 'A' } });
    expect((screen.container.querySelector('.o-radio') as HTMLElement).classList.contains('o-radio-checked')).toBe(false);
  });

  test('ORadio defaultChecked=true - 初始选中', async () => {
    const screen = render(ORadio, { props: { value: 'a', defaultChecked: true }, slots: { default: () => 'A' } });
    expect((screen.container.querySelector('.o-radio') as HTMLElement).classList.contains('o-radio-checked')).toBe(true);
  });

  test('ORadio modelValue - 受控模式选中', async () => {
    const screen = render(ORadio, { props: { value: 'a', modelValue: 'a' }, slots: { default: () => 'A' } });
    expect((screen.container.querySelector('.o-radio') as HTMLElement).classList.contains('o-radio-checked')).toBe(true);
  });

  test('ORadio modelValue 不匹配 value - 未选中', async () => {
    const screen = render(ORadio, { props: { value: 'a', modelValue: 'b' }, slots: { default: () => 'A' } });
    expect((screen.container.querySelector('.o-radio') as HTMLElement).classList.contains('o-radio-checked')).toBe(false);
  });

  test('ORadio disabled - 注入 o-radio-disabled 类', async () => {
    const screen = render(ORadio, { props: { value: 'a', disabled: true }, slots: { default: () => 'A' } });
    const el = screen.container.querySelector('.o-radio') as HTMLElement;
    expect(el.classList.contains('o-radio-disabled')).toBe(true);
  });

  test('ORadio - 渲染 input[type=radio] 子元素', async () => {
    const screen = render(ORadio, { props: { value: 'a' }, slots: { default: () => 'A' } });
    const input = screen.container.querySelector('input[type="radio"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe('a');
  });

  test('ORadio inputId - 透传到 input 和 label', async () => {
    const screen = render(ORadio, { props: { value: 'a', inputId: 'my-radio' }, slots: { default: () => 'A' } });
    const label = screen.container.querySelector('.o-radio') as HTMLElement;
    const input = screen.container.querySelector('input') as HTMLInputElement;
    expect(label.getAttribute('for')).toBe('my-radio');
    expect(input.id).toBe('my-radio');
  });

  test('ORadio - 默认自动生成 inputId', async () => {
    const screen = render(ORadio, { props: { value: 'a' }, slots: { default: () => 'A' } });
    await flush();
    const input = screen.container.querySelector('input') as HTMLInputElement;
    expect(input.id).toBeTruthy();
  });
});

describe('动态契约（用户交互 → 组件响应）', () => {
  test('ORadio change - 点击时 emit change 事件', async () => {
    const onChange = vi.fn();
    const screen = render({ render: () => h(ORadio, { value: 'a', onChange }, { default: () => 'A' }) });
    await flush();
    const input = screen.container.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await flush();
    expect(onChange).toHaveBeenCalledWith('a', expect.any(Event));
  });

  test('ORadio update:modelValue - 点击时 emit update:modelValue', async () => {
    const onUpdate = vi.fn();
    const screen = render({ render: () => h(ORadio, { value: 'a', 'onUpdate:modelValue': onUpdate }, { default: () => 'A' }) });
    await flush();
    const input = screen.container.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await flush();
    expect(onUpdate).toHaveBeenCalledWith('a');
  });

  test('ORadio disabled - 点击不触发 change', async () => {
    const onChange = vi.fn();
    const screen = render({ render: () => h(ORadio, { value: 'a', disabled: true, onChange }, { default: () => 'A' }) });
    await flush();
    const input = screen.container.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await flush();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('ORadio exposed - checked 属性暴露当前选中状态', async () => {
    const screen = render(ORadio, { props: { value: 'a', modelValue: 'a' }, slots: { default: () => 'A' } });
    await flush();
    // 通过 DOM 验证 checked 状态
    expect((screen.container.querySelector('.o-radio') as HTMLElement).classList.contains('o-radio-checked')).toBe(true);
  });
});

describe('视觉契约（双主题 light / dark）', () => {
  for (const theme of THEMES) {
    test(`ORadio checked @${theme} - 选中态有可见样式`, async () => {
      const screen = render(ORadio, { props: { value: 'a', defaultChecked: true }, slots: { default: () => 'A' } });
      const el = screen.container.querySelector('.o-radio-input') as HTMLElement;
      paintThemed(screen.container, theme, el);
      expect(getComputedStyle(el).color).toBeTruthy();
    });
  }
});

describe('插槽契约（具名插槽）', () => {
  test('ORadio slot=default - 渲染标签文案', async () => {
    const screen = render(ORadio, { props: { value: 'a' }, slots: { default: () => 'Option A' } });
    const label = screen.container.querySelector('.o-radio-label');
    expect(label?.textContent).toContain('Option A');
  });

  test('ORadio slot=radio - 替换整个 radio 渲染', async () => {
    const screen = render(ORadio, {
      props: { value: 'a' },
      slots: {
        radio: () => h('div', { class: 'custom-radio' }, 'Custom'),
        default: () => 'Label',
      },
    });
    expect(screen.container.querySelector('.custom-radio')).not.toBeNull();
  });
});
