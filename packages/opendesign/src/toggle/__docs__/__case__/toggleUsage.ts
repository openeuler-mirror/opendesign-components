import { propsToAttrStr } from '../../../_demo/utils';
import { reactive } from 'vue';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types.ts';

export const docs = {
  'zh-CN':
    '选择块是指示当前状态并提供切换操作的表单控件，并支持插槽以实现自定义显示。可设置项包含：  \n  \n' +
    '- 双向绑定状态`checked`  \n' +
    '- 非受控状态时是否选中`defaultChecked`  \n' +
    '- 圆角值`round`  \n' +
    '- 前缀图标`icon`  \n' +
    '- 是否禁用`disabled`  \n' +
    '还可以配合`ORadio`、`ORadioGroup`等组件达到唯一选择的目的',
  'en-US':
    'Select block is a form control that indicates the current state and provides toggle operations, supporting slots for custom display. Configurable items include：  \n  \n' +
    '- Two-way bound state`checked`  \n' +
    '- Whether selected in uncontrolled state `defaultChecked`  \n' +
    '- Round corner value `round`  \n' +
    '- Prefix icon `icon`  \n' +
    '- Disabled state `disabled`  \n' +
    'It can also be combined with components like `ORadio`、`ORadioGroup`  to achieve single selection',
};

export const ctx = reactive({ checked1: true });

export const schema = {
  checked: {
    type: 'boolean',
    default: true,
  },
  round: {
    type: 'string',
    default: 'pill'
  },
  disabled: {
    type: 'boolean',
    default: false
  }
} satisfies Record<string, DocDemoSchema>;

export const template:DocDemoTemplate<typeof schema> = (_props) => {
  return `
<section>
  <OToggle ${propsToAttrStr(_props)}>Checked: ${_props.checked}</OToggle>
  <OToggle>3</OToggle>
</section>  
  `;
};
