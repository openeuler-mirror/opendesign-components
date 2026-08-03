<script setup lang="ts">
import { inject, markRaw, ref } from 'vue';
import { useResizeObserver } from '@vueuse/core';

import { debounceRAF } from '../_utils/helper.ts';
import { isNil } from '../_utils/is.ts';

import { EffectiveDataTableColumnT } from './types.ts';
import { dataTableInjectKey } from './provide.ts';

const dataTableInjection = inject(dataTableInjectKey);

/**
 * 获取调用者传入的宽度配置
 */
const getPropWidth = (column: EffectiveDataTableColumnT) => {
  return {
    minWidth: !isNil(column._minWidth) ? `${column._minWidth}px` : column._minWidth,
    maxWidth: !isNil(column._maxWidth) ? `${column._maxWidth}px` : column._maxWidth,
  };
};

const colgroupRef = ref<HTMLTableColElement>();
const setColRef = async (col: any, column: EffectiveDataTableColumnT) => {
  if (!col) {
    return;
  }
  column.colRef = markRaw(col as HTMLTableColElement);
};

/**
 * @description colgroup 尺寸变化回调——遍历所有列，读取每列 <col> 元素的实际渲染宽度并写入 column.resizeWidth，
 *              供自适应列宽计算使用。debounceRAF 将多帧合并为单帧，避免布局抖动。
 */
const resizeHandler = debounceRAF(() => {
  if (!colgroupRef.value || !dataTableInjection) {
    return;
  }
  dataTableInjection.dataColumns.value.forEach((column) => {
    if (!column.colRef) {
      return;
    }
    column.resizeWidth = column.colRef.getBoundingClientRect().width;
  });
});

/**
 * @description 监听 colgroup 尺寸变化，同步各列实际渲染宽度到 column.resizeWidth。
 */
useResizeObserver(colgroupRef, resizeHandler);
</script>

<template>
  <colgroup ref="colgroupRef">
    <col v-for="column of dataTableInjection?.dataColumns.value" :key="column.key" :ref="(el) => setColRef(el, column)" :style="getPropWidth(column)" />
  </colgroup>
</template>
