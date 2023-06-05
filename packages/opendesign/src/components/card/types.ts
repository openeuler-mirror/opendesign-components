import { ExtractPropTypes, PropType, Component } from 'vue';

export const DirectionTypes = ['h', 'v', 'hr'] as const;
export type DirectionT = (typeof DirectionTypes)[number];

export const CardHoverCursorTypes = ['auto', 'pointer'] as const;
export type CardHoverCursorT = (typeof CardHoverCursorTypes)[number];

export const cardProps = {
  /**
   * 布局 DirectionT
   */
  layout: {
    type: String as PropType<DirectionT>,
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
   * 图标
   */
  icon: {
    type: Object as PropType<Component>,
  },
  /**
   * 标题
   */
  title: {
    type: String,
  },
  /**
   * 详情
   */
  detail: {
    type: String,
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
};

export type CardPropsT = ExtractPropTypes<typeof cardProps>;
