import { ExtractPropTypes, PropType } from 'vue';
import { SizeT, RoundT } from '../_shared/global';

// interface InputPropT {
//   /**
//    * 数字输入框的值
//    * v-model
//    */
//   modelValue?: string | number;
//   /**
//    * 数字输入框的默认值
//    * 非受控
//    */
//   defaultValue?: string | number;
//   /**
//    * 按钮点击时步长
//    */
//   step?: number;
//   /**
//    * 最小值
//    */
//   min?: number;
//   /**
//    * 最大值
//    */
//   max?: number;
//   /**
//    * 样式尺寸
//    */
//   size?: SizeT;
//   /**
//    * 形状
//    */
//   shape?: ShapeT;
//   /**
//    * 提示文本
//    */
//   placeholder?: string;
//   /**
//    * 状态，显示指定，用于非表单场景
//    */
//   status?: 'success' | 'warning' | 'error';
//   /**
//    * 是否禁用
//    */
//   disabled?: boolean;
//   /**
//    * 是否只读
//    */
//   readonly?: boolean;
//   /**
//    * 是否可以清除
//    */
//   clearable?: boolean;
//   /**
//    * 控制按钮位置
//    */
//   controls?: 'both' | 'right' | 'left' | 'none';
//   /**
//    * 是否在输入合法时，更新modelvalue
//    */
//   updateOnInput?: boolean;
//   /**
//    * 解析输入框的值
//    */
//   parse?: (value: string) => string;
//   /**
//    * 对值格式化，控制显示格式
//    * 需搭配parse处理，保证值的正确性
//    */
//   format?: (value: string | number) => string | number;
// }
// const props = withDefaults(defineProps<InputPropT>(), {
//   modelValue: undefined,
//   defaultValue: undefined,
//   step: 1,
//   min: undefined,
//   max: undefined,
//   size: undefined,
//   shape: undefined,
//   placeholder: '',
//   clearable: true,
//   parse: undefined,
//   format: undefined,
//   status: undefined,
//   controls: 'both',
//   updateOnInput: true,
// });
export const inputNumberPorps = {
  /**
   * 下拉框的值
   * v-model
   */
  modelValue: {
    type: [String, Number] as PropType<string | number>,
  },
  /**
   * 下拉框的默认值
   * 非受控
   */
  defaultValue: {
    type: [String, Number],
  },
  /**
   * 按钮点击时步长
   */
  step: {
    type: Number,
    default: 1
  },
  /**
   * 最小值
   */
  min: {
    type: Number,
  },
  /**
   * 最大值
   */
  max: {
    type: Number,
  },
  /**
   * 大小
   */
  size: {
    type: String as PropType<SizeT>,
  },
  /**
   * 控制按钮位置
   */
  controls: {
    type: String as PropType<'both' | 'right' | 'left' | 'none'>,
    default: 'both'
  },
  /**
   * 圆角值
   */
  round: {
    type: String as PropType<RoundT>
  },
  /**
   * 颜色类型：ColorT
   */
  color: {
    type: String as PropType<'normal' | 'success' | 'warning' | 'danger'>,
    default: 'normal'
  },
  /**
   * 提示文本
   */
  placeholder: {
    type: String,
  },
  /**
   * 是否禁用
   */
  disabled: {
    type: Boolean,
  },
  /**
   * 是否只读
   */
  readonly: {
    type: Boolean,
  },
  /**
   * 是否可以清除
   */
  clearable: {
    type: Boolean,
    default: true
  },
  /**
   * 是否自动增加宽度
   */
  autoWidth: {
    type: Boolean,
  },
  /**
   * 是否是密码输入
   */
  type: {
    type: String as PropType<'text' | 'password'>,
    default: 'text'
  },
  /**
   * 解析输入框的值
   */
  parse: {
    type: Function as PropType<(value: string) => string>,
  },
  /**
   * 对值格式化，控制显示格式
   * 需搭配parse处理，保证值的正确性
   */
  format: {
    type: Function as PropType<(value: string | number) => string | number>,
  },
};

export type InputNumberPorpsT = ExtractPropTypes<typeof inputNumberPorps>;
