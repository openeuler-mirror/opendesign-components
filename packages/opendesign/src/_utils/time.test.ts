/**
 * _utils/time.ts 时间工具函数测试。
 *
 * 覆盖 pad / dateTimeNumberToString / stringToDateTimeNumber。
 */
import { test, expect, describe } from 'vitest';
import { pad, dateTimeNumberToString, stringToDateTimeNumber } from './time';

describe('pad', () => {
  test('pad - 单数字补零到两位', () => {
    expect(pad(1)).toBe('01');
    expect(pad(9)).toBe('09');
  });

  test('pad - 两位数字不补零', () => {
    expect(pad(10)).toBe('10');
    expect(pad(99)).toBe('99');
  });

  test('pad - 指定 maxLength=3', () => {
    expect(pad(5, 3)).toBe('005');
    expect(pad(42, 3)).toBe('042');
  });

  test('pad - 0 补零', () => {
    expect(pad(0)).toBe('00');
  });
});

describe('dateTimeNumberToString', () => {
  test('dateTimeNumberToString - 完整日期时间格式化', () => {
    const result = dateTimeNumberToString({ year: 2024, month: 1, date: 15, hour: 10, minute: 30, second: 0 }, { format: 'YYYY-MM-DD HH:mm:ss' });
    expect(result).toBe('2024-01-15 10:30:00');
  });

  test('dateTimeNumberToString - 仅时间模式（timeOnly=true）', () => {
    const result = dateTimeNumberToString({ hour: 14, minute: 5, second: 30 }, { format: 'HH:mm:ss', timeOnly: true });
    expect(result).toBe('14:05:30');
  });

  test('dateTimeNumberToString - timeOnly=true 时自动补全年月日到 1970-1-1', () => {
    // timeOnly=true 时不校验 year/month/date，自动补全为 1970-1-1
    const result = dateTimeNumberToString({ hour: 8, minute: 0, second: 0 }, { format: 'YYYY-MM-DD HH:mm', timeOnly: true });
    expect(result).toBe('1970-01-01 08:00');
  });

  test('dateTimeNumberToString - 字段为 null 时返回 undefined', () => {
    const result = dateTimeNumberToString({ year: 2024, month: null, date: 15, hour: 10, minute: 30, second: 0 }, { format: 'YYYY-MM-DD' });
    expect(result).toBeUndefined();
  });

  test('dateTimeNumberToString - timeOnly 时缺少时分秒返回 undefined', () => {
    const result = dateTimeNumberToString({ hour: 14, minute: null, second: 30 }, { format: 'HH:mm:ss', timeOnly: true });
    expect(result).toBeUndefined();
  });

  test('dateTimeNumberToString - year 超出 dayjs 支持范围时返回 undefined', () => {
    const result = dateTimeNumberToString({ year: 99999999, month: 1, date: 15, hour: 10, minute: 30, second: 0 }, { format: 'YYYY-MM-DD' });
    expect(result).toBeUndefined();
  });
});

describe('stringToDateTimeNumber', () => {
  test('stringToDateTimeNumber - 解析完整日期时间字符串', () => {
    const result = stringToDateTimeNumber('2024-01-15 10:30:00');
    expect(result).toEqual({
      year: 2024,
      month: 1,
      date: 15,
      hour: 10,
      minute: 30,
      second: 0,
    });
  });

  test('stringToDateTimeNumber - timeOnly=true 只返回时分秒', () => {
    const result = stringToDateTimeNumber('10:30:00', { timeOnly: true });
    expect(result).toEqual({ hour: 10, minute: 30, second: 0 });
  });

  test('stringToDateTimeNumber - timeOnly 时不带空格的字符串自动补全日期', () => {
    const result = stringToDateTimeNumber('14:00', { timeOnly: true });
    expect(result).toEqual({ hour: 14, minute: 0, second: 0 });
  });

  test('stringToDateTimeNumber - null / undefined 返回 undefined', () => {
    expect(stringToDateTimeNumber(null)).toBeUndefined();
    expect(stringToDateTimeNumber(undefined)).toBeUndefined();
  });

  test('stringToDateTimeNumber - month 从 1 开始（dayjs 从 0 开始）', () => {
    const result = stringToDateTimeNumber('2024-01-01 00:00:00');
    expect(result?.month).toBe(1);
  });

  test('stringToDateTimeNumber - 无效日期字符串时各字段为 null', () => {
    const result = stringToDateTimeNumber('invalid-date');
    expect(result).toEqual({
      year: null,
      month: null,
      date: null,
      hour: null,
      minute: null,
      second: null,
    });
  });
});
