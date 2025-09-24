import { PopupPositionT, PopupTriggerT } from '../popup';
import { ExtractPropTypes, PropType } from 'vue';
import type { SizeT, RoundT, VariantT, Color2T } from '../_utils/types';

export const OptionWidthModeTypes = ['auto', 'min-width', 'width'] as const;
export type OptionWidthModeT = (typeof OptionWidthModeTypes)[number];

export interface SelectOptionT {
  label: string;
  value: string | number;
}
export type SelectValueT = string | number | string[] | number[] | (string | number)[];

export const selectProps = {
  /**
   * @zh-CN 选择框的值 v-model
   * @en-US Select the value of the box.
   */
  modelValue: {
    type: [String, Number, Array] as PropType<SelectValueT>,
  },
  /**
   * @zh-CN 选择框的默认值，非受控
   * @en-US The default value of the selection box is uncontrolled.
   */
  defaultValue: {
    type: [String, Number, Array] as PropType<SelectValueT>,
  },
  /**
   * @zh-CN 选择框大小
   * @en-US Select box size.
   */
  size: {
    type: String as PropType<SizeT>,
  },
  /**
   * @zh-CN 选择框圆角
   * @en-US Select the rounded corners of the box
   */
  round: {
    type: String as PropType<RoundT>,
  },
  /**
   * @zh-CN 选择框颜色
   * @en-US Select box color.
   * @default 'normal'
   */
  color: {
    type: String as PropType<Color2T>,
    default: 'normal',
  },
  /**
   * @zh-CN 选择框变体
   * @en-US Selection box variant.
   * @default 'outline'
   */
  variant: {
    type: String as PropType<VariantT>,
    default: 'outline',
  },
  /**
   * @zh-CN 选择框提示文本
   * @en-US Select box prompt text.
   */
  placeholder: {
    type: String,
  },
  /**
   * @zh-CN 支持多选
   * @en-US Support multiple selections.
   */
  multiple: {
    type: Boolean,
  },
  /**
   * @zh-CN 多选标签最大显示数量
   * @en-US Maximum display quantity of multiple selection tags.
   */
  maxTagCount: {
    type: Number,
  },
  /**
   * @zh-CN 支持快速清除
   * @en-US Support quick clearing.
   */
  clearable: {
    type: Boolean,
  },
  /**
   * @zh-CN 支持禁用
   * @en-US Support disabling.
   */
  disabled: {
    type: Boolean,
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
   * @zh-CN 选项布局位置
   * @en-US Option layout location.
   * @default 'bl'
   */
  optionPosition: {
    type: String as PropType<PopupPositionT>,
    default: 'bl',
  },
  /**
   * @zh-CN 选项宽度自适应规则
   * 'auto': 自动
   * 'min-width': 最小宽度与选择框一致
   * 'width': 宽度与选择框一致
   * @en-US Option width adaptive rule.
   * 'auto': auto
   * 'min-width': The minimum width is consistent with the selection box.
   * 'width': The width is consistent with the selection box.
   * @default 'min-width'
   */
  optionWidthMode: {
    type: String as PropType<OptionWidthModeT>,
    default: 'min-width',
  },
  /**
   * @zh-CN 选项容器自定义类
   * @en-US Option container custom class.
   */
  optionWrapClass: {
    type: [String, Array] as PropType<string | any[]>,
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
   * @zh-CN 加载中
   * @en-US loading.
   */
  loading: {
    type: Boolean,
  },
  /**
   * @zh-CN 选择前回调，根据返回值判断是否显示
   * @en-US Select the pre-callback and determine whether to display based on the return value.
   */
  beforeSelect: {
    type: Function as PropType<(value: string | number, currentValue: SelectValueT) => Promise<boolean | string | number> | boolean | string | number>,
  },
  /**
   * @zh-CN 显示前回调，根据返回值判断是否显示
   * @en-US Display the callback before display, and determine whether to display based on the return value.
   */
  beforeOptionsShow: {
    type: Function as PropType<() => Promise<boolean> | boolean>,
  },
  /**
   * @zh-CN 隐藏前回调，根据返回值判断是否隐藏
   * @en-US Hide the previous callback and determine whether to hide it based on the return value.
   */
  beforeOptionsHide: {
    type: Function as PropType<() => Promise<boolean> | boolean>,
  },
  /**
   * @zh-CN 选项挂载容器，默认为body
   * @en-US The option mounts the container, with the default being body.
   * @default 'body'
   */
  optionsWrapper: {
    type: [String, Object] as PropType<string | HTMLElement | null>,
    default: 'body',
  },
  /**
   * @zh-CN 多选超过最大tag时，以文本显示
   * @en-US When multiple selections exceed the maximum tag, they will be displayed as text.
   */
  foldLabel: {
    type: Function as PropType<(tags: Array<SelectOptionT>) => string>,
  },
  /**
   * @zh-CN 浮层显示收起的多选tag
   * @en-US The floating layer shows the multiple selected tags that have been folded.
   * @default 'hover'
   */
  showFoldTags: {
    type: [Boolean, String] as PropType<boolean | 'hover' | 'click'>,
    default: 'hover',
  },
  /**
   * @zh-CN 选项标题（pad、phone显示）
   * @en-US Option title (displayed on pad and phone).
   */
  optionTitle: {
    type: String,
  },
  /**
   * @zh-CN 支持选项浮层响应式
   * @en-US Support option floating layer responsiveness.
   */
  noResponsive: {
    type: Boolean,
  },
};

export type SelectPropsT = ExtractPropTypes<typeof selectProps>;
