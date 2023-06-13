<script setup lang="ts">
import { provide, ref, watch } from 'vue';

import { OPopup } from '../popup';
import { dropdownProps } from './types';
import { dropdownInjectKey } from './provide';
import { isUndefined } from '../_shared/is';

const props = defineProps(dropdownProps);

const emits = defineEmits<{
  (e: 'update:visible', val: boolean): void;
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
  }
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
      :target="dropdownRef"
      :trigger="props.trigger"
      :offset="4"
      :adjust-min-width="props.optionWidthMode === 'min-width'"
      :adjust-width="props.optionWidthMode === 'width'"
    >
      <ul class="o-dropdown-list" :class="[props.optionWrapClass]">
        <slot name="dropdown"></slot>
      </ul>
    </OPopup>
  </div>
</template>
