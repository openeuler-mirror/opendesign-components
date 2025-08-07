import { defineComponent, h, Fragment, type PropType, type VNode } from 'vue';
import { OSelect, OOption, OInput, OInputNumber, OCheckbox, OCheckboxGroup, OTextarea, ORadio, ORadioGroup } from '@opensig/opendesign';

type CheckboxScheme = {
  type: 'boolean';
  default?: boolean;
  label?: string;
};
type SelectorScheme = {
  type: 'list';
  list: Array<string | number>;
  default?: string | number;
  label?: string;
};
type InputScheme = {
  type: 'string';
  default?: string;
  label?: string;
};
type TextareaScheme = {
  type: 'textarea';
  default?: string;
  label?: string;
  row?: number;
};
type InputNumberScheme = {
  type: 'number';
  step?: number;
  min?: number;
  max?: number;
  default?: number;
  label?: string;
};
type RadioScheme = {
  type: 'radio';
  default?: string | number;
  list: Array<string | number>;
};
export type SchemeT = CheckboxScheme | SelectorScheme | InputScheme | TextareaScheme | InputNumberScheme | RadioScheme;
export type State = Record<string, any>;

const camelcase2words = (str: string) => str.replace(/(?<=[a-z])([A-Z])|(?<=[A-Z])([A-Z][a-z])/g, ' $&').replace(/^[a-z]/, (char) => char.toUpperCase());
const createCheckboxItem = (key: string, value: CheckboxScheme) => {
  return h(OCheckbox, { value: key }, { default: () => value.label || camelcase2words(key) });
};
const createSelectorItem = (key: string, value: SelectorScheme, state: State) => {
  return h(Fragment, [
    h('span', { class: 'props-playground-selector-name' }, value.label || camelcase2words(key)),
    h(
      OSelect,
      { modelValue: state[key], 'onUpdate:modelValue': (val) => (state[key] = val) },
      {
        default: () => value.list.map((item) => h(OOption, { value: item, label: `${item}` })),
      },
    ),
  ]);
};
const createInputItem = (key: string, value: InputScheme, state: State) => {
  return h(Fragment, [
    h('span', { class: 'props-playground-selector-name' }, value.label || camelcase2words(key)),
    h(OInput, { modelValue: state[key], 'onUpdate:modelValue': (val) => (state[key] = val) }),
  ]);
};
const createTextareaItem = (key: string, value: TextareaScheme, state: State) => {
  return h(Fragment, [
    h('span', { class: 'props-playground-selector-name' }, value.label || camelcase2words(key)),
    h(OTextarea, {
      modelValue: state[key],
      style: { '--row': value.row || 3 },
      class: 'props-playground-textarea',
      'onUpdate:modelValue': (val) => (state[key] = val),
    }),
  ]);
};
const createInputNumberItem = (key: string, value: InputNumberScheme, state: State) => {
  return h(Fragment, [
    h('span', { class: 'props-playground-selector-name' }, value.label || camelcase2words(key)),
    h(OInputNumber, {
      modelValue: state[key],
      min: value.min,
      max: value.max,
      step: value.step,
      'onUpdate:modelValue': (val) => (state[key] = val),
    }),
  ]);
};
const createRadioItem = (key: string, value: RadioScheme, state: State) => {
  return h(
    ORadioGroup,
    { modelValue: state[key], class: 'radio-group', 'onUpdate:modelValue': (val) => (state[key] = val) },
    { default: () => value.list.map((item) => h(ORadio, { value: item }, { default: () => item })) },
  );
};
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
      /** 复选框控件 */
      const checkboxGroup: VNode[] = [];
      /** 选着框控件 */
      const selectionOrInputGroup: VNode[] = [];
      /** 单选框控件 */
      const radioGroup: VNode[] = [];
      const operatorGroup: VNode[] = [];

      Object.entries(props.schema).forEach(([key, value]) => {
        switch (value.type) {
          case 'boolean':
            checkboxGroup.push(createCheckboxItem(key, value));
            break;
          case 'list':
            selectionOrInputGroup.push(createSelectorItem(key, value, props.state));
            break;
          case 'string':
            selectionOrInputGroup.push(createInputItem(key, value, props.state));
            break;
          case 'textarea':
            selectionOrInputGroup.push(createTextareaItem(key, value, props.state));
            break;
          case 'number':
            selectionOrInputGroup.push(createInputNumberItem(key, value, props.state));
            break;
          case 'radio':
            radioGroup.push(createRadioItem(key, value, props.state));
            break;
        }
      });
      if (radioGroup.length) {
        operatorGroup.push(h(Fragment, radioGroup));
      }
      if (checkboxGroup.length) {
        operatorGroup.push(
          h(
            OCheckboxGroup,
            {
              class: 'checkbox-group',
              modelValue: props.checkboxGroupValue,
              onChange: (val) => {
                Object.entries(props.schema).forEach(([key, value]) => {
                  if (value.type === 'boolean') {
                    props.state[key] = false;
                  }
                });
                val.forEach((name) => {
                  props.state[name] = true;
                });
              },
            },
            {
              default: () => checkboxGroup,
            },
          ),
        );
      }
      if (selectionOrInputGroup.length) {
        operatorGroup.push(h('div', { class: 'operator-group' }, selectionOrInputGroup));
      }
      return h(Fragment, operatorGroup);
    };
  },
});
