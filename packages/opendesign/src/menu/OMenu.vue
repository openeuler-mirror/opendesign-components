<script setup lang="ts">
import { onMounted, provide, ref, toRefs, watch, toRef } from 'vue';
import { menuInjectKey } from './provide';
import { menuProps } from './types';
import MenuTree from './menu';
import { isArray, isUndefined } from '../_utils/is';

const props = defineProps(menuProps);

const emits = defineEmits<{
  (e: 'update:modelValue', val: string): void;
  (e: 'change', val: string): void;
  (e: 'update:expanded', val: Array<string>): void;
  (e: 'expanded-change', val: Array<string>): void;
}>();

const menuTree = new MenuTree(NaN, null);

const { size, accordion, modelValue, defaultValue, expanded, defaultExpanded } = toRefs(props);

// value值
const realValue = ref(modelValue?.value ?? defaultValue.value);
watch(
  () => modelValue?.value,
  (val) => {
    if (!isUndefined(val)) {
      realValue.value = val;
    }
  }
);

const updateModelValue = (val: string) => {
  realValue.value = val;
  emits('update:modelValue', val);
  emits('change', val);
};

// 选中节点列表
const activeNodes = ref<Array<string | undefined>>([]);
watch(
  () => realValue.value,
  (val) => {
    activeNodes.value = menuTree.selectNode(val);
  }
);

onMounted(() => {
  activeNodes.value = menuTree.selectNode(realValue.value);
});

// 展开节点列表
const realExpanded = ref(isArray(expanded?.value) ? expanded?.value : defaultExpanded.value);
watch(
  () => expanded?.value,
  (val) => {
    if (isArray(val)) {
      realExpanded.value = val;
    }
  }
);

const updateExpanded = (val: Array<string>) => {
  realExpanded.value = val;
  emits('update:expanded', val);
  emits('expanded-change', val);
};

provide(menuInjectKey, {
  size,
  accordion,
  realValue,
  activeNodes,
  realExpanded,
  menuTree,
  updateModelValue,
  updateExpanded,
  arrowPosition: toRef(props, 'arrowPosition')
});
</script>

<template>
  <ul :class="[
    'o-menu',
    `o-menu-${size}`,
    arrowPosition && `o-menu-arrow-${arrowPosition}`
    ]"
  >
    <slot></slot>
  </ul>
</template>
