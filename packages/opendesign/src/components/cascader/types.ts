import { ExtractPropTypes, PropType } from 'vue';
import { PopupPositionT, PopupTriggerT } from '../popup';
import type { RoundT, VariantT } from '../_shared/global';

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
   * 级联选择器的值
   * v-model
   */
  modelValue: {
    type: [String, Number, Array] as PropType<CascaderValueT>,
  },
  /**
   * 级联选择器选项值
   *
   * */
  options: {
    type: Array as PropType<Array<CascaderOptionT>>,
  },
  /**
   * 是否使用路径模式
   *
   * */
  pathMode: {
    type: Boolean,
    default: false,
  },
  /**
   * 圆角值
   */
  round: {
    type: String as PropType<RoundT>,
  },
  /**
   * 级联选择器类型
   */
  variant: {
    type: String as PropType<VariantT>,
    default: 'outline',
  },
  /**
   * 提示文本
   */
  placeholder: {
    type: String,
    default: 'please select...',
  },
  /**
   * 下拉选项触发方式
   */
  trigger: {
    type: String as PropType<PopupTriggerT>,
    default: 'click',
  },
  /**
   * 下拉选项位置
   */
  optionPosition: {
    type: String as PropType<PopupPositionT>,
    default: 'bl',
  },
  /**
   * 是否在结束选择时，卸载下拉选项
   * v-model
   */
  unmountOnHide: {
    type: Boolean,
    default: true,
  },
  /**
   * 过渡名称
   */
  transition: {
    type: String,
  },
};

export type CascaderPropsT = ExtractPropTypes<typeof cascaderProps>;
