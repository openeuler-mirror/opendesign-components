/**
 * directives 指令测试。
 *
 * 覆盖 vFocus / vUid / vOutClick / vOnResize。
 * 所有指令通过 render + withDirectives 测试，通过 DOM 断言验证行为。
 */
import { test, expect, describe, vi } from 'vitest';
import { render } from 'vitest-browser-vue';
import { defineComponent, h, withDirectives } from 'vue';
import { vFocus } from './focus';
import { vUid } from './uid';
import { vOutClick } from './click-outside';
import { vOnResize } from './on-resize';
import { flush } from '../../__tests__/_helpers/dom';

/** 等待两帧，确保 ResizeObserver 异步回调完成 */
function waitForRO() {
  return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null))));
}

describe('vFocus 指令', () => {
  test('vFocus - mounted 时调用 el.focus()', async () => {
    const focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
    const Host = defineComponent({
      render() {
        return withDirectives(h('input', { class: 'target' }), [[vFocus]]);
      },
    });
    const screen = render(Host);
    await flush();
    const input = screen.container.querySelector('.target') as HTMLInputElement;
    expect(input).not.toBeNull();
    // vFocus.mounted 调用了 el.focus()
    expect(focusSpy).toHaveBeenCalled();
    focusSpy.mockRestore();
  });
});

describe('vUid 指令', () => {
  test('vUid - 元素无 id 时自动生成随机 id', async () => {
    const Host = defineComponent({
      render() {
        return withDirectives(h('div', { class: 'target' }), [[vUid]]);
      },
    });
    const screen = render(Host);
    await flush();
    const el = screen.container.querySelector('.target') as HTMLElement;
    expect(el.id).toBeTruthy();
    expect(el.id.length).toBeGreaterThan(0);
  });

  test('vUid - 元素已有 id 时保留原 id', async () => {
    const Host = defineComponent({
      render() {
        return withDirectives(h('div', { class: 'target', id: 'existing-id' }), [[vUid]]);
      },
    });
    const screen = render(Host);
    await flush();
    const el = screen.container.querySelector('.target') as HTMLElement;
    expect(el.id).toBe('existing-id');
  });

  test('vUid - 传入字符串值时设置为 id', async () => {
    const Host = defineComponent({
      render() {
        return withDirectives(h('div', { class: 'target' }), [[vUid, 'custom-id']]);
      },
    });
    const screen = render(Host);
    await flush();
    const el = screen.container.querySelector('.target') as HTMLElement;
    expect(el.id).toBe('custom-id');
  });

  test('vUid - 传入函数时调用函数处理 id', async () => {
    const handler = vi.fn();
    const Host = defineComponent({
      render() {
        return withDirectives(h('div', { class: 'target', id: 'pre-id' }), [[vUid, handler]]);
      },
    });
    const screen = render(Host);
    await flush();
    // created 钩子时 attributes 尚未应用，el.id 为空 → 传入 uniqueId() 生成的随机 id
    expect(handler).toHaveBeenCalledWith(expect.any(HTMLElement), expect.stringMatching(/^[a-z0-9]+$/));
  });
});

describe('vOutClick 指令', () => {
  test('vOutClick - 点击元素外部时触发回调', async () => {
    const handler = vi.fn();
    const Host = defineComponent({
      render() {
        return h('div', { class: 'outer' }, [withDirectives(h('div', { class: 'inner' }), [[vOutClick, handler]]), h('div', { class: 'outside' }, 'outside')]);
      },
    });
    const screen = render(Host);
    await flush();

    const outside = screen.container.querySelector('.outside') as HTMLElement;
    // 非快速模式：mousedown + mouseup 都在元素外部时触发
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    outside.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    await flush();
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('vOutClick - fast 修饰符在 mousedown 时立即触发', async () => {
    const handler = vi.fn();
    const Host = defineComponent({
      render() {
        return h('div', { class: 'outer' }, [
          // withDirectives 格式: [directive, value, arg, modifiers]
          withDirectives(h('div', { class: 'inner' }), [[vOutClick, handler, undefined, { fast: true }]]),
          h('div', { class: 'outside' }),
        ]);
      },
    });
    const screen = render(Host);
    await flush();

    const outside = screen.container.querySelector('.outside') as HTMLElement;
    outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    await flush();
    // fast 模式下 mousedown 在外部应立即触发
    expect(handler).toHaveBeenCalledTimes(1);
  });
});

describe('vOnResize 指令', () => {
  test('vOnResize - 元素尺寸变化时触发回调', async () => {
    const handler = vi.fn();
    const Host = defineComponent({
      render() {
        return withDirectives(h('div', { class: 'target', style: 'width:100px;height:50px' }), [[vOnResize, handler]]);
      },
    });
    const screen = render(Host);
    await flush();

    const el = screen.container.querySelector('.target') as HTMLElement;
    el.style.width = '200px';

    await waitForRO();

    // ResizeObserver 首次 observe + 尺寸变化都应触发回调
    expect(handler).toHaveBeenCalled();
  });

  test('vOnResize - 非函数值不报错', async () => {
    const Host = defineComponent({
      render() {
        return withDirectives(h('div', { class: 'target' }), [[vOnResize, 'not-a-function']]);
      },
    });
    const screen = render(Host);
    await flush();
    expect(screen.container.querySelector('.target')).not.toBeNull();
  });
});
