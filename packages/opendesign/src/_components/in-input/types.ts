import { ExtractPropTypes, PropType } from 'vue';

export const inInputProps = {
  /**
   * @zh-CN 输入框的值 v-model
   * @en-US The value of the input box
   */
  modelValue: {
    type: String,
  },
  /**
   * @zh-CN 输入框的默认值,非受控
   * @en-US The default value of the input box.Uncontrolled.
   */
  defaultValue: {
    type: String,
  },
  /**
   * @zh-CN 输入文本类型
   * @en-US Input text type.
   * @default 'text'
   */
  type: {
    type: String as PropType<'text' | 'password'>,
    default: 'text',
  },
  /**
   * @zh-CN 提示文本
   * @en-US Prompt text.
   */
  placeholder: {
    type: String,
  },
  /**
   * @zh-CN input id, 用于label关联
   * @en-US Input id, used for label association.
   */
  inputId: {
    type: String,
  },
  /**
   * @zh-CN 是否禁用
   * @en-US Whether to disable.
   */
  disabled: {
    type: Boolean,
  },
  /**
   * @zh-CN 是否只读
   * @en-US Readonly.
   */
  readonly: {
    type: Boolean,
  },
  /**
   * @zh-CN 是否可以清除
   * @en-US clearable.
   */
  clearable: {
    type: Boolean,
  },
  /**
   * @zh-CN 最小字符长度
   * @en-US Minimum character length.
   */
  minLength: {
    type: Number,
  },
  /**
   * @zh-CN 最大字符长度
   * @en-US Maximum character length.
   */
  maxLength: {
    type: Number,
  },
  /**
   * @zh-CN 获取长度方法
   * @en-US Method for getting length.
   */
  getLength: {
    type: Function as PropType<(val: string) => number>,
  },
  /**
   * @zh-CN 超过最大字符长度时是否允许输入
   * @en-US Whether input is allowed when the maximum character length is exceeded.
   * @default true
   */
  inputOnOutlimit: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 对值格式化，控制显示格式
   * @en-US Format the values and control the display format.
   */
  format: {
    type: Function as PropType<(value: string) => string>,
  },
  /**
   * @zh-CN 判断值的有效性
   * @en-US The validity of the judgement value.
   */
  validate: {
    type: Function as PropType<(value: string) => boolean>,
  },
  /**
   * @zh-CN 输入为无效值时，在blur/pressEnter时的回调，返回值为纠正后的值
   * @en-US When the input value is an invalid value, the callback during blur/pressEnter returns the corrected value.
   */
  valueOnInvalidChange: {
    type: Function as PropType<(inputValue: string, lastValidInputValue: string) => string>,
  },
  /**
   * @zh-CN 显示密码的方式
   * @en-US The way to display the password.
   * @default 'pointerdown'
   */
  showPasswordEvent: {
    type: String as PropType<'click' | 'pointerdown'>,
    default: 'pointerdown',
  },
  /**
   * @zh-CN 是否自动适配内容宽度
   * @en-US Whether the content width is automatically adapted.
   */
  autoWidth: {
    type: Boolean,
  },
  /**
   * @zh-CN 密码单个字符占位符
   * @en-US A single-character placeholder for a password.
   * @default '\u2022'
   */
  passwordPlaceholder: {
    type: String,
    default: '\u2022',
  },
};

export type InInputProps = ExtractPropTypes<typeof inInputProps>;
