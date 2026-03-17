<script setup lang="ts">
import { inject, markRaw, ref, watch, onUnmounted } from 'vue';

import { useResizeObserver } from '../hooks';
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
const resizeObserver = useResizeObserver();
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
