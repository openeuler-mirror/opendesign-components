<script lang="ts" setup>
import { computed } from 'vue';
import { OSelect } from '../select';
import OCascaderPanel from './OCascaderPanel.vue';
import type { CascaderValueT } from './types';
import { cascaderProps } from './types';
import { isTouchDevice } from '../_utils/is';
import { mergeClass } from '../_utils/vue-utils';

const props = defineProps(cascaderProps);

const emits = defineEmits<{
  /**
   * @zh-CN 级联选择器值变化时触发
   * @en-US Triggered when the cascader value changes
   */
  (e: 'change', val: CascaderValueT): void;
  /**
   * @zh-CN 级联选择器选中值变化时触发
   * @en-US Triggered when the cascader selected value changes
   */
  (e: 'update:modelValue', val: CascaderValueT): void;
}>();

const handleChange = (val: CascaderValueT) => {
  emits('change', val);
  emits('update:modelValue', val);
};

const innerTrigger = computed(() => {
  if (!isTouchDevice) {
    return props.trigger;
  }
  if (props.trigger === 'hover') {
    return 'click';
  }
  if (props.trigger === 'hover-outclick') {
    return 'click-outclick';
  }
  return props.trigger;
});
</script>

<template>
  <OSelect
    :model-value="props.modelValue"
    :round="props.round"
    :variant="props.variant"
    :placeholder="props.placeholder"
    :trigger="innerTrigger"
    :option-position="props.optionPosition"
    option-width-mode="auto"
    :unmount-on-hide="props.unmountOnHide"
    :transition="props.transition"
    :option-wrap-class="mergeClass('o-cascader', props.optionWrapClass)"
    :size="props.size"
  >
    <OCascaderPanel
      :options="props.options"
      :model-value="props.modelValue"
      :path-mode="props.pathMode"
      :expand-trigger="props.expandTrigger"
      @change="handleChange"
    />
  </OSelect>
</template>
