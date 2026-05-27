<script setup lang="ts">
import { ref, inject, computed, watchEffect } from 'vue';
import { OCheckbox } from '../checkbox';
import { ORadio } from '../radio';
import { OPopover } from '../popover';
import { IconChevronRight, IconLoading } from '../_utils/icons';
import { isOverflown } from '../_utils/dom';
import { cascaderV2InjectKey } from './provide';

interface CascaderV2Label {
  multiple?: boolean;
  allowSelectAnyNode?: boolean;
  disabled?: boolean;
  value: string | number;
  label: string | undefined;
  labelParts?: Array<{ text: string; isHighlighted: boolean }>;
  indeterminate?: boolean;
  isLeaf?: boolean;
  isFullySelected?: boolean;
  loading?: boolean;
}

const cascaderV2Inject = inject(cascaderV2InjectKey, null);
const props = defineProps<CascaderV2Label>();
const emit = defineEmits<{
  (e: 'select'): void;
}>();

const optionLabelRef = ref<HTMLElement>();
const showPopover = ref(false);

const checkedList = computed(() => cascaderV2Inject?.selectValue.value ?? []);

// 单选当前值（ORadio model-value）
const singleValue = computed(() => checkedList.value[0]);

// watchEffect 直接访问响应式数组，确保 push/splice 等变更能触发更新（computed 惰性求值不追踪数组内容变更）
const checkboxChecked = ref(false);
watchEffect(() => {
  const list = cascaderV2Inject?.selectValue.value;
  checkboxChecked.value = list ? (list as Array<string | number>).includes(props.value as string | number) : false;
});

// 多选 checkbox model-value
const checkboxModelValue = computed(() => {
  if (props.isFullySelected !== undefined) {
    return props.isFullySelected ? [props.value] : [];
  }
  return checkboxChecked.value ? [props.value] : [];
});

const labelParts = computed(() => {
  if (props.labelParts && props.labelParts.length > 0) {
    return props.labelParts;
  }
  return [{ text: props.label, isHighlighted: false }];
});

const onMouseenter = (e: Event) => {
  showPopover.value = isOverflown(e.target as HTMLElement);
};

const onMouseleave = () => {
  showPopover.value = false;
};

// selector 区域点击：allowSelectAnyNode 时阻止冒泡并通知父级选中；否则让事件继续冒泡
const onSelectorClick = (e: Event) => {
  if (props.disabled) {
    return;
  }
  // 多选时：叶子节点或非叶子节点均通过 onLabelSelect 统一处理
  // allowSelectAnyNode: true 时：ORadio 也需要走 onLabelSelect
  if (props.multiple || props.allowSelectAnyNode) {
    e.stopPropagation();
    e.preventDefault();
    emit('select');
  }
};
</script>

<template>
  <!-- 单选 + allowSelectAnyNode：使用 ORadio -->
  <span v-if="!props.multiple && props.allowSelectAnyNode" class="o-cascader-v2-option-selector" @click="onSelectorClick">
    <ORadio :model-value="singleValue" :value="props.value" :disabled="props.disabled" />
  </span>

  <!-- 多选：使用 OCheckbox（allowSelectAnyNode 时阻止冒泡，否则让事件冒泡至 li） -->
  <span v-else-if="props.multiple" class="o-cascader-v2-option-selector" @click="onSelectorClick">
    <OCheckbox
      :model-value="checkboxModelValue"
      :value="props.value"
      :indeterminate="props.isFullySelected ? false : props.indeterminate"
      :disabled="props.disabled"
    />
  </span>

  <!-- 选项文本 -->
  <span ref="optionLabelRef" class="o-cascader-v2-option-label" @mouseenter="onMouseenter" @mouseleave="onMouseleave">
    <span v-for="(part, index) in labelParts" :key="index" :class="{ 'o-cascader-v2-option-highlight': part.isHighlighted }">{{ part.text }}</span>
  </span>

  <!-- 非叶子节点展开箭头（懒加载时显示 loading 图标） -->
  <span v-if="!props.isLeaf" class="o-cascader-v2-option-arrow">
    <IconLoading v-if="props.loading" class="o-rotating" />
    <IconChevronRight v-else />
  </span>

  <OPopover v-model:visible="showPopover" trigger="none" :target="optionLabelRef" wrap-class="o-cascader-v2-option-popover" position="top">
    <div class="o-cascader-v2-option-whole-label">
      <span v-for="(part, index) in labelParts" :key="index" :class="{ 'o-cascader-v2-option-popover-highlight': part.isHighlighted }">{{ part.text }}</span>
    </div>
  </OPopover>
</template>
