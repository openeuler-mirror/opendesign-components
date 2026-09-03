import { ExtractPropTypes, PropType } from 'vue';
import { SizeT, RoundT } from '../_utils/types';

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

export type FormRulesT = Record<string, RulesT | RulesT[]>;

export type TriggerRulesT = {
  [x in TriggerT]?: ValidatorT[];
};

export type FieldResultT = {
  type: 'warning' | 'danger' | 'success' | '';
  message: string[];
} | null;

export type ValidateStatusT = '' | 'danger' | 'warning' | 'validating' | 'success';

export interface FiledInfoT {
  filed?: string;
  validate?: (trigger?: TriggerT) => Promise<FieldResultT>;
  clearValidate: () => void;
  resetFiled: () => void;
  setInitialValue?: (value: any) => void;
}

/**
 * @description Form 与 FormItem 共享的属性定义，通过 spread 合并到 formProps 与 formItemProps，避免在两处重复书写
 */
const sharedProps = {
  /**
   * @zh-CN 表单项的标签与控件的对其方式
   * @en-US The alignment of form item labels and controls
   */
  labelAlign: {
    type: String as PropType<'top' | 'center' | 'bottom'>,
  },
  /**
   * @zh-CN 表单项标签水平对齐方式
   * @en-US The horizontal alignment of form item labels
   */
  labelJustify: {
    type: String as PropType<'left' | 'center' | 'right'>,
  },
  /**
   * @zh-CN 是否禁用表单内所有控件
   * @en-US Whether to disable all controls within the form
   * @since 1.2.7
   */
  disabled: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
  /**
   * @zh-CN 表单内控件尺寸
   * @en-US Control size within the form
   * @since 1.2.7
   */
  size: {
    type: String as PropType<SizeT>,
  },
  /**
   * @zh-CN 表单内控件圆角模式
   * @en-US Control round mode within the form
   * @since 1.2.7
   */
  round: {
    type: String as PropType<RoundT>,
  },
  /**
   * @zh-CN 表单内控件是否可清空
   * @en-US Whether form controls are clearable
   * @since 1.2.7
   */
  clearable: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
};

export const formProps = {
  /**
   * @zh-CN 表单数据对象
   * @en-US Form data object
   */
  model: {
    type: Object,
  },
  /**
   * @zh-CN 表单验证规则（全局），按字段名匹配 FormItem
   * @en-US Form validation rules (global), matched to FormItem by field name
   * @since 1.2.7
   */
  rules: {
    type: Object as PropType<FormRulesT>,
  },
  /**
   * @zh-CN 是否有必填项，用于控制文本左对齐样式
   * @en-US Whether there is a required item, used to control the text alignment style
   * @default false
   */
  hasRequired: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 是否仅展示必填星号而不触发默认 required 校验，适用于自定义校验逻辑的场景
   * @en-US Whether to only show the required asterisk without triggering default required validation, suitable for custom validation scenarios
   * @default false
   * @since 1.2.7
   */
  requiredIcon: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 表单布局方式
   * @en-US Form layout
   * @default 'h'
   */
  layout: {
    type: String as PropType<'h' | 'v' | 'inline'>,
    default: 'h',
  },

  /**
   * @zh-CN 表单项文本宽度（全局），支持 `'auto'` 自动计算最宽标签
   * @en-US The width of form item labels (global), supports `'auto'` for auto-calculating the widest label
   * @default 'auto'
   * @since 1.2.7
   */
  labelWidth: {
    type: String,
    default: 'auto',
  },

  /**
   * @zh-CN 是否显示校验错误消息
   * @en-US Whether to show validation error messages
   * @default true
   * @since 1.2.7
   */
  showMessage: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 规则变更时是否自动触发校验
   * @en-US Whether to trigger validation automatically when rules change
   * @default true
   * @since 1.2.7
   */
  validateOnRuleChange: {
    type: Boolean,
    default: true,
  },
  /**
   * @zh-CN 校验失败时是否滚动到首个错误项
   * @en-US Whether to scroll to the first error item when validation fails
   * @since 1.2.7
   */
  scrollToError: {
    type: Boolean,
    default: false,
  },
  ...sharedProps,
};
export type FormPropsT = ExtractPropTypes<typeof formProps>;

export const formItemProps = {
  /**
   * @zh-CN model键名，在使用了 rules 属性时，此属性为必填项
   * @en-US model key name, when using the rules property, this property is required
   */
  field: {
    type: String,
  },
  /**
   * @zh-CN 是否必选
   * @en-US Whether it is required
   * @default false
   */
  required: {
    type: Boolean,
    default: false,
  },
  /**
   * @zh-CN 是否仅展示必填星号而不触发默认 required 校验，未设置时继承 Form 的 requiredIcon
   * @en-US Whether to only show the required asterisk without triggering default required validation, inherits Form's requiredIcon when unset
   * @since 1.2.7
   */
  requiredIcon: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
  /**
   * @zh-CN 表单项标签
   * @en-US Form item label
   */
  label: {
    type: String,
    default: undefined,
  },
  /**
   * @zh-CN 表单项文本宽度，支持 `'auto'`
   * @en-US The width of form item labels, supports `'auto'`
   * @since 1.2.7
   */
  labelWidth: {
    type: String,
  },
  /**
   * @zh-CN 表单验证规则（局部，与全局 rules 合并）
   * @en-US Form validation rules (local, merged with global rules)
   */
  rules: {
    type: Array as PropType<Array<RulesT>>,
  },
  /**
   * @zh-CN 表单验证的默认触发事件，手动校验未传参或提交前自动校验时的默认触发事件
   * @en-US The default trigger event for form validation
   */
  defaultTrigger: {
    type: String as PropType<TriggerT>,
  },
  /**
   * @zh-CN 手动设置校验错误信息，设置后立即显示错误状态
   * @en-US Manually set validation error message, shown immediately
   * @since 1.2.7
   */
  error: {
    type: String,
  },
  /**
   * @zh-CN 手动设置校验状态
   * @en-US Manually set validation status
   * @since 1.2.7
   */
  validateStatus: {
    type: String as PropType<ValidateStatusT>,
  },
  /**
   * @zh-CN 是否显示校验消息，未设置时继承 Form 的 showMessage
   * @en-US Whether to show validation message, inherits Form's showMessage when unset
   * @since 1.2.7
   */
  showMessage: {
    type: Boolean as PropType<boolean | undefined>,
    default: undefined,
  },
  ...sharedProps,
};

export type FormItemPropsT = ExtractPropTypes<typeof formItemProps>;
