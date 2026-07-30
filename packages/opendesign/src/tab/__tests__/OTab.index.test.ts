/**
 * OTab 单组件契约测试。
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
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
      screen.unmount();
      await flush();
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

  test('OTab variant=button - button 模式不渲染 nav 线', async () => {
    const screen = render(OTab, {
      props: { variant: 'button' },
      slots: { default: () => h(OTabPane, { value: '1', label: 'T' }) },
    });
    await flush();
    expect(screen.container.querySelector('.o-tab-nav-anchor')).toBeNull();
  });

  test('OTab line=false - head 不含 show-line 类', async () => {
    const screen = render(OTab, {
      props: { line: false },
      slots: { default: () => h(OTabPane, { value: '1', label: 'T' }) },
    });
    await flush();
    // line=false 移除 show-line 类，但 anchor 元素仍存在（由 variant=text 决定）
    expect(screen.container.querySelector('.o-tab-head')?.classList.contains('show-line')).toBe(false);
  });

  test('OTab 无 modelValue - 自动选中第一个页签', async () => {
    const screen = render(OTab, {
      slots: {
        default: () => [h(OTabPane, { value: '1', label: 'T1' }), h(OTabPane, { value: '2', label: 'T2' })],
      },
    });
    await flush();
    const activeNav = screen.container.querySelector('.o-tab-nav-active');
    expect(activeNav).not.toBeNull();
    expect(activeNav?.textContent).toContain('T1');
  });

  test('OTab prefix/suffix 插槽 - 渲染前后缀区域', async () => {
    const screen = render(OTab, {
      slots: {
        prefix: () => 'Prefix',
        suffix: () => 'Suffix',
        default: () => h(OTabPane, { value: '1', label: 'T' }),
      },
    });
    await flush();
    expect(screen.container.querySelector('.o-tab-head-prefix')).not.toBeNull();
    expect(screen.container.querySelector('.o-tab-head-suffix')).not.toBeNull();
    expect(screen.container.querySelector('.o-tab-head-prefix')?.textContent).toContain('Prefix');
    expect(screen.container.querySelector('.o-tab-head-suffix')?.textContent).toContain('Suffix');
  });

  test('OTab headerClass - 自定义头部样式类', async () => {
    const screen = render(OTab, {
      props: { headerClass: 'custom-header' },
      slots: { default: () => h(OTabPane, { value: '1', label: 'T' }) },
    });
    await flush();
    expect(screen.container.querySelector('.o-tab-head')?.classList.contains('custom-header')).toBe(true);
  });
});

describe('OTabPane 属性契约', () => {
  test('OTabPane disabled - 禁用页签有 disabled 类且不可切换', async () => {
    const onUpdate = vi.fn();
    const screen = render({
      render: () =>
        h(
          OTab,
          { modelValue: '1', 'onUpdate:modelValue': onUpdate },
          {
            default: () => [h(OTabPane, { value: '1', label: 'T1' }), h(OTabPane, { value: '2', label: 'T2', disabled: true })],
          },
        ),
    });
    await flush();
    const navs = screen.container.querySelectorAll('.o-tab-nav');
    expect(navs.length).toBeGreaterThanOrEqual(2);
    expect(navs[1].classList.contains('o-tab-nav-disabled')).toBe(true);
    await navs[1].click();
    await flush();
    expect(onUpdate).not.toHaveBeenCalled();
  });

  test('OTabPane closable - 渲染关闭按钮', async () => {
    const screen = render(OTab, {
      props: { modelValue: '1' },
      slots: {
        default: () => h(OTabPane, { value: '1', label: 'T', closable: true }),
      },
    });
    await flush();
    expect(screen.container.querySelector('.o-tab-nav-close')).not.toBeNull();
  });

  test('OTabPane closable - 点击关闭按钮触发 delete 事件', async () => {
    const onDelete = vi.fn();
    const screen = render({
      render: () =>
        h(
          OTab,
          { modelValue: '1', onDelete },
          {
            default: () => h(OTabPane, { value: '1', label: 'T', closable: true }),
          },
        ),
    });
    await flush();
    const closeBtn = screen.container.querySelector('.o-tab-nav-close') as HTMLElement;
    await closeBtn.click();
    expect(onDelete).toHaveBeenCalledWith('1');
  });

  test('OTabPane lazy=true - 未激活时内容不渲染', async () => {
    const screen = render(OTab, {
      props: { modelValue: '1' },
      slots: {
        default: () => [
          h(OTabPane, { value: '1', label: 'T1' }, { default: () => 'Content 1' }),
          h(OTabPane, { value: '2', label: 'T2', lazy: true }, { default: () => 'Content 2' }),
        ],
      },
    });
    await flush();
    expect(screen.container.textContent).toContain('Content 1');
    expect(screen.container.textContent).not.toContain('Content 2');
  });

  test('OTabPane nav 插槽 - 自定义导航渲染', async () => {
    const screen = render(OTab, {
      slots: {
        default: () =>
          h(
            OTabPane,
            { value: '1', label: 'Default' },
            {
              nav: () => 'Custom Nav',
              default: () => 'Content',
            },
          ),
      },
    });
    await flush();
    const nav = screen.container.querySelector('.o-tab-nav');
    expect(nav?.textContent).toContain('Custom Nav');
    expect(nav?.textContent).not.toContain('Default');
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
    expect(navs.length).toBeGreaterThanOrEqual(2);
    await navs[1].click();
    await flush();
    expect(onUpdate).toHaveBeenCalledWith('2');
  });

  test('OTab change - 切换页签时触发 change 事件', async () => {
    const onChange = vi.fn();
    const screen = render({
      render: () =>
        h(
          OTab,
          { modelValue: '1', onChange },
          {
            default: () => [h(OTabPane, { value: '1', label: 'T1' }), h(OTabPane, { value: '2', label: 'T2' })],
          },
        ),
    });
    await flush();
    const navs = screen.container.querySelectorAll('.o-tab-nav');
    expect(navs.length).toBeGreaterThanOrEqual(2);
    await navs[1].click();
    await flush();
    expect(onChange).toHaveBeenCalledWith('2', '1');
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

describe('卸载契约', () => {
  test('OTab unmount - 卸载后 DOM 清理不残留', async () => {
    const screen = render(OTab, {
      props: { modelValue: '1' },
      slots: {
        default: () => [h(OTabPane, { value: '1', label: 'T1' }), h(OTabPane, { value: '2', label: 'T2' })],
      },
    });
    await flush();
    expect(screen.container.querySelector('.o-tab')).not.toBeNull();
    screen.unmount();
    await flush();
    expect(screen.container.querySelector('.o-tab')).toBeNull();
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
