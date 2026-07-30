/**
 * hooks/use-resize-observer.ts ResizeObserver 封装测试。
 *
 * 验证 observe / unobserve 的回调注册和移除，以及 isFirst 标记。
 * 使用真实 ResizeObserver（Playwright Chromium 原生支持）。
 */
import { test, expect, describe, vi } from 'vitest';
import { useResizeObserver } from './use-resize-observer';

/** 等待两帧，确保 ResizeObserver 异步回调完成 */
function waitForRO() {
  return new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(null))));
}

describe('useResizeObserver', () => {
  test('useResizeObserver - observe 后首次回调 isFirst=true', async () => {
    const ro = useResizeObserver();
    const el = document.createElement('div');
    el.style.width = '100px';
    el.style.height = '50px';
    document.body.appendChild(el);

    const callback = vi.fn();
    ro.observe(el, callback);

    await waitForRO();

    expect(callback).toHaveBeenCalled();
    // 首次回调的第二个参数（isFirst）应为 true
    expect(callback.mock.calls[0][1]).toBe(true);

    ro.unobserve(el, callback);
    el.remove();
  });

  test('useResizeObserver - 尺寸变化后后续回调 isFirst=false', async () => {
    const ro = useResizeObserver();
    const el = document.createElement('div');
    el.style.width = '100px';
    el.style.height = '50px';
    document.body.appendChild(el);

    const callback = vi.fn();
    ro.observe(el, callback);

    // 等待首次回调
    await waitForRO();

    // 改变尺寸触发后续回调
    el.style.width = '200px';
    await waitForRO();

    // 后续回调的 isFirst 应为 false
    const lastCallArgs = callback.mock.calls[callback.mock.calls.length - 1];
    expect(lastCallArgs[1]).toBe(false);

    ro.unobserve(el, callback);
    el.remove();
  });

  test('useResizeObserver - unobserve 后回调不再触发', async () => {
    const ro = useResizeObserver();
    const el = document.createElement('div');
    el.style.width = '100px';
    document.body.appendChild(el);

    const callback = vi.fn();
    ro.observe(el, callback);

    await waitForRO();
    const callCountBefore = callback.mock.calls.length;

    ro.unobserve(el, callback);

    // 改变尺寸，回调不应再触发
    el.style.width = '300px';
    await waitForRO();

    expect(callback.mock.calls.length).toBe(callCountBefore);

    el.remove();
  });

  test('useResizeObserver - 同一元素多次 observe 不同回调', async () => {
    const ro = useResizeObserver();
    const el = document.createElement('div');
    el.style.width = '100px';
    document.body.appendChild(el);

    const cb1 = vi.fn();
    const cb2 = vi.fn();
    ro.observe(el, cb1);
    ro.observe(el, cb2);

    await waitForRO();

    // 两个回调都应被调用
    expect(cb1).toHaveBeenCalled();
    expect(cb2).toHaveBeenCalled();

    ro.unobserve(el, cb1);
    ro.unobserve(el, cb2);
    el.remove();
  });

  test('useResizeObserver - observe 传入非元素或不传回调时返回 null', () => {
    const ro = useResizeObserver();
    expect(ro.observe(null as any, () => {})).toBeNull();
    expect(ro.observe(document.createElement('div'), null as any)).toBeNull();
  });

  test('useResizeObserver - unobserve 未注册的回调应为 no-op，不影响已注册回调', async () => {
    const ro = useResizeObserver();
    const el = document.createElement('div');
    el.style.width = '100px';
    el.style.height = '50px';
    document.body.appendChild(el);

    const cb1 = vi.fn();
    const cb2 = vi.fn();
    const notRegistered = vi.fn();

    ro.observe(el, cb1);
    ro.observe(el, cb2);
    await waitForRO();
    cb1.mockClear();
    cb2.mockClear();

    // 传入从未注册过的回调，unobserve 应为 no-op
    ro.unobserve(el, notRegistered);

    el.style.width = '300px';
    await waitForRO();

    // 已注册的回调不应受到未注册回调 unobserve 的影响
    expect(cb1).toHaveBeenCalled();
    expect(cb2).toHaveBeenCalled();

    ro.unobserve(el, cb1);
    ro.unobserve(el, cb2);
    el.remove();
  });

  test('useResizeObserver - 单回调下 unobserve 未注册回调后已注册回调仍触发', async () => {
    const ro = useResizeObserver();
    const el = document.createElement('div');
    el.style.width = '100px';
    el.style.height = '50px';
    document.body.appendChild(el);

    const cb = vi.fn();
    const notRegistered = vi.fn();

    ro.observe(el, cb);
    await waitForRO();
    cb.mockClear();

    // 传入未注册回调，unobserve 应为 no-op
    ro.unobserve(el, notRegistered);

    el.style.width = '300px';
    await waitForRO();

    // 已注册的 cb 应仍正常触发
    expect(cb).toHaveBeenCalled();

    ro.unobserve(el, cb);
    el.remove();
  });
});
