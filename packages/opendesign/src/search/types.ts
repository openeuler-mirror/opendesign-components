import type { ExtractPropTypes, PropType } from 'vue';
import { inBoxProps } from '../_components/in-box/types';
import type { SizeT } from '../_utils/types';

const { round, color, readonly, variant } = inBoxProps;

export const searchProps = {
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
   * @zh-CN 是否可以清除
   * @en-US clearable.
   */
  clearable: {
    type: Boolean,
  },
  /**
   * @zh-CN 是否禁用
   * @en-US Whether to disable.
   */
  disabled: {
    type: Boolean,
  },
  /**
   * @zh-CN 大小
   * @en-US Size
   * @default 'large'
   */
  size: {
    type: String as PropType<Exclude<SizeT, 'small'> | 'xlarge'>,
    default: 'large',
  },
  /**
   * @zh-CN 圆角值
   * @en-US Round
   */
  round,
  /**
   * @zh-CN 输入框颜色
   * @en-US Color
   * @default 'normal'
   */
  color,
  /**
   * @zh-CN 是否只读
   * @en-US Readonly
   */
  readonly,
  /**
   * @zh-CN 输入框类型
   * @en-US variant
   * @default 'outline'
   */
  variant,
  /**
   * @zh-CN 输入框占位符
   * @en-US Input field placeholder.
   */
  placeholder: {
    type: String,
  },
  /**
   * @zh-CN 头部筛选框占位符
   * @en-US Head selection box placeholder.
   */
  placeholderOfPrefixSelect: {
    type: String,
  },
  /**
   * @zh-CN 尾部筛选框占位符
   * @en-US Tail section filter placeholder.
   */
  placeholderOfSuffixSelect: {
    type: String,
  },
  /**
   * @zh-CN 头部筛选框默认选中值
   * @en-US The default selected value of the header filter box.
   */
  prefixSelectedVal: {
    type: String,
  },
  /**
   * @zh-CN 尾部筛选框默认选中值
   * @en-US The default selected value of the tail filter box.
   */
  suffixSelectedVal: {
    type: String,
  },
  /**
   * @zh-CN 头部筛选框下拉列表
   * @en-US Display the head filter box.
   */
  optionsOfPrefixSelect: {
    type: Array as PropType<Array<{ label: string; value: string | number }>>,
  },
  /**
   * @zh-CN 尾部筛选框下拉列表
   * @en-US Display the tail filter box.
   */
  optionsOfSuffixSelect: {
    type: Array as PropType<Array<{ label: string; value: string | number }>>,
  },
  /**
   * @zh-CN 显示头部筛选框
   * @en-US Display the head filter box.
   */
  showPrefixSelect: {
    type: Boolean,
  },
  /**
   * @zh-CN 显示尾部筛选框
   * @en-US Display the tail filter box.
   */
  showSuffixSelect: {
    type: Boolean,
  },
  /**
   * @zh-CN 联想内容
   * @en-US Associated content.
   */
  suggesstions: {
    type: Array as PropType<Array<{ label: string; value: string | number }>>,
  },
} as const;

export type SearchPropsT = ExtractPropTypes<typeof searchProps>;
