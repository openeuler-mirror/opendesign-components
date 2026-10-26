import { ExtractPropTypes, PropType } from 'vue';
import { BaseScrollerPropsT } from '../scrollbar';

export interface RenderIndexInfo {
  start: number;
  end: number;
  visible: number;
  count: number;
}

/** 对齐方式 */
export type Alignment = 'start' | 'end' | 'center' | 'nearest' | number;

/** 布局方向 */
export type Layout = 'vertical' | 'horizontal';

/**
 * 虚拟滚动的子项不能使用margin，会导致总高度计算不准确（无法包含margin）
 */

export const virtualListProps = {
  /**
   * @zh-CN 默认滚动到第几项
   * @en-US Default scroll index
   * @default 0
   */
  defaultStartIndex: {
    type: Number,
    default: 0,
  },
  /**
   * @zh-CN 列表数据，如果数据存在动态追加，需要每一项需包含唯一ID
   * @en-US List data, if dynamic addition exists, each item must contain a unique ID
   */
  list: {
    type: Array as PropType<unknown[]>,
    required: true,
    default: () => [],
  },
  /**
   * @zh-CN 每一项的高度。传数字为定高模式；传函数为按项定高模式（函数接收 item 和 index 参数）；不传为不定高模式（运行时测量）
   * @en-US Height of each item. Number for fixed height; function for per-item height (receives item and index); undefined for dynamic height (measured at runtime)
   * @since 1.2.6
   */
  itemSize: {
    type: [Number, Function] as PropType<number | ((item: unknown, index: number) => number)>,
  },
  /**
   * @zh-CN 不定高时，每一项的默认高度
   * @en-US If the height of each item is not consistent, the default height of each item
   * @default 80
   */
  defaultItemSize: {
    type: Number,
    default: 80,
  },
  /**
   * @zh-CN 前后预留项，减少滚动式空白
   * @en-US Front and back reserved items, reducing scrolling blank
   * @default 1
   */
  buffer: {
    type: Number,
    default: 1,
  },
  /**
   * @zh-CN scrollbar配置项
   * @en-US scrollbar configuration item
   * @default true
   */
  scrollbar: {
    type: [Boolean, Object] as PropType<boolean | Partial<BaseScrollerPropsT>>,
    default: true,
  },
  /**
   * @zh-CN 布局方向，'vertical' 为垂直滚动，'horizontal' 为水平滚动
   * @en-US Layout direction, 'vertical' for vertical scrolling, 'horizontal' for horizontal scrolling
   * @default 'vertical'
   * @since 1.2.6
   */
  layout: {
    type: String as PropType<Layout>,
    default: 'vertical',
  },
  /**
   * @zh-CN 数据量阈值，低于此值不启用虚拟化；null 表示始终启用
   * @en-US Data count threshold, below which virtualization is disabled; null means always enabled
   * @default null
   * @since 1.2.6
   */
  threshold: {
    type: Number as PropType<number | null>,
    default: null,
  },
};
export type VirtualListPropsT = ExtractPropTypes<typeof virtualListProps>;

/**
 * 组件通过 ref 暴露给外部调用的方法集合
 *
 * @description 父组件可通过 `ref` 获取 OVirtualList 实例并调用以下方法，
 *              实现滚动到指定项、滚动到指定像素偏移等编程式滚动能力
 */
export interface VirtualListExpose {
  /**
   * 将指定索引的列表项滚动到视口内
   * @description 根据对齐策略将目标项滚动到可视区域。
   *              不定高模式下若目标项尚未测量，会先以 start 对齐触发渲染，
   *              测量后通过"二次逼近"机制重新滚动到精准位置
   * @param index 列表项索引（从 0 开始，越界时自动 clamp 到合法范围）
   * @param align 对齐方式，默认 'start'：
   *              - 'start'：项顶部对齐视口顶部
   *              - 'end'：项底部对齐视口底部
   *              - 'center'：项中心对齐视口中心
   *              - 'nearest'：仅在项不可见时滚动到最近的可见位置
   *              - number：项顶部减去指定像素偏移量
   * @param behavior 滚动行为，默认 'instant'：
   *                 - 'instant'：立即跳转到目标位置
   *                 - 'smooth'：平滑滚动（仅定高/按项定高模式支持，
   *                   不定高模式自动降级为 'instant'）
   */
  scrollToView(index: number, align?: Alignment, behavior?: ScrollBehavior): void;

  /**
   * 滚动到指定像素偏移量
   * @description 直接设置滚动容器的 scrollTop（水平模式为 scrollLeft），
   *              传入值会自动 clamp 到 [0, maxScroll] 范围内
   * @param px 像素偏移量（负值 clamp 到 0，超过最大范围 clamp 到 maxScroll）
   * @since 1.2.6
   */
  scrollToOffset(px: number): void;
}
