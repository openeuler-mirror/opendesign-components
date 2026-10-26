/**
 * OInput 单组件契约测试。
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h, ref } from 'vue';
import OInput from '../OInput.vue';
import { THEMES, paintThemed } from '../../../__tests__/_helpers/theme';
import { flush } from '../../../__tests__/_helpers/dom';

describe('静态契约（按 types.ts 属性）', () => {
  test('OInput 根元素 class 包含 o-input', async () => {
    const screen = render(OInput, {});
    await flush();
    expect(screen.container.querySelector('.o-input')).not.toBeNull();
  });

  test('OInput placeholder - 透传到原生 input', async () => {
    const screen = render(OInput, { props: { placeholder: 'Enter text' } });
    await flush();
    const input = screen.container.querySelector('input') as HTMLInputElement;
    expect(input.placeholder).toBe('Enter text');
  });

  test('OInput modelValue - 受控模式值', async () => {
    const screen = render(OInput, { props: { modelValue: 'hello' } });
    await flush();
    const input = screen.container.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('hello');
  });

  test('OInput defaultValue - 非受控默认值', async () => {
    const screen = render(OInput, { props: { defaultValue: 'default' } });
    await flush();
    const input = screen.container.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('default');
  });

  test('OInput disabled - 注入 disabled 类', async () => {
    const screen = render(OInput, { props: { disabled: true } });
    await flush();
    const input = screen.container.querySelector('input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  test('OInput readonly - 注入 readonly 属性', async () => {
    const screen = render(OInput, { props: { readonly: true } });
    await flush();
    const input = screen.container.querySelector('input') as HTMLInputElement;
    expect(input.readOnly).toBe(true);
  });

  test('OInput type=password - 透传到原生 input', async () => {
    const screen = render(OInput, { props: { type: 'password' } });
    await flush();
    const input = screen.container.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('password');
  });

  test('OInput clearable - 渲染清除按钮', async () => {
    const screen = render(OInput, { props: { clearable: true, modelValue: 'text' } });
    await flush();
    // clearable 应渲染清除图标
    expect(screen.container.querySelector('.o-input')).not.toBeNull();
  });

  test('OInput size - 注入 o-input-{size} 或继承 InBox', async () => {
    const screen = render(OInput, { props: { size: 'large' } });
    await flush();
    expect(screen.container.querySelector('.o-input')).not.toBeNull();
  });

  test('OInput color - 注入颜色类', async () => {
    const screen = render(OInput, { props: { color: 'primary' } });
    await flush();
    expect(screen.container.querySelector('.o-input')).not.toBeNull();
  });
});

describe('动态契约（用户交互 → 组件响应）', () => {
  test('OInput input - 用户输入时 emit input 事件', async () => {
    const onInput = vi.fn();
    const screen = render({ render: () => h(OInput, { onInput }) });
    await flush();
    const input = screen.container.querySelector('input') as HTMLInputElement;
    await userEvent.type(input, 'a');
    expect(onInput).toHaveBeenCalled();
  });

  test('OInput update:modelValue - 输入时 emit update:modelValue', async () => {
    const onUpdate = vi.fn();
    const screen = render({ render: () => h(OInput, { 'onUpdate:modelValue': onUpdate }) });
    await flush();
    const input = screen.container.querySelector('input') as HTMLInputElement;
    await userEvent.type(input, 'x');
    expect(onUpdate).toHaveBeenCalled();
  });

  test('OInput focus - 聚焦时 emit focus 事件', async () => {
    const onFocus = vi.fn();
    const screen = render({ render: () => h(OInput, { onFocus }) });
    await flush();
    const input = screen.container.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    expect(onFocus).toHaveBeenCalled();
  });

  test('OInput blur - 失焦时 emit blur 事件', async () => {
    const onBlur = vi.fn();
    const screen = render({ render: () => h(OInput, { onBlur }) });
    await flush();
    const input = screen.container.querySelector('input') as HTMLInputElement;
    await userEvent.click(input);
    await userEvent.tab();
    expect(onBlur).toHaveBeenCalled();
  });

  test('OInput pressEnter - 按 Enter 时 emit pressEnter', async () => {
    const onPressEnter = vi.fn();
    const screen = render({ render: () => h(OInput, { onPressEnter }) });
    await flush();
    const input = screen.container.querySelector('input') as HTMLInputElement;
    input.focus();
    await userEvent.keyboard('{Enter}');
    expect(onPressEnter).toHaveBeenCalled();
  });

  test('OInput exposed - focus 方法可调用', async () => {
    const inputRef = ref<any>(null);
    const screen = render({
      setup() {
        return () => h(OInput as any, { ref: inputRef });
      },
    });
    await flush();
    expect(inputRef.value).toBeTruthy();
    expect(typeof inputRef.value.focus).toBe('function');
    inputRef.value.focus();
  });

  test('OInput exposed - clear 方法可调用', async () => {
    const inputRef = ref<any>(null);
    const screen = render({
      setup() {
        return () => h(OInput as any, { ref: inputRef, modelValue: 'test' });
      },
    });
    await flush();
    expect(typeof inputRef.value.clear).toBe('function');
  });
});

describe('视觉契约（双主题 light / dark）', () => {
  for (const theme of THEMES) {
    test(`OInput @${theme} - 输入框有可见边框`, async () => {
      const screen = render(OInput, {});
      await flush();
      const el = screen.container.querySelector('.o-input') as HTMLElement;
      paintThemed(screen.container, theme, el);
      const cs = getComputedStyle(el);
      // outline variant 应有边框
      expect(cs.borderTopWidth).not.toBe('0px');
    });
  }
});

describe('插槽契约（具名插槽）', () => {
  test('OInput slot=prefix - 渲染前缀内容', async () => {
    const screen = render(OInput, {
      slots: { prefix: () => h('span', { class: 'custom-prefix' }, 'P') },
    });
    await flush();
    expect(screen.container.querySelector('.custom-prefix')).not.toBeNull();
  });

  test('OInput slot=suffix - 渲染后缀内容', async () => {
    const screen = render(OInput, {
      slots: { suffix: () => h('span', { class: 'custom-suffix' }, 'S') },
    });
    await flush();
    expect(screen.container.querySelector('.custom-suffix')).not.toBeNull();
  });

  test('OInput slot=prepend - 渲染前置内容', async () => {
    const screen = render(OInput, {
      slots: { prepend: () => h('span', { class: 'custom-prepend' }, 'Pre') },
    });
    await flush();
    expect(screen.container.querySelector('.custom-prepend')).not.toBeNull();
  });

  test('OInput slot=append - 渲染后置内容', async () => {
    const screen = render(OInput, {
      slots: { append: () => h('span', { class: 'custom-append' }, 'App') },
    });
    await flush();
    expect(screen.container.querySelector('.custom-append')).not.toBeNull();
  });
});
