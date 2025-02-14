import { ExtractPropTypes, PropType } from 'vue';

export const inInputProps = {
  /**
   * 下拉框的值
   * v-model 受控
   */
  modelValue: {
    type: String,
  },
  /**
   * 下拉框的默认值
   * 非受控
   */
  defaultValue: {
    type: String,
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
   * 是否可以清除
   */
  clearable: {
    type: Boolean,
  },
  /**
   * 最小字符长度
   */
  minLength: {
    type: Number,
  },
  /**
   * 最大字符长度
   */
  maxLength: {
    type: Number,
  },
  /**
   * 获取长度方法
   */
  getLength: {
    type: Function as PropType<(val: string) => number>,
  },
  /**
   * 超过最大字符长度时是否允许输入
   */
  inputOnOutlimit: {
    type: Boolean,
    default: true,
  },
  /**
   * 对值格式化，控制显示格式
   */
  format: {
    type: Function as PropType<(value: string) => string>,
  },
  /**
   * 判断值的有效性
   */
  validate: {
    type: Function as PropType<(value: string) => boolean>,
  },
  /**
   * 输入为无效值时，在blur/pressEnter时的回调，返回值为纠正后的值
   */
  onInvalidChange: {
    type: Function as PropType<(inputValue: string, lastValidInputValue: string) => string>,
  },
  /**
   * 显示密码的方式
   */
  showPasswordEvent: {
    type: String as PropType<'click' | 'pointerdown'>,
    default: 'pointerdown',
  },
  /**
   * 是否自动适配内容宽度
   */
  autoWidth: {
    type: Boolean,
  },
  /**
   * 密码单个字符占位符
   */
  passwordPlaceholder: {
    type: String,
    default: '\u2022',
  },
};

export type InInputProps = ExtractPropTypes<typeof inInputProps>;
