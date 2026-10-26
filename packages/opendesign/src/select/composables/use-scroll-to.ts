import type { ComputedRef, Ref } from 'vue';
import type { VirtualListExpose } from '../../virtual-list';
import type { SelectMixedOption, SelectOptionData, SelectOptionGroupData } from '../types';

/**
 * 编程式滚动管理的外部依赖
 */
interface UseScrollToDeps {
  /** 解析后的选项数据（含分组） */
  resolvedOptions: ComputedRef<SelectMixedOption[]>;
  /** 类型守卫：判断 SelectMixedOption 是否为分组选项 */
  isOptionGroup: (item: SelectMixedOption) => item is SelectOptionGroupData;
  /** 虚拟列表实例引用（虚拟模式下用于 scrollToView） */
  virtualListRef: ComputedRef<VirtualListExpose | null>;
  /** 选项容器引用（非虚拟模式下用于限定 querySelector 范围） */
  optionsRef: Ref<HTMLElement | null>;
  /** 开发警告函数 */
  warn: (msg: string) => void;
}

/**
 * 编程式滚动管理 composable
 * @description 提供 flattenOptions（展平分组选项）和 scrollTo（编程式滚动到指定选项）。
 * - 虚拟模式：调用 virtualListRef.scrollToView
 * - 非虚拟模式：手动滚动选项列表的可滚动容器，将目标选项带入可见区域。
 *   不使用 scrollIntoView，因为 OPopup 通过 ResizeObserver 异步定位，
 *   在 nextTick 中调用 scrollIntoView 时 popup 可能尚未定位完成，
 *   导致 option 元素位于页面顶部，scrollIntoView 滚动 window 引起页面跳转。
 * @param deps 外部依赖
 * @returns flattenOptions, scrollTo
 */
function UseScrollTo(deps: UseScrollToDeps) {
  const { resolvedOptions, isOptionGroup, virtualListRef, optionsRef, warn } = deps;

  /**
   * 将 resolvedOptions 展平为 SelectOptionData[]
   * 分组选项的 children 被展开到顶层
   * @returns 展平后的选项数组
   */
  const flattenOptions = (): SelectOptionData[] => {
    const flat: SelectOptionData[] = [];
    for (const item of resolvedOptions.value) {
      if (isOptionGroup(item)) {
        flat.push(...item.children);
      } else {
        flat.push(item);
      }
    }
    return flat;
  };

  /**
   * 解析 scrollTo 参数，返回目标索引
   * - number 类型直接返回
   * - 对象类型按 key/index 解析（key 与 index 互斥，同时传时以 key 为准）
   * @param index 选项索引或 { index, key } 对象
   * @returns 目标索引，无效时返回 undefined
   */
  const resolveScrollTarget = (index: number | { index?: number; key?: string | number }): number | undefined => {
    if (typeof index === 'number') return index;

    let targetKey: string | number | undefined;
    if (index.key !== undefined && index.index !== undefined) {
      // index 与 key 互斥，同时传时 dev warn 并以 key 为准
      warn('scrollTo 的 index 与 key 不应同时传入，以 key 为准');
      targetKey = index.key;
    } else if (index.key !== undefined) {
      targetKey = index.key;
    } else if (index.index !== undefined) {
      return index.index;
    }

    // key 模式：在 resolvedOptions 中查找 index
    if (targetKey !== undefined) {
      return flattenOptions().findIndex((o) => o.value === targetKey);
    }
    return undefined;
  };

  /**
   * 查找元素最近的可滚动祖先
   * @description 遍历父元素链，找到第一个 overflow 为 auto/scroll 且内容超出可视区域的元素。
   * 用于 scrollTo 中手动滚动 popup 内部容器，避免 scrollIntoView 滚动 window。
   * @param el 起始元素
   * @returns 可滚动祖先元素，未找到时返回 null
   */
  const findScrollableAncestor = (el: HTMLElement): HTMLElement | null => {
    let parent = el.parentElement;
    while (parent && parent !== document.body) {
      const style = getComputedStyle(parent);
      const overflowY = style.overflowY;
      if ((overflowY === 'auto' || overflowY === 'scroll') && parent.scrollHeight > parent.clientHeight) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return null;
  };

  /**
   * 编程式滚动到指定选项
   * - 虚拟模式：调用 virtualListRef.scrollToView
   * - 非虚拟模式：手动滚动选项列表的可滚动容器，将目标选项带入可见区域
   * @param index 选项索引或 { index, key } 对象（key 与 index 互斥，同时传时以 key 为准）
   */
  const scrollTo = (index: number | { index?: number; key?: string | number }) => {
    const targetIndex = resolveScrollTarget(index);
    if (targetIndex === undefined || targetIndex < 0) return;

    // 虚拟模式：调用 virtualListRef.scrollToView
    const virtualList = virtualListRef.value;
    if (virtualList) {
      virtualList.scrollToView(targetIndex);
      return;
    }

    // 非虚拟模式：手动滚动可滚动容器（用 optionsRef 限定查询范围）
    const container = optionsRef.value;
    if (!container) return;
    const optionEls = container.querySelectorAll('.o-option');
    if (!optionEls[targetIndex]) return;

    const optionEl = optionEls[targetIndex] as HTMLElement;
    // 查找选项元素最近的可滚动祖先，仅滚动该容器而非 window
    const scrollContainer = findScrollableAncestor(optionEl);
    if (!scrollContainer) return;

    const optionRect = optionEl.getBoundingClientRect();
    const containerRect = scrollContainer.getBoundingClientRect();
    // 选项在容器上方：向上滚动使选项顶部对齐容器顶部
    if (optionRect.top < containerRect.top) {
      scrollContainer.scrollTop -= containerRect.top - optionRect.top;
    } else if (optionRect.bottom > containerRect.bottom) {
      // 选项在容器下方：向下滚动使选项底部对齐容器底部
      scrollContainer.scrollTop += optionRect.bottom - containerRect.bottom;
    }
  };

  return {
    flattenOptions,
    scrollTo,
  };
}

export { UseScrollTo as useScrollTo };
