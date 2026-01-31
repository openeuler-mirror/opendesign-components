<template>
  <component :is="renderContent" />
</template>

<script setup lang="ts">
import { computed, type Component, type VNode } from 'vue';

import { getRenderableComponent } from '../_utils/vue-utils';
import type { DataTableColumnFormatterOptions } from './types';

const props = defineProps<DataTableColumnFormatterOptions>();

// 计算并生成要渲染的内容
const renderContent = computed((): Component | VNode | string | null => {
  const { row, column, cellValue, rowIndex, colIndex } = props;
  const { formatter } = column;

  // 执行formatter，获取渲染内容
  const formatterOptions: DataTableColumnFormatterOptions = {
    row,
    column,
    cellValue,
    rowIndex,
    colIndex,
  };
  const content = formatter(formatterOptions);

  return getRenderableComponent(content);
});
</script>
