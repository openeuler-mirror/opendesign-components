import { BaseScrollerPropsT } from '../..//scrollbar';
import { ExtractPropTypes, PropType } from 'vue';

export const TextareaResizeTypes = ['both', 'horizontal', 'h', 'vertical', 'v', 'none'] as const;
export type TextareaResizeT = (typeof TextareaResizeTypes)[number];

export const inTextareaProps = {
  /**
   * @zh-CN 双向绑定值
   * @en-US Two-way binding value
   */
  modelValue: {
    type: String,
  },
  /**
   * @zh-CN 非受控默认值
   * @en-US Non-controlled default value
   */
  defaultValue: {
    type: String,
  },
  /**
   * @zh-CN 提示文本
   * @en-US Prompt text
   */
  placeholder: {
    type: String,
  },
  /**
   * @zh-CN 是否禁用
   * @en-US Whether to disable
   */
  disabled: {
    type: Boolean,
  },
  /**
   * @zh-CN 是否只读
   * @en-US Whether to read-only
   */
  readonly: {
    type: Boolean,
  },
  /**
   * @zh-CN 是否可以清除
   * @en-US Whether to clear
   */
  clearable: {
    type: Boolean,
  },
  /**
   * @zh-CN 格式化函数，控制显示格式
   * @en-US Format function, control display format
   */
  format: {
    type: Function as PropType<(value: string) => string>,
  },
  /**
   * @zh-CN 校验函数
   * @en-US Validation function
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
   * @zh-CN 同 textarea 的 rows 属性
   * @en-US The rows attribute of textarea
   */
  rows: {
    type: Number,
    default: undefined,
  },
  /**
   * @zh-CN 同 textarea 的 cols 属性
   * @en-US The cols attribute of textarea
   */
  cols: {
    type: Number,
    default: undefined,
  },
  /**
   * @zh-CN 是否支持调整尺寸
   * @en-US Whether to support resizing
   * @default 'vertical'
   */
  resize: {
    type: String as PropType<TextareaResizeT>,
    default: 'vertical',
  },
  /**
   * @zh-CN 字符最小长度
   * @en-US Minimum length of characters
   */
  minLength: {
    type: Number,
  },
  /**
   * @zh-CN 字符最大长度
   * @en-US Maximum length of characters
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
    default: 'auto'
  },
  /**
   * @zh-CN 获取长度方法
   * @en-US The method of getting length
   */
  getLength: {
    type: Function as PropType<(val: string) => number>,
  },
  /**
   * @zh-CN 超过最大字符长度时是否允许输入
   * @en-US Whether to allow input when exceeding the maximum character length
   * @default true
   */
  inputOnOutlimit: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 根据内容自动计算高度
   * @en-US Whether to automatically calculate height based on content
   */
  autoSize: {
    type: Boolean,
  },
  /**
   * @zh-CN id, 用于关联label
   * @en-US id, for associating label
   */
  textareaId: {
    type: String,
  },
  /**
   * @zh-CN scrollbar配置
   * @en-US scrollbar configuration
   * @default true
   */
  scrollbar: {
    type: [Boolean, Object] as PropType<boolean | Partial<BaseScrollerPropsT>>,
    default: true,
  },
};

export type inTextareaProps = ExtractPropTypes<typeof inTextareaProps>;
