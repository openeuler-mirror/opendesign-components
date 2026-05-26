import { ExtractPropTypes, PropType } from 'vue';

import { PopupPositionT, PopupTriggerT } from '../popup';
import { inputProps } from '../input';
import { selectProps } from '../select';

export type DisabledHoursFn = () => number[];
export type DisabledMinutesFn = (hour: number) => number[];
export type DisabledSecondsFn = (hour: number, minute: number) => number[];

const { placeholder, inputId, disabled, readonly, size, round, color, variant } = inputProps;
const { noResponsive, optionTitle } = selectProps;
export const timePickerProps = {
  placeholder,
  inputId,
  disabled,
  readonly,
  size,
  round,
  color,
  variant,
  noResponsive,
  optionTitle,
  /**
   * @zh-CN 时间格式
   * @en-US Time format.
   * @default 'HH:mm:ss'
   */
  format: {
    type: String,
    default: 'HH:mm:ss',
  },
  /**
   * @zh-CN 选项触发方式
   * @en-US Option trigger method.
   * @default 'click'
   */
  trigger: {
    type: String as PropType<PopupTriggerT>,
    default: 'click',
  },
  /**
   * @zh-CN 支持快速清除
   * @en-US Support quick clearing.
   */
  clearable: {
    type: Boolean,
  },
  /**
   * @zh-CN 弹出框位置
   * @en-US Popup position.
   * @default 'bl'
   */
  popupPosition: {
    type: String as PropType<PopupPositionT>,
    default: 'bl',
  },
  /**
   * @zh-CN 弹出框挂载容器
   * @en-US Popup wrapper.
   * @default 'body'
   */
  popupWrapper: {
    type: [String, Object] as PropType<string | HTMLElement | null>,
    default: 'body',
  },
  /**
   * @zh-CN 是否在结束选择时，卸载所有选项，v-model
   * @en-US Whether to uninstall all options when ending the selection.
   * @default true
   */
  unmountOnHide: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 过渡名称
   * @en-US Transition name.
   */
  transition: {
    type: String,
  },
  /**
   * @zh-CN 步进：小时
   * @en-US Step for hours.
   * @default 1
   */
  hourStep: {
    type: Number,
    default: 1,
  },
  /**
   * @zh-CN 步进：分钟
   * @en-US Step for minutes.
   * @default 1
   */
  minuteStep: {
    type: Number,
    default: 1,
  },
  /**
   * @zh-CN 步进：秒
   * @en-US Step for seconds.
   * @default 1
   */
  secondStep: {
    type: Number,
    default: 1,
  },
  /**
   * @zh-CN 禁用的小时列表，返回被禁用的小时数组
   * @en-US Function to specify the hours that cannot be selected.
   */
  disabledHours: {
    type: Function as PropType<DisabledHoursFn>,
    default: undefined,
  },
  /**
   * @zh-CN 禁用的分钟列表，返回被禁用的分钟数组
   * @en-US Function to specify the minutes that cannot be selected.
   */
  disabledMinutes: {
    type: Function as PropType<DisabledMinutesFn>,
    default: undefined,
  },
  /**
   * @zh-CN 禁用的秒列表，返回被禁用的秒数组
   * @en-US Function to specify the seconds that cannot be selected.
   */
  disabledSeconds: {
    type: Function as PropType<DisabledSecondsFn>,
    default: undefined,
  },
  /**
   * @zh-CN 最小可选时间，可与 disabledHours/disabledMinutes/disabledSeconds 同时使用，约束效果取并集
   * @en-US Minimum selectable time. Can be used together with disabledHours/disabledMinutes/disabledSeconds; constraints are merged.
   */
  minTime: {
    type: String,
    default: undefined,
  },
  /**
   * @zh-CN 最大可选时间，可与 disabledHours/disabledMinutes/disabledSeconds 同时使用，约束效果取并集
   * @en-US Maximum selectable time. Can be used together with disabledHours/disabledMinutes/disabledSeconds; constraints are merged.
   */
  maxTime: {
    type: String,
    default: undefined,
  },
};
const {
  format,
  trigger,
  clearable,
  popupPosition,
  popupWrapper,
  unmountOnHide,
  transition,
  hourStep,
  minuteStep,
  secondStep,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
  minTime,
  maxTime,
} = timePickerProps;

export type TimePickerPropsT = ExtractPropTypes<typeof timePickerProps>;

export const timeRangePickerProps = {
  inputId,
  disabled,
  readonly,
  size,
  round,
  color,
  variant,
  noResponsive,
  optionTitle,
  format,
  trigger,
  clearable,
  popupPosition,
  popupWrapper,
  unmountOnHide,
  transition,
  hourStep,
  minuteStep,
  secondStep,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
  minTime,
  maxTime,
  /**
   * @zh-CN 提示文本-开始
   * @en-US Start prompt text.
   */
  placeholderStart: {
    type: String,
  },
  /**
   * @zh-CN 提示文本-结束
   * @en-US End prompt text.
   */
  placeholderEnd: {
    type: String,
  },
};

export type TimeRangePickerPropsT = ExtractPropTypes<typeof timeRangePickerProps>;

export interface DatePickerColumnOption {
  label: string;
  value: number;
}

export type TimePickerShortcutSlotProps = {
  setValue: (value?: string) => void;
  emitChange: () => void;
};

export type TimePickerRangeShortcutSlotProps = {
  setValue: (start?: string, end?: string) => void;
  emitChange: () => void;
};

export type TimeRangeValue = {
  start: string | undefined;
  end: string | undefined;
};
