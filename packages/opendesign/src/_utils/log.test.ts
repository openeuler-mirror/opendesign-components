/**
 * _utils/log.ts 日志工具测试。
 *
 * 注意：vitest browser 模式下 process.env.NODE_ENV 在构建时被静态替换，
 * 无法在运行时动态切换。本测试只验证 Log 类的结构正确性。
 */
import { test, expect, describe } from 'vitest';
import { Log, log } from './log';

describe('Log', () => {
  test('Log - 默认实例有 info / warn / error 方法', () => {
    const _log = new Log();
    expect(typeof _log.info).toBe('function');
    expect(typeof _log.warn).toBe('function');
    expect(typeof _log.error).toBe('function');
  });

  test('Log - 带 prefix 的实例可正常创建', () => {
    const _log = new Log('TestModule');
    expect(typeof _log.info).toBe('function');
  });

  test('Log - 调用各方法不抛错', () => {
    const _log = new Log('Test');
    expect(() => _log.info('msg')).not.toThrow();
    expect(() => _log.warn('msg')).not.toThrow();
    expect(() => _log.error('msg')).not.toThrow();
  });

  test('log - 默认导出实例可用', () => {
    expect(typeof log.info).toBe('function');
    expect(typeof log.warn).toBe('function');
    expect(typeof log.error).toBe('function');
  });
});
