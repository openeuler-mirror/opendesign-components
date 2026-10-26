/**
 * 虚拟列表测试数据工厂函数。
 *
 * 所有工厂返回确定性数据（无随机因子），保证测试可重复。
 */

/** 定高列表项 */
export interface FixedListItem {
  label: string;
}

/** 带 id 的定高列表项 */
export interface FixedListItemWithId extends FixedListItem {
  id: string;
}

/** 不定高列表项 */
export interface DynamicListItem extends FixedListItemWithId {
  height: number;
}

/**
 * @description 生成固定高度的列表数据（每项 80px）
 * @param count 列表项数量
 * @returns 包含 label 字段的列表数据
 */
export function createFixedList(count: number): FixedListItem[] {
  return new Array(count).fill(1).map((_, idx) => ({
    label: `Item-${idx + 1}`,
  }));
}

/**
 * @description 生成固定高度且带 id 的列表数据
 * @param count 列表项数量
 * @returns 包含 id 和 label 字段的列表数据
 */
export function createFixedListWithId(count: number): FixedListItemWithId[] {
  return new Array(count).fill(1).map((_, idx) => ({ id: `key-${idx}`, label: `Item-${idx + 1}` }));
}

/**
 * @description 生成不定高度的列表数据（带 id 和递增 height）
 * @param count 列表项数量
 * @returns 包含 id、label、height 字段的列表数据
 */
export function createDynamicList(count: number): DynamicListItem[] {
  return new Array(count).fill(1).map((_, idx) => ({
    id: `dyn-${idx + 1}`,
    label: `DynItem-${idx + 1}`,
    height: 40 + idx * 4, // 40, 44, 48, ... 保证不随机但多样化
  }));
}
