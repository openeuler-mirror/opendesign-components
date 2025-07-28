<docs lang="md">
<!-- zh-CN -->

### 多选框组

由于 `OCheckbox` 是通过判断 `modelValue` 数组中是否含有 `value` 值来判断是否被选中。因此多个多选框公用同一个响应式变量即可实现多选框组功能。

也可以配合 `OCheckGroup` 实现多选框组以及其它更丰富的功能：

1. `OCheckboxGroup` 的 `disabled` 属性禁用整个多选框组（`OCheckbox` 的 `disabled` 禁用自身）
2. `max` 属性限制多选框组可选数量
3. `min` 属性限制多选框组至少可选数量
4. `direction` 属性控制多选框组内多选框的排列方向

<!-- en-US -->
### Checkbox Group

Since `OCheckbox` determines whether it's selected by checking if its `value` exists in the `modelValue` array, multiple checkboxes sharing the same reactive variable can implement a checkbox group.

It can also be used in conjunction with `OCheckboxGroup` to implement checkbox group functionality along with other enhanced features:

1. The `disabled` property of `OCheckboxGroup` disables the entire checkbox group (whereas `OCheckbox`'s `disabled` property disables only itself)
2. The `max` property sets the maximum number of selectable options in the checkbox group
3. The `min` property sets the minimum number of options that must be selected in the checkbox group
4. The `direction` property controls the alignment direction of checkboxes within the group
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { OCheckbox, OCheckboxGroup } from '@opensig/opendesign';

const selected = ref(["1"]);
</script>
<template>
  <p>checkbox group without OCheckboxGroup</p>
  <div class="check-group">
    <OCheckbox v-model="selected" value="1">check 1</OCheckbox>
    <OCheckbox v-model="selected" value="2">check 2</OCheckbox>
    <OCheckbox v-model="selected" value="3">check 3</OCheckbox>
    <OCheckbox v-model="selected" value="4">check 4</OCheckbox>
  </div>
  <p>checkbox group with OCheckboxGroup</p>
  <OCheckboxGroup v-model="selected" :min="1" :max="2" direction="v">
    <OCheckbox value="1">check 1</OCheckbox>
    <OCheckbox value="2">check 2</OCheckbox>
    <OCheckbox value="3">check 3</OCheckbox>
    <OCheckbox value="4">check 4</OCheckbox>
  </OCheckboxGroup>
  <div class="result">selected: {{ selected }}</div>
</template>
<style lang="scss" scoped>
.check-group {
  display: flex;
  gap: 24px;
}
</style>
