import type { DirectionT } from '../_shared/types';
import type { ExtractPropTypes, PropType } from 'vue';

export const checkboxGroupProps = {
  /**
   * 多选框组双向绑定值
   */
  modelValue: {
    type: Array as PropType<Array<string | number>>,
  },
  /**
   * 非受控状态时，多选框组默认值
   */
  defaultValue: {
    type: Array as PropType<Array<string | number>>,
    default: () => [],
  },
  /**
   * 多选框组是否禁用
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 多选框组方向
   * 'h' | 'v'
   */
  direction: {
    type: String as PropType<DirectionT>,
    default: 'h',
  },
  /**
   * 多选框组支持选中的最小多选框数量
   */
  min: {
    type: Number,
    default: undefined,
  },
  /**
   * 多选框组支持选中的最大多选框数量
   */
  max: {
    type: Number,
    default: undefined,
  },
};

export type CheckboxGroupPropsT = ExtractPropTypes<typeof checkboxGroupProps>;
