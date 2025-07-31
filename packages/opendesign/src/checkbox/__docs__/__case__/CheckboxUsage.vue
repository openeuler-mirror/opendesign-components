<docs lang="md">
<!-- zh-CN -->
### 使用

多选框传值：

1. `value` 用于设置选中后 `modelValue` 的中包含的值
2. `modelValue` 的类型是 `Array<string | number>`，当选中后数组中会添加 `value`，否则会移除 `value`

半选：当 `indeterminate` 为 true 时，多选框将处于半选状态（无论 `modelValue` 是何值）。

多选框组：由于 `modelValue` 是一个数组，因此多选框组可以单独使用 `OCheckbox` 组件，也可以嵌套在 `OCheckboxGroup` 组件中。

<!-- en-US -->
### Usage

Checkbox Value Binding:

1. `value` sets the value to be included in `modelValue` when the checkbox is checked.
2. `modelValue` has a type of `Array<string | number>`. When checked, the `value` is added to the array; when unchecked, the `value` is removed.

Indeterminate State: When `indeterminate` is set to true, the checkbox will appear partially checked (regardless of the modelValue state).

Checkbox Groups: Since `modelValue` is an array, checkbox groups can be implemented either by using individual `OCheckbox` components directly or by nesting them within an `OCheckboxGroup` component.
</docs>
<script setup lang="ts">
import { reactive } from 'vue';
import { propsToAttrStr } from '../../../_demo/utils';
import { DocDemoSchema, DocDemoTemplate } from '../../../_demo/types';

const _schema = {
  value: {
    type: 'string',
    default: 'apple',
  },
  disabled: {
    type: 'boolean',
    default: false,
  },
  indeterminate: {
    type: 'boolean',
    default: false,
  },
} satisfies Record<string, DocDemoSchema>;

const _ctx = reactive({
  modelValue: [],
});

const _template: DocDemoTemplate<typeof _schema> = (props) => {
  return `
<OCheckbox
  v-model="ctx.modelValue"
  ${propsToAttrStr(props)}
  class="checkbox-doc-usage"
>
  Apple
</OCheckbox>
<p>Selected: {{ ctx.modelValue }}</p>
`;
};
</script>
<style lang="scss">
.checkbox-doc-usage {
  display: block;
  width: fit-content;
}
</style>
