<script setup lang="ts">
import { inject, markRaw, ref, watch, onUnmounted } from 'vue';

import { useResizeObserver } from '../hooks';
import { debounceRAF } from '../_utils/helper.ts';
import { EffectiveDataTableColumnT } from './types.ts';
import { dataTableInjectKey } from './provide.ts';
import { isNumeric } from '../_utils/is.ts';

const dataTableInjection = inject(dataTableInjectKey);

/**
 * 获取调用者传入的宽度配置
 */
const getPropWidth = (column: EffectiveDataTableColumnT) => {
  let width = column?.colRef?.style.width;
  if (!width) {
    width = isNumeric(column.width) ? column.width + 'px' : column.width;
  }

  return {
    width,
    minWidth: isNumeric(column.minWidth) ? column.minWidth + 'px' : column.minWidth,
    maxWidth: isNumeric(column.maxWidth) ? column.maxWidth + 'px' : column.maxWidth,
  };
};

const colgroupRef = ref<HTMLTableColElement>();
const setColRef = async (col: any, column: EffectiveDataTableColumnT) => {
  if (!col) {
    return;
  }
  column.colRef = markRaw(col as HTMLTableColElement);
};
const resizeObserver = useResizeObserver();
const resizeHandler = debounceRAF(() => {
  if (!colgroupRef.value || !dataTableInjection) {
    return;
  }
  dataTableInjection.dataColumns.value.forEach((column) => {
    if (!column.colRef) {
      return;
    }
    column.resizeWidth = Math.ceil(column.colRef.getBoundingClientRect().width);
  });
});
watch(
  colgroupRef,
  (newVal, oldVal) => {
    if (oldVal) {
      resizeObserver.unobserve(oldVal, resizeHandler);
    }
    if (newVal) {
      resizeHandler();
      resizeObserver.observe(newVal, resizeHandler);
    }
  },
  { immediate: true },
);
onUnmounted(() => {
  if (colgroupRef.value) {
    resizeObserver.unobserve(colgroupRef.value, resizeHandler);
  }
});
</script>

<template>
  <colgroup ref="colgroupRef">
    <col v-for="column of dataTableInjection?.dataColumns.value" :key="column.key" :ref="(el) => setColRef(el, column)" :style="getPropWidth(column)" />
  </colgroup>
</template>
