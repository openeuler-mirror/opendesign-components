/**
 * _utils/event.ts 事件工具函数测试。
 *
 * 验证 trigger 函数能正确派发自定义事件并冒泡。
 */
import { test, expect, describe, vi } from 'vitest';
import { trigger } from './event';

describe('trigger', () => {
  test('trigger - 派发 bubbles 事件到目标元素', () => {
    const el = document.createElement('div');
    const handler = vi.fn();
    el.addEventListener('click', handler);
    trigger(el, 'click');
    expect(handler).toHaveBeenCalledTimes(1);
  });

  test('trigger - 事件冒泡到父元素', () => {
    const parent = document.createElement('div');
    const child = document.createElement('span');
    parent.appendChild(child);
    document.body.appendChild(parent);

    const parentHandler = vi.fn();
    parent.addEventListener('custom-evt', parentHandler);
    trigger(child, 'custom-evt');
    expect(parentHandler).toHaveBeenCalledTimes(1);

    parent.remove();
  });

  test('trigger - 事件对象可取消（cancelable=true）', () => {
    const el = document.createElement('div');
    let receivedEvent: Event | null = null;
    el.addEventListener('test-evt', (e) => {
      receivedEvent = e;
      e.preventDefault();
    });
    trigger(el, 'test-evt');
    expect(receivedEvent).not.toBeNull();
    expect((receivedEvent as Event).cancelable).toBe(true);
    expect((receivedEvent as Event).defaultPrevented).toBe(true);
  });
});
