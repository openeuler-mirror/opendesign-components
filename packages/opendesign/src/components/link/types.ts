import { ExtractPropTypes, PropType } from 'vue';
import { ColorT } from '../_shared/global';

export const linkProps = {
  /**
   * 包含超链接指向的 URL 或 URL 片段。
   */
  href: {
    type: String,
  },
  /**
   * 指定在何处显示链接的资源。
   */
  target: {
    type: String as PropType<'_blank' | '_parent' | '_self' | '_top'>,
  },
  /**
   * 是否为loading状态
   */
  loading: {
    type: Boolean,
  },
  /**
   * 链接颜色
   */
  color: {
    type: String as PropType<ColorT>,
    default: 'normal'
  },
  /**
   * 是否禁用
   */
  disabled: {
    type: Boolean,
  },
  /**
   * 前缀图标
   */
  iconPrefix: {
    type: Boolean,
  },
  /**
   * 图标箭头
   */
  iconArrow: {
    type: Boolean,
  },
  /**
   * hover时是否显示背景
   */
  hoverable: {
    type: Boolean,
  },
};

export type LinkPropsT = ExtractPropTypes<typeof linkProps>;
