<script setup lang="ts">
import { provide, ref, watch } from 'vue';

import { OPopup } from '../popup';
import { dropdownProps } from './types';
import { dropdownInjectKey } from './provide';
import { isUndefined } from '../_utils/is';
import { mergeClass } from '../_utils/vue-utils';

const props = defineProps(dropdownProps);

const emits = defineEmits<{
  /**
   * @zh-CN 下拉菜单显示状态更新时触发
   * @en-US Triggered when the dropdown visibility is updated
   */
  (e: 'update:visible', val: boolean): void;
  /**
   * @zh-CN 下拉菜单显示状态变化时触发
   * @en-US Triggered when the dropdown visibility changes
   */
  (e: 'visible-change', val: boolean): void;
}>();

const dropdownRef = ref<HTMLElement>();

const isVisible = ref(props.visible ?? props.defaultVisible);

watch(
  () => props.visible,
  (val) => {
    if (!isUndefined(val)) {
      isVisible.value = val;
    }
  },
);

const updateVisible = (val: boolean) => {
  isVisible.value = val;
  emits('update:visible', val);
  emits('visible-change', val);
};

watch(isVisible, (val) => {
  updateVisible(val);
});


provide(dropdownInjectKey, { updateVisible });
</script>

<template>
  <div ref="dropdownRef" class="o-dropdown">
    <slot></slot>
    <OPopup
      v-model:visible="isVisible"
      :transition="props.transition"
      :unmount-on-hide="props.unmountOnHide"
      :position="props.optionPosition"
      :wrapper="props.optionsWrapper"
      :target="dropdownRef"
      :trigger="props.trigger"
      :offset="4"
      :adjust-min-width="props.optionWidthMode === 'min-width'"
      :adjust-width="props.optionWidthMode === 'width'"
    >
      <ul class="o-dropdown-list" :class="mergeClass(`o-dropdown-list-${props.size}`, props.optionWrapClass)">
        <slot name="dropdown"></slot>
      </ul>
    </OPopup>
  </div>
</template>
