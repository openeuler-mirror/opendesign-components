import { ExtractPropTypes, PropType } from 'vue';
import type { SizeT, ShapeT, RoundT } from '../_shared/global';

export const inputProps = {
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
   * 大小
   */
  size: {
    type: String as PropType<SizeT>,
  },
  /**
   * 形状
   */
  shape: {
    type: String as PropType<ShapeT>,
  },
  /**
   * 圆角值
   */
  round: {
    type: String as PropType<RoundT>
  },
  /**
   * 颜色类型
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

export type InputPropsT = ExtractPropTypes<typeof inputProps>;
