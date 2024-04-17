import { ExtractPropTypes, PropType, Component } from 'vue';
import type { DirectionT } from '../_utils/types';

export type CardDirectionT = DirectionT | 'hr';

export const CardCoverFitTypes = ['cover', 'contain', 'fill', 'none', 'scale-down'] as const;
export type CardCoverFitT = (typeof CardCoverFitTypes)[number];

export const CardHoverCursorTypes = ['auto', 'pointer'] as const;
export type CardHoverCursorT = (typeof CardHoverCursorTypes)[number];

export const cardProps = {
  /**
   * 布局 CardDirectionT
   */
  layout: {
    type: String as PropType<CardDirectionT>,
    default: 'v',
  },
  /**
   * 封面
   */
  cover: {
    type: String,
  },
  /**
   * 封面长宽比
   */
  coverRatio: {
    type: Number,
  },
  /**
   * 填充方式 cover | contain | fill | none | scale-down
   */
  coverFit: {
    type: String as PropType<CardCoverFitT>,
    default: 'cover',
  },
  /**
   * 图标
   */
  icon: {
    type: [String, Object] as PropType<string | Component>,
  },
  /**
   * 标题
   */
  title: {
    type: String,
  },
  /**
   * 标题行数
   */
  titleRow: {
    type: Number,
  },
  /**
   * 标题最大行数
   */
  titleMaxRow: {
    type: Number,
  },
  /**
   * 详情
   */
  detail: {
    type: String,
  },
  /**
   * 详情行数
   */
  detailRow: {
    type: Number,
  },
  /**
   * 详情最大行数
   */
  detailMaxRow: {
    type: Number,
  },
  /**
   * 可hover
   */
  hoverable: {
    type: Boolean,
  },
  /**
   * 鼠标样式
   */
  cursor: {
    type: String as PropType<CardHoverCursorT>,
    default: 'auto',
  },
  /**
   * cover classname
   */
  coverClass: {
    type: [String, Array] as PropType<string | any[]>,
  },
  /**
   * 链接跳转
   */
  href: {
    type: String,
  },
  /**
   * 卡片是否响应式
   */
  noResponsive: {
    type: Boolean,
  },
};

export type CardPropsT = ExtractPropTypes<typeof cardProps>;
