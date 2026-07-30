/**
 * OTextarea 单组件契约测试。
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h, ref } from 'vue';
import OTextarea from '../OTextarea.vue';
import { THEMES, paintThemed } from '../../../__tests__/_helpers/theme';
import { flush } from '../../../__tests__/_helpers/dom';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('静态契约（按 types.ts 属性）', () => {
  test('OTextarea 根元素 class 包含 o-textarea', async () => {
    const screen = render(OTextarea, {});
    await flush();
    expect(screen.container.querySelector('.o-textarea')).not.toBeNull();
  });

  test('OTextarea placeholder - 透传到原生 textarea', async () => {
    const screen = render(OTextarea, { props: { placeholder: 'Enter text' } });
    await flush();
    const ta = screen.container.querySelector('textarea') as HTMLTextAreaElement;
    expect(ta.placeholder).toBe('Enter text');
  });

  test('OTextarea modelValue - 受控模式值', async () => {
    const screen = render(OTextarea, { props: { modelValue: 'hello' } });
    await flush();
    const ta = screen.container.querySelector('textarea') as HTMLTextAreaElement;
    expect(ta.value).toBe('hello');
  });

  test('OTextarea disabled - 透传到原生 textarea', async () => {
    const screen = render(OTextarea, { props: { disabled: true } });
    await flush();
    const ta = screen.container.querySelector('textarea') as HTMLTextAreaElement;
    expect(ta.disabled).toBe(true);
  });

  test('OTextarea readonly - 透传到原生 textarea', async () => {
    const screen = render(OTextarea, { props: { readonly: true } });
    await flush();
    const ta = screen.container.querySelector('textarea') as HTMLTextAreaElement;
    expect(ta.readOnly).toBe(true);
  });

  test('OTextarea rows - 透传行数', async () => {
    const screen = render(OTextarea, { props: { rows: 5 } });
    await flush();
    const ta = screen.container.querySelector('textarea') as HTMLTextAreaElement;
    expect(ta.rows).toBe(5);
  });
});

describe('动态契约（用户交互 → 组件响应）', () => {
  test('OTextarea input - 用户输入时 emit input 事件', async () => {
    const onInput = vi.fn();
    const screen = render({ render: () => h(OTextarea, { onInput }) });
    await flush();
    const ta = screen.container.querySelector('textarea') as HTMLTextAreaElement;
    await userEvent.type(ta, 'a');
    expect(onInput).toHaveBeenCalled();
  });

  test('OTextarea update:modelValue - 输入时触发', async () => {
    const onUpdate = vi.fn();
    const screen = render({ render: () => h(OTextarea, { 'onUpdate:modelValue': onUpdate }) });
    await flush();
    const ta = screen.container.querySelector('textarea') as HTMLTextAreaElement;
    await userEvent.type(ta, 'x');
    expect(onUpdate).toHaveBeenCalled();
  });

  test('OTextarea focus - 聚焦时触发', async () => {
    const onFocus = vi.fn();
    const screen = render({ render: () => h(OTextarea, { onFocus }) });
    await flush();
    const ta = screen.container.querySelector('textarea') as HTMLTextAreaElement;
    await userEvent.click(ta);
    expect(onFocus).toHaveBeenCalled();
  });

  test('OTextarea exposed - focus/blur/clear 方法可用', async () => {
    const taRef = ref<any>(null);
    const screen = render({ setup: () => () => h(OTextarea as any, { ref: taRef }) });
    await flush();
    expect(taRef.value).toBeTruthy();
    expect(typeof taRef.value.focus).toBe('function');
    expect(typeof taRef.value.blur).toBe('function');
    expect(typeof taRef.value.clear).toBe('function');
  });
});

describe('视觉契约（双主题 light / dark）', () => {
  for (const theme of THEMES) {
    test(`OTextarea @${theme} - 有可见边框`, async () => {
      const screen = render(OTextarea, {});
      await flush();
      const el = screen.container.querySelector('.o-textarea') as HTMLElement;
      paintThemed(screen.container, theme, el);
      expect(getComputedStyle(el).borderTopWidth).not.toBe('0px');
    });
  }
});

describe('插槽契约', () => {
  test('OTextarea slot=prefix - 渲染前缀', async () => {
    const screen = render(OTextarea, {
      slots: { prefix: () => h('span', { class: 'custom-prefix' }, 'P') },
    });
    await flush();
    expect(screen.container.querySelector('.custom-prefix')).not.toBeNull();
  });

  test('OTextarea slot=suffix - 渲染后缀', async () => {
    const screen = render(OTextarea, {
      slots: { suffix: () => h('span', { class: 'custom-suffix' }, 'S') },
    });
    await flush();
    expect(screen.container.querySelector('.custom-suffix')).not.toBeNull();
  });
});

describe('SSR 契约', () => {
  test('OTextarea SSR - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OTextarea, { placeholder: 'Hi' }, '')).resolves.toEqual(expect.any(String));
  });

  test('OTextarea hydration - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OTextarea, { modelValue: 'test' }, '');
    expect(result.hasMismatch).toBe(false);
    if (result.root) result.root.remove();
  });
});
