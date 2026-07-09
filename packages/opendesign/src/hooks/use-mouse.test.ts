/**
 * hooks/use-mouse.ts 鼠标位置追踪测试。
 *
 * 验证 useMouse 返回的 x / y 响应式值在 mousemove 事件时更新。
 * 直接调用 composable（不经过 render），对返回的 ref 断言。
 */
import { test, expect, describe } from 'vitest';
import { useMouse } from './use-mouse';

describe('useMouse', () => {
  test('useMouse - defaultValue 作为初始值（target=null 跳过初始化 trigger）', () => {
    const { x, y } = useMouse({ defaultValue: { x: 10, y: 20 }, target: null });
    expect(x.value).toBe(10);
    expect(y.value).toBe(20);
  });

  test('useMouse - mousemove 事件以 page 坐标更新 x / y', () => {
    const { x, y, destroy } = useMouse({});
    // 初始化 trigger 派发普通 Event（无 pageX），x/y 被设为 undefined
    expect(x.value).toBeUndefined();
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 200 }));
    // page 模式：scroll=0 时 pageX = clientX
    expect(x.value).toBe(100);
    expect(y.value).toBe(200);
    destroy();
  });

  test('useMouse - type=client 时返回 client 坐标', () => {
    const { x, y, destroy } = useMouse({ type: 'client' });
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 60 }));
    expect(x.value).toBe(50);
    expect(y.value).toBe(60);
    destroy();
  });

  test('useMouse - destroy 后 mousemove 不再更新 x / y', () => {
    const { x, y, destroy } = useMouse({});
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 100, clientY: 200 }));
    expect(x.value).toBe(100);
    destroy();
    window.dispatchEvent(new MouseEvent('mousemove', { clientX: 999, clientY: 999 }));
    // destroy 后保持上次值
    expect(x.value).toBe(100);
    expect(y.value).toBe(200);
  });
});
