import { ExtractPropTypes, PropType, Component } from 'vue';
import type { DirectionT } from '../_utils/types';

export type CardDirectionT = DirectionT | 'hr';

export const CardCoverFitTypes = ['cover', 'contain', 'fill', 'none', 'scale-down'] as const;
export type CardCoverFitT = (typeof CardCoverFitTypes)[number];

export const CardHoverCursorTypes = ['auto', 'pointer'] as const;
export type CardHoverCursorT = (typeof CardHoverCursorTypes)[number];

export const cardProps = {
  /**
   * @zh-CN 卡片方向（'v'为竖向，'h'为横向，'hr'为反向横向）
   * @en-US Card direction('v' for vertical, 'h' for horizontal, 'hr' for reversed horizontal)
   * @default 'v'
   */
  layout: {
    type: String as PropType<CardDirectionT>,
    default: 'v',
  },
  /**
   * @zh-CN 封面图片url
   * @en-US Card cover image URL
   */
  cover: {
    type: String,
  },
  /**
   * @zh-CN 封面长宽比
   * @en-US Cover aspect ratio
   */
  coverRatio: {
    type: Number,
  },
  /**
   * @zh-CN 封面填充方式
   * @en-US Cover fit type
   * @default 'cover'
   */
  coverFit: {
    type: String as PropType<CardCoverFitT>,
    default: 'cover',
  },
  /**
   * @zh-CN 图标
   * @en-US Icon
   */
  icon: {
    type: [String, Object] as PropType<string | Component>,
  },
  /**
   * @zh-CN 标题
   * @en-US Title
   */
  title: {
    type: String,
  },
  /**
   * @zh-CN 标题行数（影响标题盒子高度）
   * @en-US Title row count (affects the height of the title box)
   */
  titleRow: {
    type: Number,
  },
  /**
   * @zh-CN 标题最大行数（超过此行数会显示省略号）
   * @en-US Title maximum row count (exceeds this row count will show ellipsis)
   */
  titleMaxRow: {
    type: Number,
  },
  /**
   * @zh-CN 详情
   * @en-US Detail
   */
  detail: {
    type: String,
  },
  /**
   * @zh-CN 详情行数（影响详情盒子高度）
   * @en-US Detail row count (affects the height of the detail box)
   */
  detailRow: {
    type: Number,
  },
  /**
   * @zh-CN 详情最大行数（超过此行数会显示省略号）
   * @en-US Detail maximum row count (exceeds this row count will show ellipsis)
   */
  detailMaxRow: {
    type: Number,
  },
  /**
   * @zh-CN 是否有鼠标悬停效果
   * @en-US Whether the card has a hover effect
   */
  hoverable: {
    type: Boolean,
  },
  /**
   * @zh-CN 鼠标悬停时的光标样式
   * @en-US Cursor style when hovering over the card
   * @default 'auto'
   */
  cursor: {
    type: String as PropType<CardHoverCursorT>,
    default: 'auto',
  },
  /**
   * @zh-CN 封面盒子的类名（用来定制封面样式）
   * @en-US Class name for the cover box (used to customize the cover style)
   */
  coverClass: {
    type: [String, Array] as PropType<string | any[]>,
  },
  /**
   * @zh-CN 跳转链接（该属性有值时，卡片会被渲染为链接）
   * @en-US Link URL (when this property has a value, the card will be rendered as a link)
   */
  href: {
    type: String,
  },
  /**
   * @zh-CN 卡片尺寸是否跟随视口大小变化而变化
   * @en-US Whether the card size changes with the viewport size
   */
  noResponsive: {
    type: Boolean,
  },
};

export type CardPropsT = ExtractPropTypes<typeof cardProps>;
