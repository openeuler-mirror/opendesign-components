import { ExtractPropTypes, PropType } from 'vue';

export const DirectionTypes = ['h', 'v', 'hr'] as const;
export type DirectionT = typeof DirectionTypes[number];

export const CardSizeTypes = ['medium', 'large'] as const;
export type CardSizeT = typeof CardSizeTypes[number];

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
   * 标题
   */
  title: {
    type: String,
  },
  /**
   * 标题
   */
  content: {
    type: String,
  },
  /**
   * 可hover
   */
  hoverable: {
    type: Boolean,
  },
  /**
   * cover classname
   */
  coverClass: {
    type: String,
  },
  /**
   * 尺寸 CardSizeT
   */
  size: {
    type: String as PropType<CardSizeT>,
    default: 'medium',
  },
  /**
   * 链接跳转
   */
  href: {
    type: String,
  },
};

export type CardPropsT = ExtractPropTypes<typeof cardProps>;
