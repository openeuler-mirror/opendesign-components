/**
 * OCheckbox 单组件契约测试。
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h } from 'vue';
import OCheckbox from '../OCheckbox.vue';
import { THEMES, paintThemed } from '../../../__tests__/_helpers/theme';
import { flush } from '../../../__tests__/_helpers/dom';

describe('静态契约（按 types.ts 属性）', () => {
  test('OCheckbox 根元素为 label 且 class 包含 o-checkbox', async () => {
    const screen = render(OCheckbox, { props: { value: 'a' }, slots: { default: () => 'A' } });
    const el = screen.container.querySelector('.o-checkbox') as HTMLElement;
    expect(el.tagName).toBe('LABEL');
  });

  test('OCheckbox defaultChecked - 默认 false', async () => {
    const screen = render(OCheckbox, { props: { value: 'a' }, slots: { default: () => 'A' } });
    expect((screen.container.querySelector('.o-checkbox') as HTMLElement).classList.contains('o-checkbox-checked')).toBe(false);
  });

  test('OCheckbox defaultChecked=true - 初始选中', async () => {
    const screen = render(OCheckbox, { props: { value: 'a', defaultChecked: true }, slots: { default: () => 'A' } });
    expect((screen.container.querySelector('.o-checkbox') as HTMLElement).classList.contains('o-checkbox-checked')).toBe(true);
  });

  test('OCheckbox modelValue - 受控模式选中', async () => {
    const screen = render(OCheckbox, { props: { value: 'a', modelValue: ['a'] }, slots: { default: () => 'A' } });
    expect((screen.container.querySelector('.o-checkbox') as HTMLElement).classList.contains('o-checkbox-checked')).toBe(true);
  });

  test('OCheckbox modelValue 不含 value - 未选中', async () => {
    const screen = render(OCheckbox, { props: { value: 'a', modelValue: ['b'] }, slots: { default: () => 'A' } });
    expect((screen.container.querySelector('.o-checkbox') as HTMLElement).classList.contains('o-checkbox-checked')).toBe(false);
  });

  test('OCheckbox disabled - 注入 o-checkbox-disabled 类', async () => {
    const screen = render(OCheckbox, { props: { value: 'a', disabled: true }, slots: { default: () => 'A' } });
    expect((screen.container.querySelector('.o-checkbox') as HTMLElement).classList.contains('o-checkbox-disabled')).toBe(true);
  });

  test('OCheckbox indeterminate - 注入 o-checkbox-indeterminate 类', async () => {
    const screen = render(OCheckbox, { props: { value: 'a', indeterminate: true }, slots: { default: () => 'A' } });
    expect((screen.container.querySelector('.o-checkbox') as HTMLElement).classList.contains('o-checkbox-indeterminate')).toBe(true);
  });

  test('OCheckbox - 渲染 input[type=checkbox] 子元素', async () => {
    const screen = render(OCheckbox, { props: { value: 'a' }, slots: { default: () => 'A' } });
    const input = screen.container.querySelector('input[type="checkbox"]') as HTMLInputElement;
    expect(input).not.toBeNull();
    expect(input.value).toBe('a');
  });

  test('OCheckbox inputId - 透传到 label[for] 和 input[id]', async () => {
    const screen = render(OCheckbox, { props: { value: 'a', inputId: 'my-cb' }, slots: { default: () => 'A' } });
    const label = screen.container.querySelector('.o-checkbox') as HTMLElement;
    const input = screen.container.querySelector('input') as HTMLInputElement;
    expect(label.getAttribute('for')).toBe('my-cb');
    expect(input.id).toBe('my-cb');
  });
});

describe('动态契约（用户交互 → 组件响应）', () => {
  test('OCheckbox change - 点击时 emit change 事件', async () => {
    const onChange = vi.fn();
    const screen = render({ render: () => h(OCheckbox, { value: 'a', onChange }, { default: () => 'A' }) });
    await flush();
    const input = screen.container.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await flush();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toContain('a');
  });

  test('OCheckbox update:modelValue - 选中时添加 value 到数组', async () => {
    const onUpdate = vi.fn();
    const screen = render({ render: () => h(OCheckbox, { value: 'a', 'onUpdate:modelValue': onUpdate }, { default: () => 'A' }) });
    await flush();
    const input = screen.container.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await flush();
    expect(onUpdate).toHaveBeenCalledWith(['a']);
  });

  test('OCheckbox update:modelValue - 取消选中时移除 value', async () => {
    const onUpdate = vi.fn();
    const screen = render({ render: () => h(OCheckbox, { value: 'a', modelValue: ['a'], 'onUpdate:modelValue': onUpdate }, { default: () => 'A' }) });
    await flush();
    const input = screen.container.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await flush();
    expect(onUpdate).toHaveBeenCalledWith([]);
  });

  test('OCheckbox disabled - 点击不触发 change', async () => {
    const onChange = vi.fn();
    const screen = render({ render: () => h(OCheckbox, { value: 'a', disabled: true, onChange }, { default: () => 'A' }) });
    await flush();
    const input = screen.container.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await flush();
    expect(onChange).not.toHaveBeenCalled();
  });

  test('OCheckbox exposed - checked 属性暴露当前选中状态', async () => {
    const screen = render(OCheckbox, { props: { value: 'a', modelValue: ['a'] }, slots: { default: () => 'A' } });
    await flush();
    expect((screen.container.querySelector('.o-checkbox') as HTMLElement).classList.contains('o-checkbox-checked')).toBe(true);
  });
});

describe('视觉契约（双主题 light / dark）', () => {
  for (const theme of THEMES) {
    test(`OCheckbox checked @${theme} - 选中态有可见颜色`, async () => {
      const screen = render(OCheckbox, { props: { value: 'a', defaultChecked: true }, slots: { default: () => 'A' } });
      const el = screen.container.querySelector('.o-checkbox-input') as HTMLElement;
      paintThemed(screen.container, theme, el);
      expect(getComputedStyle(el).color).toBeTruthy();
    });
  }
});

describe('插槽契约（具名插槽）', () => {
  test('OCheckbox slot=default - 渲染标签文案', async () => {
    const screen = render(OCheckbox, { props: { value: 'a' }, slots: { default: () => 'Option A' } });
    const label = screen.container.querySelector('.o-checkbox-label');
    expect(label?.textContent).toContain('Option A');
  });

  test('OCheckbox slot=checkbox - 替换整个 checkbox 渲染', async () => {
    const screen = render(OCheckbox, {
      props: { value: 'a' },
      slots: {
        checkbox: () => h('div', { class: 'custom-cb' }, 'Custom'),
        default: () => 'Label',
      },
    });
    expect(screen.container.querySelector('.custom-cb')).not.toBeNull();
  });
});
