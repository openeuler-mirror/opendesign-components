import { ExtractPropTypes, PropType } from 'vue';

export type ValidatorResultTypeT = 'danger' | 'warning' | 'success';
export type TriggerT = 'change' | 'input' | 'blur' | 'focus' | `e-${string}`;

export type ValidatorResultT = {
  type: ValidatorResultTypeT;
  message?: string;
};
export type ValidatorT = (value: any) => ValidatorResultT | void;

export type ValidatorRuleT = {
  triggers?: TriggerT | TriggerT[];
  validator?: ValidatorT;
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

export type TriggerRulesT = {
  [x in TriggerT]?: ValidatorT[];
};

export type FieldResultT = {
  type: 'warning' | 'danger' | '';
  message: string[];
} | null;

export interface FiledInfoT {
  filed?: string;
  validate?: (trigger?: TriggerT) => Promise<FieldResultT>;
  clearValidate: () => void;
  resetFiled: () => void;
}

export const formProps = {
  /**
   * 表单数据对象
   */
  model: {
    type: Object,
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
   * 表单项在数据对象中的path
   */
  field: {
    type: String,
  },
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
  /**
   * 表单验证的默认触发事件，在手动检验
   */
  defaultTrigger: {
    type: String as PropType<TriggerT>,
  },
};

export type FormItemPropsT = ExtractPropTypes<typeof formItemProps>;
