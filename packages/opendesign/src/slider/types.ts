import type { ExtractPropTypes, PropType, ComponentPublicInstance, Ref, CSSProperties } from 'vue';
import { type PopupPositionT } from '../popup/types';
import type { SizeT, DirectionT } from '../_utils/types';
import { isNumber, isArray } from '../_utils/is';
import type OSliderButton from './OSliderButton.vue';

export type Arrayable<T> = T | T[];

export interface SliderInitData {
  firstBtnVal: number;
  secondBtnVal: number;
  oldValue?: Arrayable<number>;
  isDragging: boolean;
  sliderSize: number;
}

export interface SliderButtonInitData {
  hovering: boolean;
  dragging: boolean;
  isClick: boolean;
  startX: number;
  currentX: number;
  startY: number;
  currentY: number;
  startPosition: number;
  newPosition: number;
  oldValue: number;
}

export const sliderProps = {
  /**
   * @zh-CN 双向绑定值
   * @en-US v-model value.
   * @default 0
   */
  modelValue: {
    type: [Number, Array] as PropType<Arrayable<number>>,
    default: 0,
  },
  /**
   * @zh-CN 滑动条最小值
   * @en-US The min value.
   * @default 0
   */
  min: {
    type: Number,
    default: 0,
  },
  /**
   * @zh-CN 滑动条最大值
   * @en-US The max value.
   * @default 100
   */
  max: {
    type: Number,
    default: 100,
  },
  /**
   * @zh-CN 每一分段值
   * @en-US Each segment value.
   * @default 1
   */
  step: {
    type: Number,
    default: 1,
  },
  /**
   * @zh-CN 禁用
   * @en-US Disabled.
   */
  disabled: {
    type: Boolean,
  },
  /**
   * @zh-CN 输入框尺寸
   * @en-US Input box size.
   */
  inputSize: {
    type: String as PropType<SizeT>,
  },
  /**
   * @zh-CN 显示输入框
   * @en-US Show input box.
   */
  showInput: {
    type: Boolean,
  },
  /**
   * @zh-CN 显示输入框控制器
   * @en-US Show input box controls.
   */
  showInputControls: {
    type: Boolean,
  },
  /**
   * @zh-CN 显示间隔点
   * @en-US Show stops.
   */
  showStops: {
    type: Boolean,
  },
  /**
   * @zh-CN 范围
   * @en-US Range.
   */
  range: {
    type: Boolean,
  },
  /**
   * @zh-CN 方向
   * @en-US Direction.
   */
  direction: {
    type: String as PropType<DirectionT>,
    default: 'h',
  },
  /**
   * @zh-CN 垂直方向滑动条高度
   * @en-US Vertical height.
   */
  height: {
    type: String,
  },
  /**
   * @zh-CN 气泡容器自定义类名
   * @en-US Custom class name for bubble container.
   */
  wrapClass: {
    type: String,
  },
  /**
   * @zh-CN 气泡定位方向
   * @en-US Bubble positioning direction.
   */
  position: {
    type: String as PropType<PopupPositionT>,
    default: 'bottom',
  },
  /**
   * @zh-CN 每个间隔点对应的标记
   * @en-US The label corresponding to each interval point.
   */
  marks: {
    type: Object as PropType<Record<number, string | sliderMarksPropsT['mark']>>,
  },
  /**
   * @zh-CN 单位
   * @en-US Unit.
   */
  unit: {
    type: String,
  },
  /**
   * @zh-CN 控制气泡渲染
   * @en-US Control bubble rendering.
   */
  showPopover: {
    type: Boolean,
    default: true,
  },
} as const;

export const sliderButtonProps = {
  /**
   * @zh-CN 双向绑定值
   * @en-US v-model value.
   * @default 0
   */
  modelValue: {
    type: Number,
    default: 0,
  },
  /**
   * @zh-CN 气泡定位方向
   * @en-US Bubble positioning direction.
   */
  position: {
    type: String as PropType<PopupPositionT>,
    default: 'top',
  },
  /**
   * @zh-CN 气泡容器自定义类名
   * @en-US Custom class name for bubble container.
   */
  wrapClass: {
    type: String,
  },
  /**
   * @zh-CN 方向
   * @en-US Direction.
   */
  direction: {
    type: String as PropType<DirectionT>,
    default: 'h',
  },
  /**
   * @zh-CN 控制间隔滑动条按钮实心圆渲染
   * @en-US Rendering of the solid circle of the control interval slider button.
   */
  showSolidCircle: {
    type: Boolean,
  },
  /**
   * @zh-CN 控制气泡渲染
   * @en-US Control bubble rendering.
   */
  showPopover: {
    type: Boolean,
  },
} as const;

export const sliderMarksProps = {
  /**
   * @zh-CN 每个间隔点对应的标记
   * @en-US The label corresponding to each interval point.
   */
  mark: {
    type: [String, Object] as PropType<string | { style: CSSProperties; label: any }>,
  },
} as const;

export type SliderButtonInstance = ComponentPublicInstance<typeof OSliderButton>;

export type ButtonRefs = Record<'firstButton' | 'secondButton', Ref<SliderButtonInstance | undefined>>;

const isValidValue = (value: Arrayable<number>) => isNumber(value) || (isArray(value) && value.every(isNumber));

export const sliderEmits = {
  'update:modelValue': isValidValue,
  input: isValidValue,
  change: isValidValue,
};

export type SliderEmits = typeof sliderEmits;

export type sliderPropsT = ExtractPropTypes<typeof sliderProps>;

export type sliderButtonPropsT = ExtractPropTypes<typeof sliderButtonProps>;

export type sliderMarksPropsT = ExtractPropTypes<typeof sliderMarksProps>;
