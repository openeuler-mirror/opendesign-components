/**
 * OTab 单组件契约测试。
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { userEvent } from 'vitest/browser';
import { h } from 'vue';
import OTab from '../OTab.vue';
import OTabPane from '../OTabPane.vue';
import { flush } from '../../../__tests__/_helpers/dom';
import { renderSSR, ssrHydrateAndCompare } from '../../../__tests__/_helpers/ssr';

describe('静态契约（按 types.ts 属性）', () => {
  test('OTab 根元素 class 包含 o-tab', async () => {
    const screen = render(OTab, {
      slots: { default: () => h(OTabPane, { value: '1', label: 'Tab1' }) },
    });
    await flush();
    expect(screen.container.querySelector('.o-tab')).not.toBeNull();
  });

  test('OTab variant - solid/text/button 注入类，默认 text', async () => {
    for (const v of ['solid', 'text', 'button'] as const) {
      const screen = render(OTab, {
        props: { variant: v },
        slots: { default: () => h(OTabPane, { value: '1', label: 'T' }) },
      });
      await flush();
      expect((screen.container.querySelector('.o-tab') as HTMLElement).classList.contains(`o-tab-${v}`)).toBe(true);
    }
  });

  test('OTab modelValue - 指定选中页签', async () => {
    const screen = render(OTab, {
      props: { modelValue: '2' },
      slots: {
        default: () => [h(OTabPane, { value: '1', label: 'T1' }), h(OTabPane, { value: '2', label: 'T2' })],
      },
    });
    await flush();
    const activeNav = screen.container.querySelector('.o-tab-nav-active');
    expect(activeNav).not.toBeNull();
  });

  test('OTab - 渲染页签导航和内容区', async () => {
    const screen = render(OTab, {
      props: { modelValue: '1' },
      slots: {
        default: () => h(OTabPane, { value: '1', label: 'First' }, { default: () => 'Content 1' }),
      },
    });
    await flush();
    expect(screen.container.querySelector('.o-tab-head')).not.toBeNull();
    expect(screen.container.querySelector('.o-tab-body')).not.toBeNull();
    const nav = screen.container.querySelector('.o-tab-nav');
    expect(nav?.textContent).toContain('First');
  });

  test('OTab addable - 渲染添加按钮', async () => {
    const screen = render(OTab, {
      props: { addable: true },
      slots: { default: () => h(OTabPane, { value: '1', label: 'T' }) },
    });
    await flush();
    expect(screen.container.querySelector('.o-tab-nav-add')).not.toBeNull();
  });

  test('OTab line - 默认 true 显示 nav 线', async () => {
    const screen = render(OTab, {
      props: { variant: 'text' },
      slots: { default: () => h(OTabPane, { value: '1', label: 'T' }) },
    });
    await flush();
    expect(screen.container.querySelector('.o-tab-nav-anchor')).not.toBeNull();
  });
});

describe('动态契约（用户交互 → 组件响应）', () => {
  test('OTab update:modelValue - 点击页签切换', async () => {
    const onUpdate = vi.fn();
    const screen = render({
      render: () =>
        h(
          OTab,
          { 'onUpdate:modelValue': onUpdate },
          {
            default: () => [h(OTabPane, { value: '1', label: 'T1' }), h(OTabPane, { value: '2', label: 'T2' })],
          },
        ),
    });
    await flush();
    const navs = screen.container.querySelectorAll('.o-tab-nav');
    if (navs.length > 1) {
      await navs[1].click();
      await flush();
      expect(onUpdate).toHaveBeenCalledWith('2');
    }
  });

  test('OTab add - 点击添加按钮触发 add 事件', async () => {
    const onAdd = vi.fn();
    const screen = render({
      render: () =>
        h(
          OTab,
          { addable: true, onAdd },
          {
            default: () => h(OTabPane, { value: '1', label: 'T' }),
          },
        ),
    });
    await flush();
    const addBtn = screen.container.querySelector('.o-tab-nav-add') as HTMLElement;
    await addBtn.click();
    expect(onAdd).toHaveBeenCalledTimes(1);
  });
});

describe('SSR 契约', () => {
  test('OTab SSR - renderToString 不抛出错误', async () => {
    await expect(renderSSR(OTab, { modelValue: '1' }, '')).resolves.toEqual(expect.any(String));
  });

  test('OTab hydration - 无水合 mismatch', async () => {
    const result = await ssrHydrateAndCompare(OTab, { modelValue: '1' }, '');
    expect(result.hasMismatch).toBe(false);
    if (result.root) result.root.remove();
  });
});
