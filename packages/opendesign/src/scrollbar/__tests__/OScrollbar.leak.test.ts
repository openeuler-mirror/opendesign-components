/**
 * OScrollbar 内存泄漏测试。
 *
 * 验证场景：useEventListener / useResizeObserver 在 onMounted 的 Promise.then
 * 微任务中调用，此时组件 effect scope 已关闭，tryOnScopeDispose 无法注册自动清理。
 * 方案 B 通过捕获返回值在 onUnmounted 中手动清理，本测试验证清理确实发生。
 */
import { test, expect, describe, vi, afterEach } from 'vitest';
import { render } from 'vitest-browser-vue';
import { h } from 'vue';
import OScrollbar from '../OScrollbar.vue';
import { flush } from '../../../__tests__/_helpers/dom';

afterEach(() => {
  document.body.innerHTML = '';
});

/** 创建可滚动目标元素并挂载到 body */
function createScrollTarget(): HTMLElement {
  const el = document.createElement('div');
  el.style.cssText = 'width:200px;height:100px;overflow:auto;';
  el.innerHTML = '<div style="width:400px;height:200px;">Content</div>';
  document.body.appendChild(el);
  return el;
}

/** 等待微任务队列刷新 */
function flushMicrotasks() {
  return Promise.resolve();
}

describe('内存泄漏：init() 在 Promise.then 微任务中创建的资源', () => {
  test('卸载后 scroll 事件监听被移除', async () => {
    const targetEl = createScrollTarget();

    const addSpy = vi.spyOn(targetEl, 'addEventListener');
    const removeSpy = vi.spyOn(targetEl, 'removeEventListener');

    const screen = render({
      render: () => h(OScrollbar, { target: targetEl }),
    });

    await flushMicrotasks();
    await flush();

    // 确认 scroll listener 已添加
    const scrollAdded = addSpy.mock.calls.filter((c) => c[0] === 'scroll');
    expect(scrollAdded.length).toBeGreaterThan(0);

    // 卸载
    screen.unmount();
    await flushMicrotasks();
    await flush();

    // 验证 scroll listener 已被移除（方案 B 修复后）
    const scrollRemoved = removeSpy.mock.calls.filter((c) => c[0] === 'scroll');
    expect(scrollRemoved.length).toBeGreaterThan(0);

    targetEl.remove();
  });

  test('卸载后 ResizeObserver 被 disconnect', async () => {
    const targetEl = createScrollTarget();

    // 收集所有 ResizeObserver 实例的 disconnect 调用
    const disconnectSpy = vi.fn();
    const observeSpy = vi.fn();
    const originalRO = window.ResizeObserver;

    // 使用普通 class 而非箭头函数，确保 new ResizeObserver(callback) 可用
    window.ResizeObserver = class {
      observe = observeSpy;
      disconnect = disconnectSpy;
      unobserve = vi.fn();
    } as any;

    try {
      const screen = render({
        render: () => h(OScrollbar, { target: targetEl }),
      });

      await flushMicrotasks();
      await flush();

      // 确认 ResizeObserver 已 observe
      expect(observeSpy).toHaveBeenCalled();

      // 卸载
      screen.unmount();
      await flushMicrotasks();
      await flush();

      // 验证 disconnect 已被调用（方案 B 修复后）
      expect(disconnectSpy).toHaveBeenCalled();
    } finally {
      window.ResizeObserver = originalRO;
      targetEl.remove();
    }
  });

  test('多次挂载/卸载不残留事件监听', async () => {
    for (let i = 0; i < 3; i++) {
      const targetEl = createScrollTarget();
      const removeSpy = vi.spyOn(targetEl, 'removeEventListener');

      const screen = render({
        render: () => h(OScrollbar, { target: targetEl }),
      });

      await flushMicrotasks();
      await flush();

      screen.unmount();
      await flushMicrotasks();
      await flush();

      const scrollRemoved = removeSpy.mock.calls.filter((c) => c[0] === 'scroll');
      expect(scrollRemoved.length).toBeGreaterThan(0);

      targetEl.remove();
    }
  });
});
