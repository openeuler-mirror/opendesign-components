<script setup lang="ts">
import { computed, provide, ref, toRefs, toRef, watch, onMounted } from 'vue';
import { menuInjectKey } from './provide';
import { menuProps } from './types';
import MenuTree from './menu';
import { isArray } from '../_utils/is';

const props = defineProps(menuProps);

const emits = defineEmits<{
  /**
   * @zh-CN 菜单选中值更新时触发
   * @en-US Triggered when the menu selected value is updated
   */
  (e: 'update:modelValue', val: string): void;
  /**
   * @zh-CN 菜单选中值变化时触发
   * @en-US Triggered when the menu selected value changes
   */
  (e: 'change', val: string): void;
  /**
   * @zh-CN 菜单展开节点列表更新时触发
   * @en-US Triggered when the menu expanded nodes list is updated
   */
  (e: 'update:expanded', val: Array<string>): void;
  /**
   * @zh-CN 菜单展开节点列表变化时触发
   * @en-US Triggered when the menu expanded nodes list changes
   */
  (e: 'expanded-change', val: Array<string>): void;
}>();

const menuTree = new MenuTree(NaN, null);

const { size, accordion, modelValue, defaultValue, expanded, defaultExpanded } = toRefs(props);

// value值
const innerValue = ref(modelValue?.value ?? defaultValue.value);
const realValue = computed(() => modelValue?.value ?? innerValue.value);

const updateModelValue = (val: string) => {
  innerValue.value = val;
  emits('update:modelValue', val);
  emits('change', val);
};

// 展开节点列表
const innerExpanded = ref(isArray(expanded?.value) ? expanded?.value : defaultExpanded.value);
const realExpanded = computed(() => {
  if (isArray(expanded?.value)) {
    return expanded.value;
  }
  return innerExpanded.value;
});

// 选中节点列表
const activeNodes = ref<Array<string | undefined>>([]);
const notifyTreeChange = () => {
  activeNodes.value = menuTree.selectNode(realValue.value || '');
};
watch(realValue, notifyTreeChange, { flush: 'post' });
onMounted(() => notifyTreeChange());

const updateExpanded = (val: Array<string>) => {
  innerExpanded.value = val;
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
  notifyTreeChange,
  updateModelValue,
  updateExpanded,
  arrowPosition: toRef(props, 'arrowPosition'),
});
</script>

<template>
  <ul :class="['o-menu', `o-menu-${size}`, arrowPosition && `o-menu-arrow-${arrowPosition}`]">
    <slot></slot>
  </ul>
</template>
