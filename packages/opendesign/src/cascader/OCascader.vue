<script lang="ts" setup>
import { computed } from 'vue';
import { OSelect } from '../select';
import OCascaderPanel from './OCascaderPanel.vue';
import type { CascaderValueT } from './types';
import { cascaderProps } from './types';
import { isString, isUndefined } from '../_utils/is';

const props = defineProps(cascaderProps);

const emits = defineEmits<{
  (e: 'change', val: CascaderValueT): void;
  (e: 'update:modelValue', val: CascaderValueT): void;
}>();

const handleChange = (val: CascaderValueT) => {
  emits('change', val);
  emits('update:modelValue', val);
};

const wrapClass = computed(() => {
  const classStr = 'o-cascader';
  if (isUndefined(props.optionWrapClass)) {
    return classStr;
  } else if (isString(props.optionWrapClass)) {
    return `${classStr} ${props.optionWrapClass}`;
  } else {
    return [classStr, ...props.optionWrapClass].join(' ');
  }
});
</script>

<template>
  <OSelect
    :model-value="props.modelValue"
    :round="props.round"
    :variant="props.variant"
    :placeholder="props.placeholder"
    :triggre="props.trigger"
    :option-position="props.optionPosition"
    option-width-mode="auto"
    :unmount-on-hide="props.unmountOnHide"
    :transition="props.transition"
    :option-wrap-class="wrapClass"
  >
    <OCascaderPanel :options="props.options" :model-value="props.modelValue" :path-mode="props.pathMode" @change="handleChange" />
  </OSelect>
</template>
