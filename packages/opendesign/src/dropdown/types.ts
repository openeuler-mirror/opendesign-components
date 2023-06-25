import { PopupPositionT, PopupTriggerT } from '../popup';
import { ExtractPropTypes, PropType } from 'vue';
import type { SizeT, RoundT } from '../_utils/types';

export const dropdownProps = {
  /**
   * 弹出框是否可见
   */
  visible: {
    type: Boolean,
  },
  /**
   * 非受控模式，弹出框是否默认可见
   */
  defaultVisible: {
    type: Boolean,
    default: false,
  },
  /**
   * 大小 SizeT
   */
  size: {
    type: String as PropType<SizeT>,
  },
  /**
   * 圆角值 RoundT
   */
  round: {
    type: String as PropType<RoundT>,
  },
  /**
   * 下拉选项触发方式 PopupTriggerT
   */
  trigger: {
    type: String as PropType<PopupTriggerT>,
    default: 'click',
  },
  /**
   * 下拉选项位置 PopupPositionT
   */
  optionPosition: {
    type: String as PropType<PopupPositionT>,
    default: 'bl',
  },
  /**
   * 下拉选项宽度自适应规则
   * 'auto':自动 | 'min-width':最小宽度与选择框一致 | 'width': 宽度与选择框一致
   */
  optionWidthMode: {
    type: String as PropType<'auto' | 'min-width' | 'width'>,
    default: 'min-width',
  },
  /**
   * 挂载容器，默认为body
   */
  optionsWrapper: {
    type: [String, Object] as PropType<string | HTMLElement | null>,
    default: 'body',
  },
  /**
   * 下拉容器自定义类
   */
  optionWrapClass: {
    type: [String, Array] as PropType<string | any[]>,
  },
  /**
   * 是否在结束选择时，卸载下拉选项
   */
  unmountOnHide: {
    type: Boolean,
    default: true,
  },
  /**
   * 过渡名称
   */
  transition: {
    type: String,
  },
};

export type DropdownPropsT = ExtractPropTypes<typeof dropdownProps>;

export const dropdownItemProps = {
  /**
   * 显示文本
   */
  label: {
    type: String,
    default: '',
  },
  /**
   * 选项值
   */
  value: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },
  /**
   * 是否禁用
   */
  disabled: {
    type: Boolean,
    default: false,
  },
};

export type DropdownItemPropsT = ExtractPropTypes<typeof dropdownItemProps>;
