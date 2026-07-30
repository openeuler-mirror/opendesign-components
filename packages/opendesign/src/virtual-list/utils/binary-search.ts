/**
 * @description 元数据访问器——提供 top/bottom 查询能力
 */
export interface MetaAccessor {
  /** 获取指定索引项的 top 偏移量 */
  getTop: (i: number) => number;
  /** 获取指定索引项的 bottom 偏移量 */
  getBottom: (i: number) => number;
}

/**
 * @description 二分查找：根据滚动偏移量定位可视区起始项索引
 *
 * 使用标准二分 start=mid+1 / end=mid-1，确保每次迭代搜索区间严格缩小。
 * @param length 元数据数组长度
 * @param scrollOffset 当前滚动偏移量
 * @param accessor 元数据访问器
 * @returns 可视区起始项索引
 */
export function findIndexByOffset(length: number, scrollOffset: number, accessor: MetaAccessor): number {
  if (length === 0) {
    return 0;
  }
  let start = 0;
  let end = length - 1;

  while (start < end) {
    const mid = Math.floor((start + end) / 2);
    const top = accessor.getTop(mid);
    const bottom = accessor.getBottom(mid);

    if (top <= scrollOffset && bottom > scrollOffset) {
      return mid;
    }
    if (bottom <= scrollOffset) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  return Math.max(0, Math.min(start, length - 1));
}
