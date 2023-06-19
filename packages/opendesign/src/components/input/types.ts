import { ExtractPropTypes, PropType } from 'vue';
import type { SizeT, RoundT, VariantT, Color2T } from '../_shared/types';

export const inputProps = {
  /**
   * 下拉框的值
   * v-model
   */
  modelValue: {
    type: [String, Number],
  },
  /**
   * 下拉框的默认值
   * 非受控
   */
  defaultValue: {
    type: [String, Number],
  },
  /**
   * 大小 SizeT
   */
  size: {
    type: String as PropType<SizeT>,
  },
  /**
   * 圆角值 RoundT
   */
  round: {
    type: String as PropType<RoundT>,
  },
  /**
   * 颜色类型 Color2T
   */
  color: {
    type: String as PropType<Color2T>,
    default: 'normal',
  },
  /**
   * 按钮类型 VariantT
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
   * 非法值
   */
  invalid: {
    type: Boolean,
  },
  /**
   * 是否可以清除
   */
  clearable: {
    type: Boolean,
    default: true,
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
    default: 'text',
  },
  /**
   * 是否是密码输入
   */
  showPasswordOn: {
    type: String as PropType<'click' | 'mousedown'>,
    default: 'mousedown',
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

export type InputPropsT = ExtractPropTypes<typeof inputProps>;
