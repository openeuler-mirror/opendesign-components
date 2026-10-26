import type { ComputedRef } from 'vue';
import type { Alignment } from '../types';

/**
 * @description 轴选择器配置对象
 */
export interface AxisSelector {
  /** 获取元素的滚动偏移量 */
  getScroll: (el: HTMLElement) => number;
  /** 设置元素的滚动偏移量 */
  setScroll: (el: HTMLElement, val: number) => void;
  /** 获取元素的主轴尺寸 */
  getAxisSize: (el: HTMLElement) => number;
  /** 获取元素的主轴滚动范围 */
  getScrollSize: (el: HTMLElement) => number;
  /** 获取元素的主轴可视尺寸 */
  getClientSize: (el: HTMLElement) => number;
  /** 调用 scrollTo 并在正确的轴上设置偏移量 */
  scrollToPos: (el: HTMLElement, pos: number, behavior: ScrollBehavior) => void;
}

/**
 * @description 根据布局方向创建轴选择器
 * @param isHorizontal 是否水平布局
 * @returns 轴选择器方法对象
 */
export function createAxisSelector(isHorizontal: ComputedRef<boolean>): AxisSelector {
  const h = () => isHorizontal.value;
  return {
    getScroll: (el) => (h() ? el.scrollLeft : el.scrollTop),
    setScroll: (el, val) => {
      if (h()) {
        el.scrollLeft = val;
      } else {
        el.scrollTop = val;
      }
    },
    getAxisSize: (el) => (h() ? el.offsetWidth : el.offsetHeight),
    getScrollSize: (el) => (h() ? el.scrollWidth : el.scrollHeight),
    getClientSize: (el) => (h() ? el.clientWidth : el.clientHeight),
    scrollToPos: (el, pos, behavior) => {
      el.scrollTo({
        [h() ? 'left' : 'top']: pos,
        behavior,
      } as ScrollToOptions);
    },
  };
}

/**
 * @description 尺寸信息配置对象
 */
export interface SizeInfo {
  /** 容器主轴尺寸 */
  containerSize: number;
  /** 目标项的尺寸 */
  itemSize: number;
}

/**
 * @description 计算滚动目标位置（对齐策略）
 * @param itemTop 目标项的 top 偏移量
 * @param align 对齐方式
 * @param sizes 尺寸信息
 * @returns 最终滚动目标位置
 */
export function calculateScrollTarget(itemTop: number, align: Alignment, sizes: SizeInfo): number {
  const { containerSize, itemSize } = sizes;
  if (align === 'start') {
    return itemTop;
  }
  if (align === 'center') {
    return itemTop - containerSize / 2 + itemSize / 2;
  }
  if (align === 'end') {
    return itemTop - containerSize + itemSize;
  }
  if (typeof align === 'number') {
    return itemTop - align;
  }
  return itemTop;
}

/**
 * @description 视口位置信息配置对象
 */
export interface ViewportInfo {
  /** 当前滚动位置 */
  currentScroll: number;
  /** 目标项 top */
  itemTop: number;
  /** 目标项尺寸 */
  itemSize: number;
  /** 容器尺寸 */
  containerSize: number;
}

/**
 * @description 解析 'nearest' 对齐方式为具体对齐
 * @param viewport 视口位置信息
 * @returns 解析后的对齐方式，或 null 表示已在视口内无需滚动
 */
export function resolveNearestAlign(viewport: ViewportInfo): Alignment | null {
  const { currentScroll, itemTop, itemSize, containerSize } = viewport;
  if (currentScroll > itemTop) {
    return 'start';
  }
  if (currentScroll + containerSize < itemTop + itemSize) {
    return 'end';
  }
  return null;
}
