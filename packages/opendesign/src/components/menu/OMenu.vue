<script setup lang="ts">
import { onMounted, provide, ref, toRefs, watch } from 'vue';
import { menuInjectKey } from './provide';
import { menuProps } from './types';
import MenuTree from './menu';
import { isUndefined } from '../_shared/is';

const props = defineProps(menuProps);

const emits = defineEmits<{
  (e: 'update:modelValue', val: string): void;
  (e: 'change', val: string): void;
  (e: 'update:expanded', val: Array<string>): void;
  (e: 'expanded-change', val: Array<string>): void;
}>();

const menuTree = new MenuTree(NaN, null);

const { accordion, levelIndent, modelValue, defaultValue, expanded, defaultExpanded } = toRefs(props);

// value值
const realValue = ref(modelValue?.value ?? defaultValue.value);
watch(
  () => modelValue?.value,
  (val) => {
    realValue.value = isUndefined(val) ? '' : val;
  }
);

const updateModelValue = (val: string) => {
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
const realExpanded = ref(expanded?.value ?? defaultExpanded.value);
watch(
  () => expanded?.value,
  (val) => {
    realExpanded.value = isUndefined(val) ? [] : val;
  }
);

const updateExpanded = (val: Array<string>) => {
  emits('update:expanded', val);
  emits('expanded-change', val);
};

// 节点嵌套深度
const depth = 0;

provide(menuInjectKey, {
  accordion,
  levelIndent,
  realValue,
  activeNodes,
  realExpanded,
  menuTree,
  depth,
  updateModelValue,
  updateExpanded,
});
</script>

<template>
  <ul class="o-menu">
    <slot></slot>
  </ul>
</template>
