import { ExtractPropTypes, PropType } from 'vue';
import type { SizeT } from '../_utils/types';

export const TabVariantTypes = ['solid', 'text'] as const;
export type TabVariantT = (typeof TabVariantTypes)[number];

export const formProps = {
  /**
   * 类型 TabVariantT
   */
  variant: {
    type: String as PropType<TabVariantT>,
    default: 'text',
  },
  /**
   * 大小 SizeT
   */
  size: {
    type: String as PropType<SizeT>,
  },
  /**
   * 子项是否包含必选，主要用于控制左对齐
   */
  required: {
    type: Boolean,
    default: false,
  },
  /**
   * 布局
   */
  layout: {
    type: String as PropType<'h' | 'v' | 'inline'>,
    default: 'h',
  },
  /**
   * 表单项文本垂直对齐方式
   */
  labelAlign: {
    type: String as PropType<'top' | 'center' | 'bottom'>,
  },
  /**
   * 表单项文本水平对齐方式
   */
  labelJustify: {
    type: String as PropType<'left' | 'center' | 'right'>,
  },
  /**
   * 表单项文本宽度,全局
   */
  labelWidth: {
    type: String,
  },
};
export type FormPropsT = ExtractPropTypes<typeof formProps>;

export const formItemProps = {
  /**
   * 是否必选
   */
  required: {
    type: Boolean,
    default: false,
  },
  /**
   * 表单项文本
   */
  label: {
    type: String,
    default: undefined,
  },
  /**
   * 表单项文本垂直对齐方式
   */
  labelAlign: {
    type: String as PropType<'top' | 'center' | 'bottom'>,
  },
  /**
   * 表单项文本水平对齐方式
   */
  labelJustify: {
    type: String as PropType<'left' | 'center' | 'right'>,
  },
  /**
   * 表单项文本宽度
   */
  labelWidth: {
    type: String,
  },
};

export type FormItemPropsT = ExtractPropTypes<typeof formItemProps>;
