/**
 * findIndexByOffset 二分查找单元测试。
 *
 * 覆盖：
 *   - 空数组 / 单元素数组
 *   - 定高模式（scrollOffset 落在项内部 / 等于 top / 超过末位 / 边界）
 *   - 不定高模式（可变高度 / 项间隙 / 首尾边界）
 */
import { describe, expect, test } from 'vitest';
import { findIndexByOffset, type MetaAccessor } from './binary-search';

/**
 * @description 创建固定高度的元数据访问器（每项 size 相同）
 * @param _count 项数量
 * @param itemSize 每项高度
 * @returns MetaAccessor 实例
 */
function createFixedAccessor(_count: number, itemSize: number): MetaAccessor {
  return {
    getTop: (i: number) => i * itemSize,
    getBottom: (i: number) => (i + 1) * itemSize,
  };
}

/**
 * @description 创建可变高度的元数据访问器
 * @param sizes 每项的高度数组
 * @returns MetaAccessor 实例
 */
function createVariableAccessor(sizes: number[]): MetaAccessor {
  const tops = sizes.reduce<number[]>((acc, _s, i) => {
    acc.push(i === 0 ? 0 : acc[i - 1] + sizes[i - 1]);
    return acc;
  }, []);
  const bottoms = sizes.map((s, i) => tops[i] + s);
  return {
    getTop: (i: number) => tops[i],
    getBottom: (i: number) => bottoms[i],
  };
}

describe('findIndexByOffset 二分查找', () => {
  test('空数组返回 0', () => {
    expect(findIndexByOffset(0, 100, createFixedAccessor(0, 80))).toBe(0);
  });

  test('单元素数组 scrollOffset=0 返回 0', () => {
    expect(findIndexByOffset(1, 0, createFixedAccessor(1, 80))).toBe(0);
  });

  test('定高模式 - scrollOffset 正好落在某项内部', () => {
    const accessor = createFixedAccessor(10, 80);
    // 第 3 项 top=240, bottom=320，scrollOffset=260 落在第 3 项
    expect(findIndexByOffset(10, 260, accessor)).toBe(3);
  });

  test('定高模式 - scrollOffset 等于某项 top', () => {
    const accessor = createFixedAccessor(10, 80);
    // scrollOffset=320 = 第 4 项 top，应返回 4
    expect(findIndexByOffset(10, 320, accessor)).toBe(4);
  });

  test('定高模式 - scrollOffset 超过最后一项 bottom 时返回最后一项索引', () => {
    const accessor = createFixedAccessor(10, 80);
    // 总高度 800，scrollOffset=800 超过最后一项 bottom=800 → 不落在任何项内
    // 二分查找收敛到最后一项索引 9
    expect(findIndexByOffset(10, 800, accessor)).toBe(9);
  });

  test('定高模式 - scrollOffset 落在最后一项内部时返回最后一项索引', () => {
    const accessor = createFixedAccessor(10, 80);
    // 项 9 top=720, bottom=800，scrollOffset=750 落在项 9
    expect(findIndexByOffset(10, 750, accessor)).toBe(9);
  });

  test('定高模式 - scrollOffset=0 返回第一项', () => {
    const accessor = createFixedAccessor(10, 80);
    expect(findIndexByOffset(10, 0, accessor)).toBe(0);
  });

  test('不定高模式 - scrollOffset 落在可变高度的项内部', () => {
    const accessor = createVariableAccessor([40, 60, 80, 100]);
    // 第 2 项 top=100, bottom=180，scrollOffset=130 落在第 2 项
    expect(findIndexByOffset(4, 130, accessor)).toBe(2);
  });

  test('不定高模式 - scrollOffset 等于首项 top', () => {
    const accessor = createVariableAccessor([40, 60, 80, 100]);
    expect(findIndexByOffset(4, 0, accessor)).toBe(0);
  });

  test('不定高模式 - scrollOffset 在项间隙', () => {
    const accessor = createVariableAccessor([40, 60, 80, 100]);
    // 第 0 项 bottom=40, 第 1 项 top=40
    // scrollOffset=40 → top<=40 && bottom>40 → 第 1 项
    expect(findIndexByOffset(4, 40, accessor)).toBe(1);
  });
});
