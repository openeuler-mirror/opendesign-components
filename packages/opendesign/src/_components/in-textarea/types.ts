import { BaseScrollerPropsT } from '../..//scrollbar';
import { ExtractPropTypes, PropType } from 'vue';

export const TextareaResizeTypes = ['both', 'horizontal', 'h', 'vertical', 'v', 'none'] as const;
export type TextareaResizeT = (typeof TextareaResizeTypes)[number];

export const inTextareaProps = {
  /**
   * 下拉框的值
   * v-model
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
   * 输入为无效值时，在blur
   */
  onInvalidChange: {
    type: Function as PropType<(inputValue: string, lastValidInputValue: string) => string>,
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
   * 是否支持调整尺寸 ResizeT
   */
  resize: {
    type: String as PropType<TextareaResizeT>,
    default: 'vertical',
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
   * 根据内容自动计算高度
   */
  autoSize: {
    type: Boolean,
  },
  /**
   * textarea id, 用于label关联
   */
  textareaId: {
    type: String,
  },
  /**
   * 使用内置scrollbar，支持传递scrollbar配置项
   */
  scrollbar: {
    type: [Boolean, Object] as PropType<boolean | Partial<BaseScrollerPropsT>>,
    default: true,
  },
};

export type inTextareaProps = ExtractPropTypes<typeof inTextareaProps>;
