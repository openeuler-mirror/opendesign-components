/**
 * _utils/log.ts 日志工具测试。
 *
 * 覆盖两层：
 *   1. 结构契约：Log 实例有 info / warn / error 方法
 *   2. 行为契约：setLogEnabled 切换后 console 被实际调用，关闭时为 no-op
 */
import { test, expect, describe, vi, afterEach } from 'vitest';
import { Log, log, setLogEnabled } from './log';

describe('Log 结构契约', () => {
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

describe('Log 行为契约（setLogEnabled 切换）', () => {
  afterEach(() => setLogEnabled(false));

  test('Log - setLogEnabled(true) 后 warn 调用 console.warn 并携带前缀', () => {
    setLogEnabled(true);
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const _log = new Log('MyMod');
    _log.warn('hello');
    expect(spy).toHaveBeenCalledWith('[MyMod]', 'hello');
    spy.mockRestore();
  });

  test('Log - setLogEnabled(true) 后 info 调用 console.info 并携带前缀', () => {
    setLogEnabled(true);
    const spy = vi.spyOn(console, 'info').mockImplementation(() => {});
    const _log = new Log('MyMod');
    _log.info('hello');
    expect(spy).toHaveBeenCalledWith('[MyMod]', 'hello');
    spy.mockRestore();
  });

  test('Log - setLogEnabled(true) 后 error 调用 console.error 并携带前缀', () => {
    setLogEnabled(true);
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const _log = new Log('MyMod');
    _log.error('hello');
    expect(spy).toHaveBeenCalledWith('[MyMod]', 'hello');
    spy.mockRestore();
  });

  test('Log - 无 prefix 时 console 方法被调用无额外首参', () => {
    setLogEnabled(true);
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const _log = new Log();
    _log.warn('hello');
    expect(spy).toHaveBeenCalledWith('hello');
    spy.mockRestore();
  });

  test('Log - setLogEnabled(false) 时 warn 为 no-op，不调用 console', () => {
    setLogEnabled(false);
    const spy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const _log = new Log('Test');
    _log.warn('should be silent');
    expect(spy).not.toHaveBeenCalled();
    spy.mockRestore();
  });
});
