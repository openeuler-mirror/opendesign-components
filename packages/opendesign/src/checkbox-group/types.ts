import type { DirectionT } from '../_utils/types';
import type { ExtractPropTypes, PropType } from 'vue';

export const checkboxGroupProps = {
  /**
   * @zh-CN 复选框组双向绑定值
   * @en-US checkbox group two-way binding value
   */
  modelValue: {
    type: Array as PropType<Array<string | number>>,
  },
  /**
   * @zh-CN 非受控状态时，复选框组默认值
   * @en-US Default value when not controlled
   */
  defaultValue: {
    type: Array as PropType<Array<string | number>>,
    default: () => [],
  },
  /**
   * @zh-CN 是否禁用复选框组
   * @en-US Whether to disable the checkbox group
   */
  disabled: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
  /**
   * @zh-CN 复选框组布局方向
   * @en-US Layout direction of checkbox group
   */
  direction: {
    type: String as PropType<DirectionT>,
    default: 'h',
  },
  /**
   * @zh-CN 最少选择数量
   * @en-US Minimum number of selections
   */
  min: {
    type: Number,
    default: undefined,
  },
  /**
   * @zh-CN 最多选择数量
   * @en-US Maximum number of selections
   */
  max: {
    type: Number,
    default: undefined,
  },
  /**
   * @zh-CN 无障碍标签，为复选组提供可访问名称（未传时回退到 i18n 默认词条）
   * @en-US Accessibility label for the checkbox group (falls back to i18n default when not provided)
   * @since NEXT
   */
  ariaLabel: {
    type: String,
  },
};

export type CheckboxGroupPropsT = ExtractPropTypes<typeof checkboxGroupProps>;
