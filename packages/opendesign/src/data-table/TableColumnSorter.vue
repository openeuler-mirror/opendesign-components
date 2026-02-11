<script setup lang="ts">
import { OIconSort } from '../icon-components';
import { OButton } from '../button';
import { DataTableSortMethod, DataTableSortMethodT } from './types.ts';

const modelValue = defineModel<DataTableSortMethodT>('modelValue', { default: undefined });

const handleSorterClick = () => {
  switch (modelValue.value) {
    case DataTableSortMethod.ASC:
      modelValue.value = DataTableSortMethod.DESC;
      return;
    case DataTableSortMethod.DESC:
      modelValue.value = DataTableSortMethod.NA;
      return;
    case DataTableSortMethod.NA:
      modelValue.value = DataTableSortMethod.ASC;
      return;
  }
};
</script>

<template>
  <OButton
    :icon="OIconSort"
    size="small"
    :class="{
      'o-data-table-sorter': true,
      'o-data-table-sorter-asc': modelValue === DataTableSortMethod.ASC,
      'o-data-table-sorter-desc': modelValue === DataTableSortMethod.DESC,
    }"
    @click="handleSorterClick"
  />
</template>
