import { ExtractPropTypes, PropType } from 'vue';
import { PopupPositionT, PopupTriggerT } from '../popup';
import type { RoundT, VariantT } from '../_utils/types';

export type CascaderNodeValueT = string | number;
export type CascaderNodePathT = Array<CascaderNodeValueT>;
export type CascaderValueT = CascaderNodeValueT | CascaderNodePathT;

export type CascaderOptionT = {
  value: CascaderNodeValueT;
  label?: string;
  children?: CascaderOptionT[];
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
   * @zh-CN 圆角大小
   * @en-US Round size
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
   * @zh-CN 触发方式
   * @en-US Trigger
   * @default 'click'
   * @deprecated useless
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
    type: [String, Array] as PropType<string | string[]>,
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
};

export type CascaderPropsT = ExtractPropTypes<typeof cascaderProps>;
