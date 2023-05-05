<script lang="ts" setup>
import { ref, watch } from 'vue';

import { IconChevronRight } from '../_shared/icons';
import { OSelect } from '../select';

import { cascaderProps } from './types';
import type { CascaderValueT, CascaderNodePathT } from './types';
import CascaderTree from './cascader';
import type { ColumnInfoT } from './cascader';
import { isArray, isUndefined } from '../_shared/is';

const props = defineProps(cascaderProps);

const emits = defineEmits<{
  (e: 'change', val: CascaderValueT): void;
}>();

const selectRef = ref<InstanceType<typeof OSelect> | null>();

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

watch(
  () => inputLabel.value,
  (val) => {
    selectRef.value?.updateLabel(val);
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
    ref="selectRef"
    :model-value="inputLabel"
    :round="props.round"
    :variant="props.variant"
    :placeholder="props.placeholder"
    :triggre="props.trigger"
    :option-position="props.optionPosition"
    option-width-mode="auto"
    :unmount-on-hide="props.unmountOnHide"
    :transition="props.transition"
  >
    <div class="o-cascader-panel">
      <ul v-for="(columnInfo, index) in panelInfo" :key="index" class="o-cascader-options">
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
