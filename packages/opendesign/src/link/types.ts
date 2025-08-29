import { ExtractPropTypes, PropType, Component } from 'vue';
import { ColorT } from '../_utils/types';

export const LinkSizeTypes = ['large', 'medium', 'small', 'auto'] as const;
export type LinkSizeT = (typeof LinkSizeTypes)[number];

export const linkProps = {
  /**
   * @zh-CN 包含超链接指向的 URL 或 URL 片段
   * @en-US Contains the URL or URL fragment pointed to by the hyperlink
   */
  href: {
    type: String,
  },
  /**
   * @zh-CN 指定在何处显示链接的资源
   * @en-US Specify where to display the linked resource
   */
  target: {
    type: String as PropType<'_blank' | '_parent' | '_self' | '_top'>,
  },
  /**
   * @zh-CN 是否为loading状态
   * @en-US Whether it is in the loading state
   */
  loading: {
    type: Boolean,
  },
  /**
   * @zh-CN 链接颜色
   * @en-US Link color
   * @default 'normal'
   */
  color: {
    type: String as PropType<ColorT>,
    default: 'normal',
  },
  /**
   * @zh-CN 尺寸大小
   * @en-US size
   * @default 'auto'
   */
  size: {
    type: String as PropType<LinkSizeT>,
    default: 'auto',
  },
  /**
   * @zh-CN 是否禁用
   * @en-US Whether to disable
   */
  disabled: {
    type: Boolean,
  },
  /**
   * @zh-CN 前缀图标
   * @en-US Prefix icon
   */
  icon: {
    type: Object as PropType<Component>,
  },
  /**
   * @zh-CN 后缀
   * @en-US Suffix
   */
  suffix: {
    type: Boolean,
  },
  /**
   * @zh-CN hover时是否显示背景
   * @en-US Whether the background is displayed when hovering
   */
  hoverBg: {
    type: Boolean,
  },
  /**
   * @zh-CN hover时是否显示下划线
   * @en-US Whether an underline is displayed when hovering
   */
  hoverUnderline: {
    type: Boolean,
  },
  /**
   * @zh-CN 元素标签
   * @en-US Element tag
   * @default 'a'
   */
  tag: {
    type: String,
    default: 'a',
  },
  /**
   * @zh-CN 全局配置是否生效
   * @en-US Whether the global configuration takes effect
   * @default true
   */
  global: {
    type: Boolean,
    default: true,
  },
};

export type LinkPropsT = ExtractPropTypes<typeof linkProps>;
