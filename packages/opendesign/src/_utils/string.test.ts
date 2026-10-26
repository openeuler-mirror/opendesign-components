/**
 * _utils/string.ts 字符串工具函数测试。
 *
 * 覆盖 escapeRegExp 和 splitByMatch 函数。
 */
import { test, expect, describe } from 'vitest';
import { escapeRegExp, splitByMatch } from './string';

describe('escapeRegExp', () => {
  test('escapeRegExp - 转义正则特殊字符', () => {
    expect(escapeRegExp('a.b*c+d')).toBe('a\\.b\\*c\\+d');
  });
  test('escapeRegExp - 转义括号和方括号', () => {
    expect(escapeRegExp('(test)[item]')).toBe('\\(test\\)\\[item\\]');
  });
  test('escapeRegExp - 无特殊字符时原样返回', () => {
    expect(escapeRegExp('hello')).toBe('hello');
  });
  test('escapeRegExp - 空字符串返回空', () => {
    expect(escapeRegExp('')).toBe('');
  });
  test('escapeRegExp - 转义反斜杠和美元符号', () => {
    expect(escapeRegExp('a\\b$c')).toBe('a\\\\b\\$c');
  });
});

describe('splitByMatch', () => {
  test('splitByMatch - 按关键字分割字符串', () => {
    const result = splitByMatch('hello world hello', 'hello');
    expect(result).toEqual(['', 'hello', ' world ', 'hello']);
  });
  test('splitByMatch - 大小写不敏感', () => {
    const result = splitByMatch('Hello HELLO hello', 'hello');
    expect(result).toEqual(['', 'Hello', ' ', 'HELLO', ' ', 'hello']);
  });
  test('splitByMatch - 使用 RegExp 作为关键字', () => {
    const result = splitByMatch('a1b2c3', /[0-9]/g);
    expect(result).toEqual(['a', '1', 'b', '2', 'c', '3']);
  });
  test('splitByMatch - 空字符串或空关键字返回空数组', () => {
    expect(splitByMatch('', 'test')).toEqual([]);
    expect(splitByMatch('test', '')).toEqual([]);
  });
  test('splitByMatch - 无匹配时返回整段字符串', () => {
    const result = splitByMatch('abc', 'xyz');
    expect(result).toEqual(['abc']);
  });
  test('splitByMatch - 连续匹配正确处理', () => {
    const result = splitByMatch('aaa', 'a');
    expect(result).toEqual(['', 'a', '', 'a', '', 'a']);
  });

  test('splitByMatch - 传入不带 g 标志的 RegExp 时抛 TypeError', () => {
    // String.prototype.matchAll 要求 RegExp 必须有 global 标志
    expect(() => splitByMatch('a1b2', /[0-9]/)).toThrow(TypeError);
  });
});
