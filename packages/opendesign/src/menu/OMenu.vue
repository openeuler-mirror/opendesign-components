<script setup lang="ts">
import { computed, provide, ref, shallowRef, toRefs } from 'vue';
import { menuInjectKey, type ShowTooltipContent, type ShowTooltipOptions } from './provide';
import { menuProps } from './types';
import MenuTree from './menu';
import { isArray } from '../_utils/is';
import { OPopover } from '../popover';
import '../popover/style';

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
const activeNodes = computed(() => menuTree.selectNode(realValue.value));

const updateExpanded = (val: Array<string>) => {
  innerExpanded.value = val;
  emits('update:expanded', val);
  emits('expanded-change', val);
};

const tooltipTarget = shallowRef<HTMLElement>();
const tooltipContent = shallowRef<ShowTooltipContent>('');
/**
 * 对溢出元素创建tooltip，避免逐个元素创建浪费性能
 */
const showTooltip = (options: ShowTooltipOptions) => {
  const { el, content } = options;
  tooltipTarget.value = el;
  tooltipContent.value = content || el.innerText;
};
const hideTooltip = () => {
  tooltipContent.value = '';
  tooltipTarget.value = undefined;
};

// 节点嵌套深度
const depth = 0;


provide(menuInjectKey, {
  size,
  accordion,
  realValue,
  activeNodes,
  realExpanded,
  menuTree,
  depth,
  updateModelValue,
  updateExpanded,
  showTooltip,
  hideTooltip
});
</script>

<template>
  <ul :class="['o-menu', `o-menu-${size}`]">
    <slot></slot>
    <OPopover v-if="tooltipTarget" visible :offset="16" :target="tooltipTarget" position="bottom">
      <template v-if="['string', 'number'].includes(typeof tooltipContent)">{{ tooltipContent }}</template>
      <component :is="tooltipContent" v-else />
    </OPopover>
  </ul>
</template>
