<docs lang="md">
<!-- zh-CN -->

### 全选及半选

通过 `indeterminate` 属性设置半选状态，结合 `change` 事件实现全/半选功能

<!-- en-US -->

### Select All and Indeterminate State

Set the indeterminate state using the `indeterminate` attribute, and implement the select all/indeterminate functionality by combining with the `change` event.
</docs>
<script setup lang="ts">
import { computed, ref } from 'vue';
import { OCheckbox } from '@opensig/opendesign';

const selected = ref<number[]>([]);
const options = [
  { label: 'Check 1', value: 1 },
  { label: 'Check 2', value: 2 },
  { label: 'Check 3', value: 3 },
  { label: 'Check 4', value: 4 },
  { label: 'Check 5', value: 5 },
];
const allState = computed(() => {
  const selectedCount = options.reduce((acc, option) => {
    if (selected.value.includes(option.value)) {
      acc++;
    }
    return acc;
  }, 0);
  return {
    /** is all selected */
    all: selectedCount === options.length,
    /** is some selected */
    indeterminate: selectedCount > 0 && selectedCount < options.length,
  };
});

const handleChangeAll = () => {
  if (allState.value.all) {
    selected.value = [];
  } else {
    selected.value = options.map((option) => option.value);
  }
};
</script>
<template>
  <OCheckbox :model-value="allState.all ? ['all'] : []" value="all" :indeterminate="allState.indeterminate" @change="handleChangeAll">All</OCheckbox>
  <div class="o-checkbox-group">
    <OCheckbox v-for="option in options" v-model="selected" :key="option.value" :value="option.value">
      {{ option.label }}
    </OCheckbox>
  </div>
</template>
<style lang="scss" scoped>
.o-checkbox-group {
  display: flex;
  gap: 24px;
}
</style>
