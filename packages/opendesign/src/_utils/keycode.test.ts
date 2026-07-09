/**
 * _utils/keycode.ts 键盘按键常量测试。
 *
 * 验证各按键常量的 key 和 code 属性值正确。
 */
import { test, expect, describe } from 'vitest';
import { Enter, Esc, Backspace, Tab, Space, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Home, End, pageDown, pageUp } from './keycode';

describe('keycode 常量', () => {
  test('Enter - key 和 code 均为 Enter', () => {
    expect(Enter.key).toBe('Enter');
    expect(Enter.code).toBe('Enter');
  });

  test('Esc - key 为 Escape，code 为 Escape', () => {
    expect(Esc.key).toBe('Escape');
    expect(Esc.code).toBe('Escape');
  });

  test('Backspace - key 和 code 均为 Backspace', () => {
    expect(Backspace.key).toBe('Backspace');
    expect(Backspace.code).toBe('Backspace');
  });

  test('Tab - key 和 code 均为 Tab', () => {
    expect(Tab.key).toBe('Tab');
    expect(Tab.code).toBe('Tab');
  });

  test('Space - key 为空字符串，code 为 Space', () => {
    expect(Space.key).toBe('');
    expect(Space.code).toBe('Space');
  });

  test('ArrowUp / ArrowDown / ArrowLeft / ArrowRight - 方向键', () => {
    expect(ArrowUp.key).toBe('ArrowUp');
    expect(ArrowDown.key).toBe('ArrowDown');
    expect(ArrowLeft.key).toBe('ArrowLeft');
    expect(ArrowRight.key).toBe('ArrowRight');
  });

  test('Home / End - 导航键', () => {
    expect(Home.key).toBe('Home');
    expect(End.key).toBe('End');
  });

  test('pageUp / pageDown - 翻页键', () => {
    expect(pageUp.key).toBe('PageUp');
    expect(pageDown.key).toBe('PageDown');
  });
});
