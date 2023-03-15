import { ExtractPropTypes, PropType } from 'vue';

export const dialogProps = {
  /**
   * 封面
   */
  layout: {
    type: String as PropType<'h' | 'v' | 'hr'>,
    default: 'v'
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
   * 尺寸
   */
  size: {
    type: String as PropType<'medium' | 'large'>,
    default: 'medium'
  },
  /**
   * 标题最大行数
   */
  titleMaxRow: {
    type: Number,
  },
  /**
   * 详情最大行数
   */
  detailMaxRow: {
    type: Number,
  },
  /**
   * 链接跳转
   */
  href: {
    type: String,
  }

};

export type DialogPropsT = ExtractPropTypes<typeof dialogProps>;
