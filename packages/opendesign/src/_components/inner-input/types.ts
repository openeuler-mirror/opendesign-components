import { ExtractPropTypes, PropType } from 'vue';
import type { SizeT } from '../../_utils/types';

export const innerInputProps = {
  /**
   * 大小 SizeT
   */
  size: {
    type: String as PropType<SizeT>,
  },
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
   * 是否是密码输入
   */
  type: {
    type: String as PropType<'text' | 'password'>,
    default: 'text',
  },
  /**
   * 提示文本
   */
  placeholder: {
    type: String,
  },
  /**
   * input id, 用于label关联
   */
  inputId: {
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
   * 是否非法
   */
  invalid: {
    type: Boolean,
  },
  /**
   * 是否可以清除
   */
  clearable: {
    type: Boolean,
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
  /**
   * 显示密码的方式
   */
  showPasswordEvent: {
    type: String as PropType<'click' | 'pointerdown'>,
    default: 'pointerdown',
  },
};

export type InnerInputProps = ExtractPropTypes<typeof innerInputProps>;
