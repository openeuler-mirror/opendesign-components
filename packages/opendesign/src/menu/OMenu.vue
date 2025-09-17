<script setup lang="ts">
import { onMounted, provide, ref, shallowRef, toRefs, watch } from 'vue';
import { menuInjectKey, type ShowTooltipContent, type ShowTooltipOptions } from './provide';
import { menuProps } from './types';
import MenuTree from './menu';
import { isArray, isUndefined } from '../_utils/is';
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
      <component v-else :is="tooltipContent" />
    </OPopover>
  </ul>
</template>
