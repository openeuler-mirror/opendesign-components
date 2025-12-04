<docs lang="md">
<!-- zh-CN -->

### 使用

选择块是指示当前状态并提供切换操作的表单控件，并支持插槽以实现自定义显示。可设置项包含：

双向绑定状态 `checked`；

非受控状态时是否选中 `defaultChecked`；

圆角值 `round`；

前缀图标 `icon`；

是否禁用 `disabled`；

还可以配合 `ORadio`、`ORadioGroup` 等组件达到唯一选择的目的。

<!-- en-US -->

### Usage

Select block is a form control that indicates the current state and provides toggle operations, supporting slots for custom display. Configurable items include:

Two-way bound state `checked` ;

Whether selected in uncontrolled state `defaultChecked` ;

Round corner value `round` ;

Prefix icon `icon` ;

Disabled state `disabled` ;

It can also be combined with components like `ORadio`、`ORadioGroup` to achieve single selection.
</docs>

<script setup lang="ts">
import { reactive } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils.ts';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types.ts';

const _oSchema = {
  round: {
    type: 'list',
    list: ['pill', '4px', '8px'],
  },
  disabled: {
    type: 'boolean',
    default: false,
  },
  'icon(slot)': {
    type: 'boolean',
    default: true,
  },
  toggledVal: {
    type: 'string',
    disabled: true,
  },
} satisfies Record<string, DocDemoSchema>;

const _oTemplate: DocDemoTemplate<typeof _oSchema> = (props) => {
  const { 'icon(slot)': iconSlot } = props;
  props.toggledVal = String(_oCtx.checked);
  let innerHTML = '';
  if (iconSlot) {
    innerHTML += '<template #icon><OIconChecked /></template>';
  }
  return `
  <OToggle v-model:checked="ctx.checked" ${propsToAttrStr(props, ['icon(slot)', 'toggledVal'])} >
  筛选条件${innerHTML}
  </OToggle>
  `;
};
const _oCtx = reactive({
  checked: true,
});
</script>
