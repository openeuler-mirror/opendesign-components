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
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
  /**
   * @zh-CN 是否只读
   * @en-US Readonly.
   */
  readonly: {
    type: Boolean,
  },
  /**
   * @zh-CN 是否调起虚拟键盘
   * @en-US Whether to invoke the virtual keyboard.
   */
  noKeyboard: {
    type: Boolean,
  },
  /**
   * @zh-CN 是否可以清除
   * @en-US clearable.
   */
  clearable: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
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
   * @zh-CN 是否显示字符长度信息，always: 一直显示； never：不显示；auto：设置了minLength、maxLength时显示
   * @en-US if not show character length.
   */
  showLength: {
    type: [String, Function] as PropType<'always' | 'auto' | 'never'>,
    default: 'auto',
  },
  /**
   * @zh-CN 获取长度方法
   * @en-US Method for getting length.
   */
  getLength: {
    type: Function as PropType<(val: string) => number>,
  },
  /**
   * @zh-CN 超过最大字符长度时是否允许输入，当为false时，输入长度超出maxLength会被截断
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
   * @zh-CN 输入为无效值时，在blur/pressEnter时的回调，返回值为纠正后的值；当输入值不合法时的处理方式：[true]：纠正为上一次合法的值(如果上一次合法值为空字符串，则不处理); [false|undefined]: 不处理；[function]: 使用函数的返回值
   * @en-US When the input value is an invalid value, the callback during blur/pressEnter returns the corrected value.
   */
  valueOnInvalidChange: {
    type: [Boolean, Function] as PropType<boolean | ((inputValue: string, lastValidInputValue: string) => string)>,
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
  /**
   * @zh-CN 是否限制仅数字输入
   * @en-US Limit only numeric input.
   */
  onlyNumericInput: {
    type: Boolean,
  },
  /**
   * @zh-CN 无障碍角色，透传到原生 input（如 combobox）
   * @en-US Accessibility role forwarded to the native input (e.g. combobox)
   * @since NEXT
   */
  role: {
    type: String,
  },
  /**
   * @zh-CN 无障碍标签，透传到原生 input
   * @en-US Accessibility label forwarded to the native input
   * @since NEXT
   */
  ariaLabel: {
    type: String,
  },
  /**
   * @zh-CN 展开状态，透传到原生 input 的 aria-expanded
   * @en-US Expanded state forwarded to aria-expanded of the native input
   * @since NEXT
   */
  ariaExpanded: {
    type: [Boolean, String],
    default: undefined, // 覆盖 Boolean 类型的隐式 false，缺省时不渲染该属性
  },
  /**
   * @zh-CN 弹层类型，透传到原生 input 的 aria-haspopup
   * @en-US Popup type forwarded to aria-haspopup of the native input
   * @since NEXT
   */
  ariaHaspopup: {
    type: String,
  },
  /**
   * @zh-CN 关联面板 id，透传到原生 input 的 aria-controls
   * @en-US Related panel id forwarded to aria-controls of the native input
   * @since NEXT
   */
  ariaControls: {
    type: String,
  },
  /**
   * @zh-CN 当前高亮选项 id，透传到原生 input 的 aria-activedescendant，用于键盘高亮联动 listbox 选项
   * @en-US Currently highlighted option id forwarded to aria-activedescendant of the native input, used to link the keyboard-highlighted listbox option
   * @since NEXT
   */
  ariaActiveDescendant: {
    type: String,
  },
  /**
   * @zh-CN 辅助描述元素 id，透传到原生 input 的 aria-describedby，用于关联错误提示/辅助文本
   * @en-US Described-by element id forwarded to aria-describedby of the native input, used to associate error hints or helper text
   * @since NEXT
   */
  ariaDescribedBy: {
    type: String,
  },
  /**
   * @zh-CN 校验失败状态，透传到原生 input 的 aria-invalid；显式传 false（校验重新通过）也会渲染
   * @en-US Invalid state forwarded to aria-invalid of the native input; explicit false (validation passed again) is also rendered
   * @since NEXT
   */
  ariaInvalid: {
    type: [Boolean, String],
    default: undefined, // 覆盖 Boolean 类型的隐式 false，缺省时不渲染该属性
  },
  /**
   * @zh-CN 必填状态，透传到原生 input 的 aria-required
   * @en-US Required state forwarded to aria-required of the native input
   * @since NEXT
   */
  ariaRequired: {
    type: [Boolean, String],
    default: undefined, // 覆盖 Boolean 类型的隐式 false，缺省时不渲染该属性
  },
};

export type InInputProps = ExtractPropTypes<typeof inInputProps>;
