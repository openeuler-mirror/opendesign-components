import { PopupPositionT, PopupTriggerT } from '../popup';
import { ExtractPropTypes, PropType } from 'vue';
import type { SizeT, RoundT, VariantT, Color2T } from '../_shared/types';

export const OptionWidthModeTypes = ['auto', 'min-width', 'width'] as const;
export type OptionWidthModeT = (typeof OptionWidthModeTypes)[number];

export interface SelectOptionT {
  label: string;
  value: string | number;
}

export const selectProps = {
  /**
   * 下拉框的值
   * v-model
   */
  modelValue: {
    type: [String, Number, Array] as PropType<string | number | (string | number)[]>,
  },
  /**
   * 下拉框的默认值
   * 非受控
   */
  defaultValue: {
    type: [String, Number, Array] as PropType<string | number | (string | number)[]>,
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
   * 颜色类型 Color2T
   */
  color: {
    type: String as PropType<Color2T>,
    default: 'normal',
  },
  /**
   * 按钮类型：ColorT
   */
  variant: {
    type: String as PropType<VariantT>,
    default: 'outline',
  },
  /**
   * 提示文本
   */
  placeholder: {
    type: String,
    default: 'please select...',
  },
  /**
   * 是否支持多选
   */
  multiple: {
    type: Boolean,
  },
  /**
   * 多选标签最大显示数量
   */
  maxTagCount: {
    type: Number,
  },
  /**
   * 是否可以清除
   */
  clearable: {
    type: Boolean,
  },
  /**
   * 是否禁用
   */
  disabled: {
    type: Boolean,
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
   * 下拉选项宽度自适应规则 OptionWidthModeT
   * 'auto':自动 | 'min-width':最小宽度与选择框一致 | 'width': 宽度与选择框一致
   */
  optionWidthMode: {
    type: String as PropType<OptionWidthModeT>,
    default: 'min-width',
  },
  /**
   * 下拉容器自定义类
   */
  optionWrapClass: {
    type: [String, Array] as PropType<string | any[]>,
  },
  /**
   * 是否在结束选择时，卸载下拉选项
   * v-model
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
  /**
   * 加载状态
   */
  loading: {
    type: Boolean,
  },
  /**
   * 选择前回调，根据返回值判断是否显示
   */
  beforeSelect: {
    type: Function as PropType<
      (
        value: string | number,
        currentValue: string | number | Array<string | number>
      ) => Promise<boolean | string | number | Array<string | number>> | boolean | string | number | Array<string | number>
    >,
  },
  /**
   * 显示前回调，根据返回值判断是否显示
   */
  beforeOptionsShow: {
    type: Function as PropType<() => Promise<boolean> | boolean>,
  },
  /**
   * 隐藏前回调，根据返回值判断是否隐藏
   */
  beforeOptionsHide: {
    type: Function as PropType<() => Promise<boolean> | boolean>,
  },
  /**
   * 挂载容器，默认为body
   */
  optionsWrapper: {
    type: [String, Object] as PropType<string | HTMLElement | null>,
    default: 'body',
  },
  /**
   * 多选超过最大tag是，文本显示
   */
  foldLabel: {
    type: Function as PropType<(tags: Array<SelectOptionT>) => string>,
  },
  /**
   * 浮层显示收起的多选tag
   */
  showFoldTags: {
    type: [Boolean, String] as PropType<boolean | 'hover' | 'click'>,
    default: 'hover',
  },
  /**
   * 选项标题（pad、phone显示）
   */
  optionTitle: {
    type: String,
  },
};

export type SelectPropsT = ExtractPropTypes<typeof selectProps>;
