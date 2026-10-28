import { ExtractPropTypes, PropType } from 'vue';
import { PopupPositionT, PopupTriggerT } from '../popup';
import type { RoundT, VariantT, SizeT } from '../_utils/types';

export type CascaderNodeValueT = string | number;
export type CascaderNodePathT = Array<CascaderNodeValueT>;
export type CascaderValueT = CascaderNodeValueT | CascaderNodePathT;

export type CascaderOptionT = {
  value: CascaderNodeValueT;
  label?: string;
  children?: CascaderOptionT[];
  disabled?: boolean;
  leaf?: boolean;
};

export const cascaderProps = {
  /**
   * @zh-CN 级联选择器选中值(v-model)
   * @en-US Cascader selected value (v-model)
   * @CascaderValueT string | number | Array<string | number>
   */
  modelValue: {
    type: [String, Number, Array] as PropType<CascaderValueT>,
    default: '',
  },
  /**
   * @zh-CN 级联选择器选项值
   * @en-US Cascader option value
   * @CascaderOptionT { value: string | number, label?: string, children?: Array<CascaderOptionT> }
   */
  options: {
    type: Array as PropType<Array<CascaderOptionT>>,
  },
  /**
   * @zh-CN modelValue 是否使用路径模式
   * @en-US Whether to use path mode for modelValue
   * @default false
   */
  pathMode: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 圆角大小。值为 `pill` 时取同尺寸单行 pill 圆角（胶囊常数，不随多选标签撑高而变化，1.2.7-sp3 起）；也可以是 CSS `border-radius` 可接受的任意值
   * @en-US Round size. When set to `pill`, uses the pill radius of the single-line input of the same size (a capsule constant, not affected by multi-select tag growth; since 1.2.7-sp3); any valid CSS `border-radius` value is also accepted
   */
  round: {
    type: String as PropType<RoundT>,
  },
  /**
   * @zh-CN 样式
   * @en-US Style
   * @default 'outline'
   */
  variant: {
    type: String as PropType<VariantT>,
    default: 'outline',
  },
  /**
   * @zh-CN 提示文本
   * @en-US Placeholder
   */
  placeholder: {
    type: String,
  },
  /**
   * @zh-CN 弹出级联菜单的触发方式
   * @en-US Trigger method for cascading menu popup
   * @default 'click'
   */
  trigger: {
    type: String as PropType<PopupTriggerT>,
    default: 'click',
  },
  /**
   * @zh-CN 下拉选项位置
   * @en-US Option position
   * @default 'bl'
   */
  optionPosition: {
    type: String as PropType<PopupPositionT>,
    default: 'bl',
  },
  /**
   * @zh-CN 下拉选项容器类名
   * @en-US Option container class name
   */
  optionWrapClass: {
    type: [String, Array, Object] as PropType<string | { [k: string]: boolean } | Array<{ [k: string]: boolean } | string>>,
  },
  /**
   * @zh-CN 是否在隐藏时销毁 DOM
   * @en-US Whether to destroy DOM when hidden
   */
  unmountOnHide: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 过渡动画名称
   * @en-US Transition animation name
   */
  transition: {
    type: String,
  },
  /**
   * @zh-CN 展开菜单选项的触发方式
   * @en-US Trigger method to expand menu options
   */
  expandTrigger: {
    type: String as PropType<'click' | 'hover'>,
    default: 'click',
  },
  /**
   * @zh-CN 选择器尺寸
   * @en-US Select size
   * @default 'large'
   */
  size: {
    type: String as PropType<SizeT>,
    default: 'large',
  },
};

export const cascaderPanelProps = {
  /**
   * @zh-CN 级联选择器选中值(v-model)
   * @en-US Cascader selected value (v-model)
   */
  modelValue: {
    type: [String, Number, Array] as PropType<CascaderValueT>,
    default: '',
  },
  /**
   * @zh-CN 级联选择器选项值
   * @en-US Cascader option value
   */
  options: {
    type: Array as PropType<Array<CascaderOptionT>>,
  },
  /**
   * @zh-CN modelValue 是否使用路径模式
   * @en-US Whether to use path mode for modelValue
   * @default false
   */
  pathMode: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 展开菜单选项的触发方式
   * @en-US Trigger method to expand menu options
   */
  expandTrigger: {
    type: String as PropType<'click' | 'hover'>,
    default: 'click',
  },
};

export type CascaderPropsT = ExtractPropTypes<typeof cascaderProps>;
