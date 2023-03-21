<script lang="ts" setup>
import { inject, ref, watch } from 'vue';

import { IconChevronRight } from '../_shared/icons';
import { OSelect } from '../select';
import { selectOptionInjectKey } from '../select/provide';

import { cascaderProps } from './types';
import type { CascaderValueT, CascaderNodePathT } from './types';
import CascaderTree from './cascader';
import { isArray, isUndefined } from '../_shared/is';

interface ColumnInfoT {
  value: string | number;
  label?: string;
  depth: number;
  isLeaf: boolean;
  isActive: boolean;
}

const props = defineProps(cascaderProps);

const selectInject = inject(selectOptionInjectKey, null);

const emits = defineEmits<{
  (e: 'change', val: CascaderValueT): void;
}>();

const _value = ref(props.modelValue);
const inputLabel = ref();

const cascaderTree = new CascaderTree();
const panelInfo = ref<Array<Array<ColumnInfoT>>>();

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

watch(
  () => props.options,
  (val) => {
    if (!isUndefined(val)) {
      cascaderTree.updateTree(val);
      panelInfo.value = cascaderTree.getPanelInfo(_value.value);
      inputLabel.value = getSelectedInfo().label;
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

const onClick = (option: ColumnInfoT, columnInfo: Array<ColumnInfoT>) => {
  if (!isArray(panelInfo.value)) {
    return;
  }

  while (option.depth < panelInfo.value.length) {
    panelInfo.value?.pop();
  }

  columnInfo.forEach((item) => {
    item.isActive = item.value === option.value;
  });

  if (!option.isLeaf) {
    const node = cascaderTree.getNode(cascaderTree.root, option.value);
    if (node) {
      panelInfo.value.push(cascaderTree.getNextColumnInfo(node));
    }
  } else {
    const { label, path } = getSelectedInfo();
    inputLabel.value = label;

    _value.value = path;
    if (props.pathMode) {
      emits('change', path);
    } else {
      emits('change', path[path.length - 1]);
    }
  }
};
</script>

<template>
  <OSelect
    :model-value="inputLabel"
    :round="props.round"
    :variant="props.variant"
    :placeholder="props.placeholder"
    :triggre="props.trigger"
    :option-position="props.optionPosition"
    :option-width-mode="props.optionWidthMode"
    :unmount-on-hide="props.unmountOnHide"
    :transition="props.transition"
  >
    <div class="o-cascader-panel">
      <ul v-for="(columnInfo, index) in panelInfo" :key="columnInfo[0].depth" class="o-cascader-options" :style="{ zIndex: 100 - index }">
        <li
          v-for="option in columnInfo"
          :key="option.value"
          class="o-cascader-option"
          :class="{ 'o-cascader-option-active': option.isActive }"
          @click="onClick(option, columnInfo)"
        >
          <span class="o-cascader-option-label">{{ option.label }}</span>
          <span v-if="!option.isLeaf" class="o-cascader-option-arrow"> <IconChevronRight /></span>
        </li>
      </ul>
    </div>
  </OSelect>
</template>
