import type { CSSProperties, ExtractPropTypes, PropType, VNode } from 'vue';
import { popupProps } from '../popup';
import type { ButtonPropsT } from '../button/types';

const { wrapper } = popupProps;

/**
 * @description 步骤按钮属性，基于 OButton props 透传，额外支持 children（按钮内容）和 onClick（自定义回调）
 */
export type TourBtnProps = ButtonPropsT & {
  /** @description 按钮内容 */
  children?: VNode | string;
  /** @description 按钮点击回调，在步骤切换完成后调用（prevButton 在 current 减 1 后，nextButton 在 current 加 1 或 finish 后） */
  onClick?: () => void;
};

/**
 * @description 目标元素位置信息
 */
export interface PosInfo {
  left: number;
  top: number;
  height: number;
  width: number;
  radius: number;
}

/** @description Tour 支持的弹出位置 */
export const TourPositionTypes = ['top', 'tl', 'tr', 'bottom', 'bl', 'br', 'left', 'lt', 'lb', 'right', 'rt', 'rb'] as const;

export type TourPositionT = (typeof TourPositionTypes)[number];

/**
 * @description OTour 组件 Props 定义
 */
export const tourProps = {
  /**
   * @zh-CN 引导卡片相对于目标元素的位置
   * @en-US Position of the guide card relative to the target element
   * @default 'bottom'
   */
  position: {
    type: String as PropType<TourPositionT>,
    default: 'bottom',
  },
  /**
   * @zh-CN 是否显示箭头
   * @en-US Whether to show the arrow
   * @default true
   */
  showArrow: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 箭头自定义类名
   * @en-US Arrow custom class name
   */
  arrowClass: {
    type: [String, Array, Object] as PropType<string | { [k: string]: boolean } | Array<{ [k: string]: boolean } | string>>,
  },
  /**
   * @zh-CN 引导卡片容器自定义类名
   * @en-US Custom class name for the guide card container
   * @since 1.2.7
   */
  popupClass: {
    type: String,
  },
  /**
   * @zh-CN 是否显示关闭按钮
   * @en-US Whether to show the close button
   * @default true
   */
  showClose: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 是否启用遮罩层，false 为非模态模式
   * @en-US Whether to enable the mask layer, false for non-modal mode
   * @default true
   */
  mask: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 镂空区域圆角，支持 'pill'（胶囊形，圆角为短边的一半）或任意 CSS 长度字符串（如 '8px'、'2em'）；未设置时默认 4px
   * @en-US Corner radius of the hollow area, supports 'pill' (capsule, radius is half of the shorter side) or any CSS length string (e.g. '8px', '2em'); defaults to 4px when unset
   */
  spotlightRadius: {
    type: String as PropType<string>,
  },
  wrapper,
  /**
   * @zh-CN 是否支持按 ESC 键关闭
   * @en-US Whether to support closing by pressing ESC
   * @default true
   */
  closeOnPressEscape: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 引导卡片自定义样式
   * @en-US Custom style for the guide card content
   */
  contentStyle: {
    type: Object as PropType<CSSProperties>,
  },
};

export type TourPropsT = typeof tourProps;

/**
 * @description OTourStep 组件 Props 定义
 */
export const tourStepProps = {
  /**
   * @zh-CN 引导指向的目标元素，支持选择器字符串、HTMLElement 或返回 HTMLElement 的函数，为空时居中显示
   * @en-US Target element the guide card points to, supports selector string, HTMLElement or function returning HTMLElement, center display when empty
   */
  target: {
    type: [String, Object, Function] as PropType<string | HTMLElement | (() => HTMLElement | null) | null>,
  },
  /**
   * @zh-CN 步骤标题
   * @en-US Step title
   */
  title: {
    type: String,
  },
  /**
   * @zh-CN 步骤详情
   * @en-US Step detail
   */
  detail: {
    type: String,
  },
  /**
   * @zh-CN 步骤图片地址
   * @en-US Step image URL
   */
  img: {
    type: String,
  },
  /**
   * @zh-CN 是否显示关闭按钮，优先级高于 Tour
   * @en-US Whether to show close button, higher priority than Tour
   */
  showClose: {
    type: Boolean,
    default: undefined,
  },
  /**
   * @zh-CN 是否显示箭头，优先级高于 Tour
   * @en-US Whether to show arrow, higher priority than Tour
   */
  showArrow: {
    type: Boolean,
    default: undefined,
  },
  /**
   * @zh-CN 引导卡片位置，优先级高于 Tour
   * @en-US Guide card position, higher priority than Tour
   */
  position: {
    type: String as PropType<TourPositionT>,
  },
  /**
   * @zh-CN 是否启用遮罩层，优先级高于 Tour
   * @en-US Whether to enable mask, higher priority than Tour
   */
  mask: {
    type: Boolean,
    default: undefined,
  },
  /**
   * @zh-CN 引导卡片自定义样式，优先级高于 Tour
   * @en-US Custom style for guide card content, higher priority than Tour
   */
  contentStyle: {
    type: Object as PropType<CSSProperties>,
  },
  /**
   * @zh-CN 上一步按钮属性
   * @en-US Previous button properties
   */
  prevButtonProps: {
    type: Object as PropType<TourBtnProps>,
  },
  /**
   * @zh-CN 下一步按钮属性
   * @en-US Next button properties
   */
  nextButtonProps: {
    type: Object as PropType<TourBtnProps>,
  },
};

export type TourStepPropsT = ExtractPropTypes<typeof tourStepProps>;
