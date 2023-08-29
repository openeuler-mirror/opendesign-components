<script setup lang="ts">
import { computed, inject, ref, watch, watchEffect } from 'vue';
import { selectOptionInjectKey } from '../select/provide';
import { IconChevronRight } from '../_utils/icons';
import CascaderTree from './cascader';
import type { ColumnInfoT } from './cascader';
import { isArray, isUndefined } from '../_utils/is';
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
const currentVal = computed(() => {
  return selectInject?.selectValue.value;
});

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
    _value.value = path;
    inputLabel.value = label;

    if (currentVal.value?.includes(path[path.length - 1])) {
      return;
    }

    if (props.pathMode) {
      emits('change', path);
      emits('update:modelValue', path);
    } else {
      emits('change', path[path.length - 1]);
      emits('update:modelValue', path[path.length - 1]);
    }

    selectInject?.select(
      {
        label: inputLabel.value,
        value: path[path.length - 1],
      },
      true
    );
  }
};

watchEffect(() => {
  selectInject?.select(
    {
      label: inputLabel.value,
      value: isArray(_value.value) ? _value.value[_value.value.length - 1] : _value.value,
    },
    false
  );
});
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
      >
        <span class="o-cascader-option-label">{{ option.label }}</span>
        <span v-if="!option.isLeaf" class="o-cascader-option-arrow"> <IconChevronRight /></span>
      </li>
    </ul>
  </div>
</template>
