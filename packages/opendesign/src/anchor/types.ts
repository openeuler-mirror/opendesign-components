import type { ExtractPropTypes, PropType } from 'vue';

export const anchorProps = {
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
   * @zh-CN 锚点跳转的目标元素(带#前缀)
   * @en-US Target element for anchor navigation (with # prefix)
  */
  href: {
    type: String,
    required: true,
  },
  /**
   * @zh-CN 锚点跳转方式
   * @en-US Anchor navigation method
   * @default '_self'
  */
  target: {
    type: String as PropType<'_blank' | '_parent' | '_self' | '_top'>,
    default: '_self',
  },
};

export type AnchorContainerT = HTMLElement | Window;

export type AnchorPropsT = ExtractPropTypes<typeof anchorProps>;
export type AnchorItemPropsT = ExtractPropTypes<typeof anchorItemProps>;
