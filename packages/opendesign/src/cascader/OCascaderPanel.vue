<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import { selectOptionInjectKey } from '../select/provide';
import { IconChevronRight } from '../_utils/icons';
import CascaderTree from './cascader';
import type { ColumnInfoT } from './cascader';
import { isArray, isUndefined, isTouchDevice } from '../_utils/is';
import type { CascaderValueT, CascaderNodePathT } from './types';

import { cascaderPanelProps } from './types';

const selectInject = inject(selectOptionInjectKey, null);

const props = defineProps(cascaderPanelProps);

const emits = defineEmits<{
  (e: 'change', val: CascaderValueT): void;
  (e: 'update:modelValue', val: CascaderValueT): void;
}>();

const _value = ref(props.modelValue);
const inputLabel = ref<string>('');

const cascaderTree = new CascaderTree();
const panelInfo = ref<Array<Array<ColumnInfoT>>>();
const innerExpandTrigger = computed(() => {
  if (isTouchDevice) {
    return 'click';
  }
  if (props.expandTrigger === 'hover' || props.expandTrigger === 'click') {
    return props.expandTrigger;
  }
  return 'click';
});

const getSelectedInfo = () => {
  let rlt: {
    label: string;
    path: CascaderNodePathT;
  } = {
    label: '',
    path: [],
  };

  panelInfo.value?.forEach((columnInfo, index) => [
    columnInfo.forEach((option) => {
      if (option.isActive) {
        rlt.label += `${index === 0 ? '' : '/'}${String(option.label)}`;
        rlt.path.push(option.value);
      }
    }),
  ]);

  return rlt;
};
const updateOSelectValue = (option: { label: string; value: string | number }) => {
  if (selectInject) {
    selectInject.registerOption(option);
    selectInject.select(option);
  }
};

watch(
  () => props.options,
  (val) => {
    if (!isUndefined(val)) {
      cascaderTree.updateTree(val);
      panelInfo.value = cascaderTree.getPanelInfo(_value.value);
      const { label, path } = getSelectedInfo();
      inputLabel.value = label;
      updateOSelectValue({ label, value: path[path.length - 1] });
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

const selectOption = (option: ColumnInfoT, columnInfo: Array<ColumnInfoT>) => {
  while (option.depth < panelInfo.value!.length) {
    panelInfo.value?.pop();
  }
  columnInfo.forEach((item) => {
    item.isActive = item.value === option.value;
  });
  const { label, path } = getSelectedInfo();
  _value.value = path;
  inputLabel.value = label;

  if (props.pathMode) {
    emits('change', path);
    emits('update:modelValue', path);
  } else {
    emits('change', path[path.length - 1]);
    emits('update:modelValue', path[path.length - 1]);
  }
  updateOSelectValue({ label, value: path[path.length - 1] });
};
const expandOption = (option: ColumnInfoT, columnInfo: Array<ColumnInfoT>) => {
  while (option.depth < panelInfo.value!.length) {
    panelInfo.value?.pop();
  }
  columnInfo.forEach((item) => {
    item.isActive = item.value === option.value;
  });
  const node = cascaderTree.getNode(option.value);
  if (node) {
    panelInfo.value!.push(cascaderTree.getColumnInfo(node));
  }
};
const onClick = (option: ColumnInfoT, columnInfo: Array<ColumnInfoT>) => {
  if (!isArray(panelInfo.value)) {
    return;
  }
  if (option.isLeaf) {
    // 选择
    selectOption(option, columnInfo);
  } else {
    // 展开
    if (option.isActive || innerExpandTrigger.value !== 'click') {
      return;
    }
    expandOption(option, columnInfo);
  }
};
const onMouseenter = (option: ColumnInfoT, columnInfo: Array<ColumnInfoT>) => {
  if (!isArray(panelInfo.value) || option.isLeaf || option.isActive || innerExpandTrigger.value !== 'hover') {
    return;
  }
  expandOption(option, columnInfo);
};

// 同步外部改变
watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue) return;
    panelInfo.value = cascaderTree.getPanelInfo(newValue);
    const { path, label } = getSelectedInfo();
    inputLabel.value = label;
    _value.value = path;
    updateOSelectValue({ label, value: path[path.length - 1] });
  }
);
</script>

<template>
  <div class="o-cascader-panel">
    <ul v-for="(columnInfo, index) in panelInfo" :key="index" class="o-cascader-options">
      <li
        v-for="option in columnInfo"
        :key="option.value"
        class="o-cascader-option"
        :class="{ 'o-cascader-option-selected': option.isActive }"
        @click="onClick(option, columnInfo)"
        @mouseenter="onMouseenter(option, columnInfo)"
      >
        <span class="o-cascader-option-label">{{ option.label }}</span>
        <span v-if="!option.isLeaf" class="o-cascader-option-arrow"> <IconChevronRight /></span>
      </li>
    </ul>
  </div>
</template>
