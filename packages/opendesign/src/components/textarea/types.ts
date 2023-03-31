import { ExtractPropTypes, PropType } from 'vue';
import type { SizeT, RoundT, VariantT } from '../_shared/global';

export type ResizeT = 'both' | 'horizontal' | 'h' | 'vertical' | 'v' | 'none';
export const textareaProps = {
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
   * 大小
   */
  size: {
    type: String as PropType<SizeT>,
  },
  /**
   * 圆角值
   */
  round: {
    type: String as PropType<RoundT>,
  },
  /**
   * 颜色类型
   */
  color: {
    type: String as PropType<'normal' | 'success' | 'warning' | 'danger'>,
    default: 'normal',
  },
  /**
   * 按钮类型：ColorT
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
    default: '',
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
    default: true,
  },
  /**
   * 是否自动增加宽度
   */
  autoWidth: {
    type: Boolean,
  },
  /**
   * 是否支持调整尺寸
   */
  resize: {
    type: String as PropType<ResizeT>,
    default: 'vertical',
  },
  /**
   * 显示的行数
   */
  rows: {
    type: Number,
    default: undefined,
  },
  /**
   * 显示的行数
   */
  cols: {
    type: Number,
    default: undefined,
  },
  /**
   * 最大字符长度
   */
  maxLength: {
    type: Number,
  },
  /**
   * 超过最大字符长度时是否允许输入
   */
  inputOnOutlimit: {
    type: Boolean,
    default: true,
  },
  /**
   * 是否自动计算高度
   */
  autoHeight: {
    type: Boolean,
  },
  /**
   * 获取长度方法
   */
  getLength: {
    type: Function as PropType<(val: string) => Number>,
  },
};

export type TextareaPropsT = ExtractPropTypes<typeof textareaProps>;
