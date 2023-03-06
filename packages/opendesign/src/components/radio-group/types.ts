import { ExtractPropTypes, PropType } from 'vue';
import { DirectionT } from '../_shared/global';

export const radioGroupProps = {
  /**
   * 单选框组双向绑定值
   */
  modelValue: {
    type: [String, Number, Boolean],
  },
  /**
   * 非受控状态时，单选框组默认值
   */
  defaultValue: {
    type: [String, Number, Boolean],
    default: '',
  },
  /**
   * 单选框组是否禁用
   */
  disabled: {
    type: Boolean,
    default: false,
  },
  /**
   * 单选框组方向
   * 'horizontal' | 'vertical'
   */
  direction: {
    type: String as PropType<DirectionT>,
    default: 'horizontal',
  },
};

export type RadioGroupPropsT = ExtractPropTypes<typeof radioGroupProps>;
