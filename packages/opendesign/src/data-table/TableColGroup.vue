<script setup lang="ts">
import { inject, markRaw, ref } from 'vue';

import { isNil } from '../_utils/is.ts';

import { EffectiveDataTableColumnT } from './types.ts';
import { dataTableInjectKey } from './provide.ts';
import { resolveColumnWidth } from './utils.ts';

const dataTableInjection = inject(dataTableInjectKey);

/**
 * @description 按列配置生成 <col> 元素的宽度样式，三层优先级（统一钳制口径）：
 *              userWidths > 声明 width > 自动分配。
 */
const getColStyle = (column: EffectiveDataTableColumnT) => {
  const injection = dataTableInjection;
  if (!injection) {
    return {};
  }

  // userWidths / 声明 width：解析后锁定 width = min = max
  const resolved = resolveColumnWidth(column, injection.userWidths, injection.containerWidth.value);
  if (!isNil(resolved)) {
    return { width: `${resolved}px`, minWidth: `${resolved}px`, maxWidth: `${resolved}px` };
  }

  // 无声明 width：参与浏览器自动分配，仅设 min/max 约束
  return {
    minWidth: !isNil(column._minWidth) ? `${column._minWidth}px` : undefined,
    maxWidth: !isNil(column._maxWidth) ? `${column._maxWidth}px` : undefined,
  };
};

const colgroupRef = ref<HTMLTableColElement>();
const setColRef = async (col: any, column: EffectiveDataTableColumnT) => {
  if (!col) {
    return;
  }
  column.colRef = markRaw(col as HTMLTableColElement);
};
</script>

<template>
  <colgroup ref="colgroupRef">
    <col v-for="column of dataTableInjection?.dataColumns.value" :key="column.key" :ref="(el) => setColRef(el, column)" :style="getColStyle(column)" />
  </colgroup>
</template>
