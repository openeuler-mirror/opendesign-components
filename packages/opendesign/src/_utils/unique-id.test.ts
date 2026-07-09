/**
 * _utils/unique-id.ts 递增 ID 生成器测试。
 *
 * 验证 useGetUniqueId 工厂函数返回的闭包每次调用递增。
 */
import { test, expect, describe } from 'vitest';
import { useGetUniqueId } from './unique-id';

describe('useGetUniqueId', () => {
  test('useGetUniqueId - 每次调用递增 1', () => {
    const getId = useGetUniqueId();
    expect(getId()).toBe(1);
    expect(getId()).toBe(2);
    expect(getId()).toBe(3);
  });

  test('useGetUniqueId - 多个实例各自独立计数', () => {
    const getIdA = useGetUniqueId();
    const getIdB = useGetUniqueId();
    expect(getIdA()).toBe(1);
    expect(getIdB()).toBe(1);
    expect(getIdA()).toBe(2);
    expect(getIdB()).toBe(2);
  });
});
