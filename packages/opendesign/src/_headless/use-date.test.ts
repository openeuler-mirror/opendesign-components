/**
 * _headless/use-date.ts 日期 headless 逻辑测试。
 *
 * 验证 useDate 返回的 value ref 可读写。
 */
import { test, expect, describe } from 'vitest';
import { useDate } from './use-date';

describe('useDate', () => {
  test('useDate - 返回 value ref 初始为 undefined', () => {
    const { value } = useDate();
    expect(value.value).toBeUndefined();
  });

  test('useDate - value 可赋值为 Date', () => {
    const { value } = useDate();
    const date = new Date('2024-06-15');
    value.value = date;
    expect(value.value).toBe(date);
  });

  test('useDate - value 可更新', () => {
    const { value } = useDate();
    const date1 = new Date('2024-01-01');
    const date2 = new Date('2024-12-31');
    value.value = date1;
    expect(value.value).toBe(date1);
    value.value = date2;
    expect(value.value).toBe(date2);
  });
});
