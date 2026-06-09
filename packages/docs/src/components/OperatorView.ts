import { defineComponent, h, Fragment, type PropType, type VNode } from 'vue';
import { OSelect, OOption, OInput, OInputNumber, OCheckbox, OCheckboxGroup, OTextarea, ORadio, ORadioGroup } from '@opensig/opendesign';

export type CheckboxScheme = {
  type: 'boolean';
  default?: boolean;
  label?: string;
  disabled?: boolean;
};
export type SelectorScheme = {
  type: 'list';
  list: Array<string | number>;
  default?: string | number;
  label?: string;
  disabled?: boolean;
};
export type InputScheme = {
  type: 'string';
  default?: string;
  label?: string;
  disabled?: boolean;
};
export type TextareaScheme = {
  type: 'textarea';
  default?: string;
  label?: string;
  row?: number;
  disabled?: boolean;
};
export type InputNumberScheme = {
  type: 'number';
  step?: number;
  min?: number;
  max?: number;
  default?: number;
  label?: string;
  disabled?: boolean;
};
export type RadioScheme = {
  type: 'radio';
  default?: string | number;
  list: Array<string | number>;
  disabled?: boolean;
};
export type SchemeT = CheckboxScheme | SelectorScheme | InputScheme | TextareaScheme | InputNumberScheme | RadioScheme;
export type State = Record<string, any>;

const camelcase2words = (str: string) => str.replace(/(?<=[a-z])([A-Z])|(?<=[A-Z])([A-Z][a-z])/g, ' $&').replace(/^[a-z]/, (char) => char.toUpperCase());
const createCheckboxItem = (key: string, value: CheckboxScheme) => {
  return h(OCheckbox, { value: key, disabled: value.disabled }, { default: () => value.label || camelcase2words(key) });
};
const createSelectorItem = (key: string, value: SelectorScheme, state: State) => {
  return h(Fragment, [
    h('span', { class: 'props-playground-selector-name' }, value.label || camelcase2words(key)),
    h(
      OSelect,
      { modelValue: state[key], disabled: value.disabled, 'onUpdate:modelValue': (val: any) => (state[key] = val) },
      {
        default: () => value.list.map((item) => h(OOption, { value: item, label: `${item}` })),
      },
    ),
  ]);
};
const createInputItem = (key: string, value: InputScheme, state: State) => {
  return h(Fragment, [
    h('span', { class: 'props-playground-selector-name' }, value.label || camelcase2words(key)),
    h(OInput, { modelValue: state[key], disabled: value.disabled, 'onUpdate:modelValue': (val: string) => (state[key] = val) }),
  ]);
};
const createTextareaItem = (key: string, value: TextareaScheme, state: State) => {
  return h(Fragment, [
    h('span', { class: 'props-playground-selector-name' }, value.label || camelcase2words(key)),
    h(OTextarea, {
      modelValue: state[key],
      disabled: value.disabled,
      style: { '--row': value.row ?? 3 },
      class: 'props-playground-textarea',
      'onUpdate:modelValue': (val: string) => (state[key] = val),
    }),
  ]);
};
const createInputNumberItem = (key: string, value: InputNumberScheme, state: State) => {
  return h(Fragment, [
    h('span', { class: 'props-playground-selector-name' }, value.label || camelcase2words(key)),
    h(OInputNumber, {
      modelValue: state[key],
      disabled: value.disabled,
      min: value.min,
      max: value.max,
      step: value.step,
      'onUpdate:modelValue': (val: number) => (state[key] = val),
    }),
  ]);
};
const createRadioItem = (key: string, value: RadioScheme, state: State) => {
  return h(
    ORadioGroup,
    { modelValue: state[key], disabled: value.disabled, class: 'radio-group', 'onUpdate:modelValue': (val: any) => (state[key] = val) },
    { default: () => value.list.map((item) => h(ORadio, { value: item }, { default: () => item })) },
  );
};

type OperatorGroupKey = 'checkbox' | 'selectionOrInput' | 'radio';
type OperatorGroups = Record<OperatorGroupKey, VNode[]>;

const OPERATOR_GROUP_MAP: Record<SchemeT['type'], OperatorGroupKey> = {
  boolean: 'checkbox',
  list: 'selectionOrInput',
  string: 'selectionOrInput',
  textarea: 'selectionOrInput',
  number: 'selectionOrInput',
  radio: 'radio',
};

const NODE_CREATOR_MAP: Record<SchemeT['type'], (key: string, value: any, state: State) => VNode> = {
  boolean: createCheckboxItem,
  list: createSelectorItem,
  string: createInputItem,
  textarea: createTextareaItem,
  number: createInputNumberItem,
  radio: createRadioItem,
};

/**
 * 根据 schema 生成各类型的控件 VNode 并分组
 * @param schema - 表单控件配置
 * @param state - 状态对象
 * @returns 分组后的控件 VNode
 */
function collectOperatorGroups(schema: Record<string, SchemeT>, state: State): OperatorGroups {
  const groups: OperatorGroups = { checkbox: [], selectionOrInput: [], radio: [] };
  Object.entries(schema).forEach(([key, value]) => {
    const groupKey = OPERATOR_GROUP_MAP[value.type];
    const node = NODE_CREATOR_MAP[value.type]?.(key, value, state);
    if (groupKey && node) {
      groups[groupKey].push(node);
    }
  });
  return groups;
}

/**
 * 处理复选框组变更事件，先将所有布尔字段设为 false，再将选中项设为 true
 * @param val - 选中的复选框值数组
 * @param schema - 表单控件配置
 * @param state - 状态对象
 */
function handleCheckboxChange(val: Array<string | number>, schema: Record<string, SchemeT>, state: State): void {
  Object.entries(schema).forEach(([key, value]) => {
    if (value.type === 'boolean') {
      state[key] = false;
    }
  });
  val.forEach((name) => {
    state[name] = true;
  });
}
/** 表单控件组件 */
export default defineComponent({
  name: 'OperatorView',
  props: {
    schema: {
      type: Object as PropType<Record<string, SchemeT>>,
      required: true,
    },
    state: {
      type: Object as PropType<State>,
      required: true,
    },
    checkboxGroupValue: {
      type: Array as PropType<Array<string | number>>,
      required: true,
    },
  },
  setup(props) {
    return () => {
      const groups = collectOperatorGroups(props.schema, props.state);
      const operatorGroup: VNode[] = [];
      if (groups.radio.length) {
        operatorGroup.push(h(Fragment, groups.radio));
      }
      if (groups.checkbox.length) {
        operatorGroup.push(
          h(
            OCheckboxGroup,
            {
              class: 'checkbox-group',
              modelValue: props.checkboxGroupValue,
              onChange: (val) => handleCheckboxChange(val, props.schema, props.state),
            },
            {
              default: () => groups.checkbox,
            },
          ),
        );
      }
      if (groups.selectionOrInput.length) {
        operatorGroup.push(h('div', { class: 'operator-group' }, groups.selectionOrInput));
      }
      return h(Fragment, operatorGroup);
    };
  },
});
