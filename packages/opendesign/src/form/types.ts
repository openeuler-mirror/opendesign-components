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
   * @zh-CN 表单数据对象
   * @en-US Form data object
   */
  model: {
    type: Object,
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
   * @zh-CN 表单布局方式
   * @en-US Form layout
   * @default 'h'
   */
  layout: {
    type: String as PropType<'h' | 'v' | 'inline'>,
    default: 'h',
  },
  /**
   * @zh-CN 表单项的标签与控件的对其方式（全局）
   * @en-US The alignment of form item labels and controls (global)
   */
  labelAlign: {
    type: String as PropType<'top' | 'center' | 'bottom'>,
  },
  /**
   * @zh-CN 表单项标签水平对齐方式（全局）
   * @en-US The horizontal alignment of form item labels (global)
   */
  labelJustify: {
    type: String as PropType<'left' | 'center' | 'right'>,
  },
  /**
   * @zh-CN 表单项文本宽度（全局）
   * @en-US The width of form item labels (global)
   */
  labelWidth: {
    type: String,
  },
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
   * @zh-CN 表单项标签
   * @en-US Form item label
   */
  label: {
    type: String,
    default: undefined,
  },
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
   * @zh-CN 表单项文本宽度
   * @en-US The width of form item labels
   */
  labelWidth: {
    type: String,
  },
  /**
   * @zh-CN 表单验证规则
   * @en-US Form validation rules
   */
  rules: {
    type: Array as PropType<Array<RulesT>>,
  },
  /**
   * @zh-CN 表单验证的默认触发事件，手动校验未传参或提交前自动校验时的默认触发事件
   * @en-US The default trigger event for form validation, and the default trigger event when manual validation is performed without passing parameters or during automatic validation before submission.
   */
  defaultTrigger: {
    type: String as PropType<TriggerT>,
  },
};

export type FormItemPropsT = ExtractPropTypes<typeof formItemProps>;
