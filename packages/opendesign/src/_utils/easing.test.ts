/**
 * _utils/easing.ts 缓动函数测试。
 *
 * 验证 easeInOutCubic 在各时间点的插值正确性。
 */
import { test, expect, describe } from 'vitest';
import { easeInOutCubic } from './easing';

describe('easeInOutCubic', () => {
  test('easeInOutCubic - time=0 时返回起始值', () => {
    expect(easeInOutCubic(0, 0, 100, 400)).toBe(0);
  });

  test('easeInOutCubic - time=duration 时返回结束值', () => {
    const result = easeInOutCubic(400, 0, 100, 400);
    expect(result).toBeCloseTo(100, 5);
  });

  test('easeInOutCubic - 前半段加速（二次曲线）', () => {
    // time < duration/2 时走前半段公式
    const result = easeInOutCubic(100, 0, 100, 400);
    // time/duration = 0.25 → t=0.5 → elapsed/2 * 0.125 * 1 = 6.25
    expect(result).toBeCloseTo(6.25, 5);
  });

  test('easeInOutCubic - 后半段减速', () => {
    // time > duration/2 时走后半段公式
    const result = easeInOutCubic(300, 0, 100, 400);
    // 后半段：t = 1.5 - 2 = -0.5 → elapsed/2 * ((-0.5)^3 + 2) + start = 50 * 1.875 = 93.75
    expect(result).toBeCloseTo(93.75, 5);
  });

  test('easeInOutCubic - 中点返回中值', () => {
    // time = duration/2 = 200 → t = 1 → 走前半段末尾 = elapsed/2 * 1 = 50
    const result = easeInOutCubic(200, 0, 100, 400);
    expect(result).toBeCloseTo(50, 5);
  });

  test('easeInOutCubic - start 非零时正确偏移', () => {
    const result = easeInOutCubic(0, 50, 100, 400);
    expect(result).toBe(50);
  });

  test('easeInOutCubic - elapsed 为负值时递减', () => {
    // end - start = -100 → 从 100 递减到 0
    const result = easeInOutCubic(0, 100, 0, 400);
    expect(result).toBe(100);
    const end = easeInOutCubic(400, 100, 0, 400);
    expect(end).toBeCloseTo(0, 5);
  });

  test('easeInOutCubic - current 为负值时返回小于 start 的值', () => {
    // time = -100/200 = -0.5 < 1 → 前半段公式
    // elapsed/2 * (-0.5)^3 = 50 * (-0.125) = -6.25
    const result = easeInOutCubic(-100, 0, 100, 400);
    expect(result).toBeCloseTo(-6.25, 5);
  });

  test('easeInOutCubic - current 超过 duration 时值超出 end（无 clamp）', () => {
    // time = 500/200 = 2.5 > 1 → 后半段: time -= 2 → 0.5
    // elapsed/2 * (0.125 + 2) = 50 * 2.125 = 106.25
    const result = easeInOutCubic(500, 0, 100, 400);
    expect(result).toBeCloseTo(106.25, 5);
  });
});
