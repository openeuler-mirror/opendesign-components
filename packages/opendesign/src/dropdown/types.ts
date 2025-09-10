import { PopupPositionT, PopupTriggerT } from '../popup';
import { ExtractPropTypes, PropType } from 'vue';
import type { SizeT, RoundT } from '../_utils/types';

export const dropdownProps = {
  /**
   * @zh-CN 弹出框是否可见
   * @en-US Is the pop-up box visible
   */
  visible: {
    type: Boolean,
  },
  /**
   * @zh-CN 非受控模式，弹出框是否默认可见
   * @en-US In uncontrolled mode, is the pop-up box visible by default
   * @default false
   */
  defaultVisible: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 大小
   * @en-US Size
   * @default 'large'
   */
  size: {
    type: String as PropType<SizeT>,
    default: 'large',
  },
  /**
   * @zh-CN 圆角值
   * @en-US Round
   */
  round: {
    type: String as PropType<RoundT>,
  },
  /**
   * @zh-CN 下拉选项触发方式
   * @en-US The triggering method of the drop-down option
   * @default 'click'
   */
  trigger: {
    type: String as PropType<PopupTriggerT>,
    default: 'click',
  },
  /**
   * @zh-CN 下拉选项位置
   * @en-US Drop-down option position
   * @default 'bl'
   */
  optionPosition: {
    type: String as PropType<PopupPositionT>,
    default: 'bl',
  },
  /**
   * @zh-CN 下拉选项宽度自适应规则 'auto':自动 | 'min-width':最小宽度与选择框一致 | 'width': 宽度与选择框一致
   * @en-US Drop-down option width adaptation rules: 'auto': automatic; 'min-width': minimum width consistent with the selection box; 'width': width consistent with the selection box
   * @default 'min-width'
   */
  optionWidthMode: {
    type: String as PropType<'auto' | 'min-width' | 'width'>,
    default: 'min-width',
  },
  /**
   * @zh-CN 挂载容器，默认为body
   * @en-US Mount the container, with the default being body
   * @default 'body'
   */
  optionsWrapper: {
    type: [String, Object] as PropType<string | HTMLElement | null>,
    default: 'body',
  },
  /**
   * @zh-CN 下拉容器自定义类
   * @en-US Drop-down container custom class
   */
  optionWrapClass: {
    type: [String, Array] as PropType<string | any[]>,
  },
  /**
   * @zh-CN 是否在结束选择时，卸载下拉选项
   * @en-US Whether to uninstall the drop-down options when ending the selection
   * @default true
   */
  unmountOnHide: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 过渡名称
   * @en-US Transitional name
   */
  transition: {
    type: String,
  },
};

export type DropdownPropsT = ExtractPropTypes<typeof dropdownProps>;

export const dropdownItemProps = {
  /**
   * @zh-CN 选项显示文本
   * @en-US The option displays text.
   */
  label: {
    type: String,
    default: '',
  },
  /**
   * @zh-CN 选项选中值
   * @en-US Selected value of the option
   */
  value: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },
  /**
   * @zh-CN 是否禁用
   * @en-US Whether to disable
   */
  disabled: {
    type: Boolean,
    default: false,
  },
};

export type DropdownItemPropsT = ExtractPropTypes<typeof dropdownItemProps>;
