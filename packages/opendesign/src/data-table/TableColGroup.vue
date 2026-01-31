<script setup lang="ts">
import { inject, markRaw, ref, watch, onUnmounted } from 'vue';

import { useResizeObserver } from '../hooks';
import { debounceRAF } from '../_utils/helper.ts';
import { EffectiveDataTableColumnT } from './types.ts';
import { dataTableInjectKey } from './provide.ts';

const props = defineProps<{
  columns: EffectiveDataTableColumnT[];
  columnWidthMap: Record<string, number>;
}>();

const dataTableInjection = inject(dataTableInjectKey);

/**
 * 仅支持纯数字、px、百分比
 */
const parseWidth = (width?: string | number) => {
  if (typeof width === 'string' && width.endsWith('%')) {
    return (dataTableInjection!.containerWidth.value * Number.parseFloat(width)) / 100;
  }
  if (typeof width === 'string') {
    return Number.parseFloat(width);
  }
  return width;
};

const getWidth = (column: EffectiveDataTableColumnT) => {
  if (!dataTableInjection?.containerWidth) {
    return {};
  }

  return {
    width: `${parseWidth(props.columnWidthMap[column.key] || column.width)}px`,
    minWidth: column.minWidth ? `${parseWidth(column.minWidth)}px` : undefined,
    maxWidth: column.maxWidth ? `${parseWidth(column.maxWidth)}px` : undefined,
  };
};

const colgroupRef = ref<HTMLTableColElement>();
const setColRef = async (col: any, column: EffectiveDataTableColumnT) => {
  column.colRef = markRaw(col as HTMLTableColElement);
};
const resizeObserver = useResizeObserver();
const resizeHandler = debounceRAF(() => {
  if (!colgroupRef.value || !dataTableInjection) {
    return;
  }
  Array.from(dataTableInjection.dataColumnMap.entries()).forEach(([_key, column]) => {
    if (!column.colRef) {
      return;
    }
    column.resizeWidth = column.colRef.getBoundingClientRect().width;
    dataTableInjection.columnWidthMap[column.key] = column.resizeWidth;
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
    <col v-for="column of props.columns" :key="column.key" :ref="(el) => setColRef(el, column)" :style="getWidth(column)" />
  </colgroup>
</template>
