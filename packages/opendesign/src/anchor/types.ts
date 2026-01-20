import type { ExtractPropTypes, PropType } from 'vue';

import type { DirectionT } from '../_utils/types';

export type AnchorDirectionT = DirectionT;
export const AnchorSizeTypes = ['medium', 'small', 'menu'] as const;
export type AnchorSizeT = (typeof AnchorSizeTypes)[number];
export type AnchorTargetT = '_blank' | '_parent' | '_self' | '_top';

export const anchorProps = {
  /**
   * @zh-CN 锚点的方向，支持水平(h)与垂直(v)
   * @en-US The orientation of the anchor, supports both horizontal(h) and vertical(v).
   * @default 'v'
   */
  layout: {
    type: String as PropType<AnchorDirectionT>,
    default: 'v',
  },
  /**
   * @zh-CN 锚点的尺寸，仅垂直模式支持, menu为左侧菜单或移动端菜单混合使用
   * @en-US Anchor size, 'menu' for aside menu-mixed or mobile menu mode
   * @default 'medium'
   */
  size: {
    type: String as PropType<AnchorSizeT>,
    default: 'medium',
  },
  /**
   * @zh-CN 监测容器
   * @en-US Scroll container to monitor
   * @default window
   */
  container: {
    type: [String, Object] as PropType<string | HTMLElement | Window>,
  },
  /**
   * @zh-CN 锚点激活的边界范围
   * @en-US Boundary for anchor activation
   * @default 5
   */
  bounds: {
    type: Number,
    default: 5,
  },
  /**
   * @zh-CN 锚点激活的判定边界
   * @en-US Boundary for anchor activation
   * @default 0
   */
  targetOffset: {
    type: Number,
    default: 0,
  },
  /**
   * @zh-CN 点击锚点时是否改变浏览器地址栏的 hash 值
   * @en-US Whether to change the browser's address bar hash value when clicking the anchor
   * @default true
   */
  changeHash: {
    type: Boolean,
    default: true,
  },
};

export const anchorItemProps = {
  /**
   * @zh-CN 锚点标题
   * @en-US Anchor title
   */
  title: {
    type: String,
    default: '',
  },
  /**
   * @zh-CN 锚点监听、跳转的目标元素(带#前缀)
   * @en-US Target element for anchor navigation (with # prefix)
   */
  href: {
    type: String,
    required: true,
  },
  /**
   * @zh-CN 锚点监听的目标元素(带#前缀),不传时监听href
   * @en-US Target element for anchor observe (with # prefix)，Use href prop by default
   */
  observeHref: {
    type: String,
  },
  /**
   * @zh-CN 锚点跳转方式
   * @en-US Anchor navigation method
   * @default '_self'
   */
  target: {
    type: String as PropType<AnchorTargetT>,
    default: '_self',
  },
  /**
   * @zh-CN 锚点是否禁用
   * @en-US Anchor disable status
   * @default false
   */
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
};

export type AnchorContainerT = HTMLElement | Window;

export type AnchorPropsT = ExtractPropTypes<typeof anchorProps>;
export type AnchorItemPropsT = ExtractPropTypes<typeof anchorItemProps>;
