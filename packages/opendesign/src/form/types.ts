import { ExtractPropTypes, PropType } from 'vue';
import type { SizeT } from '../_utils/types';

export const TabVariantTypes = ['solid', 'text'] as const;
export type TabVariantT = (typeof TabVariantTypes)[number];
export type ValidatorReusltT = 'danger' | 'warning' | 'success';
export type TriggerT = 'change' | 'input' | 'blur' | 'focus';

export type ValidatorResultT = {
  type: ValidatorReusltT;
  message?: string;
};
export type ValidatorT = (value: any) => ValidatorResultT | void;

export type ValidatorRuleT = {
  triggers?: TriggerT | TriggerT[];
  validator?: ValidatorT;
};

export type FieldResultT = {
  type: 'warning' | 'danger';
  message?: string[];
};

export type RequiredRuleT = {
  required: boolean;
  message?: string;
  triggers?: TriggerT | TriggerT[];
};
export type TypeRuleT = {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  message?: string;
  triggers?: TriggerT | TriggerT[];
};

export type RulesT = ValidatorRuleT | RequiredRuleT | TypeRuleT;

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
   * 子项是否包含必选，主要用于控制文本左对齐样式
   */
  hasRequired: {
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
  /**
   * 表单验证规则
   */
  rules: {
    type: Array as PropType<Array<RulesT>>,
  },
};

export type FormItemPropsT = ExtractPropTypes<typeof formItemProps>;
