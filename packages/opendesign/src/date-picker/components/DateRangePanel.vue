<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { until } from '@vueuse/core';

import { OPopup } from '../../popup';
import ClientOnly from '../../_components/client-only.ts';
import { ODivider } from '../../divider';
import { isEmptySlot } from '../../_utils/vue-utils.ts';

import { datePickerInjectKey } from '../provide.ts';
import { DatePickerMode } from '../types.ts';
import DateRangePanelContent from './DateRangePanelContent.vue';

const props = defineProps<{
  target?: HTMLElement;
  optionTitle?: string;
}>();

const emits = defineEmits<{
  (e: 'change', start: number | undefined, end: number | undefined): void;
}>();

const visible = ref(false);
// 内层子视图：镜像 DateRangePanelContent 当前的子视图（date/month/year 导航层级）
const currentView = ref<DatePickerMode>('date');

const datePickerCtx = inject(datePickerInjectKey)!;
const { size, mode: effectiveMode, transition, popupPosition, popupWrapper } = datePickerCtx;

const popupRef = ref<HTMLDivElement>();
const contentRef = ref<InstanceType<typeof DateRangePanelContent>>();

const isMainPanel = computed(() => {
  if (effectiveMode.value === 'year') return currentView.value === 'year';
  if (effectiveMode.value === 'month') return currentView.value === 'month';
  return currentView.value === 'date';
});

// --- getValue / setValue delegates ---
const getValue = () => contentRef.value?.getValue() ?? { start: undefined, end: undefined };

const setValue = (start: number | undefined, end: number | undefined) => {
  contentRef.value?.setValue(start, end);
};

const open = async (start: number | undefined, end: number | undefined) => {
  if (visible.value) return;
  visible.value = true;
  await until(contentRef).toBeTruthy();
  contentRef.value?.init(start, end);
};

const close = () => {
  visible.value = false;
};

// --- Event handlers ---
const handleContentChange = (start: number | undefined, end: number | undefined) => {
  emits('change', start, end);
};

defineExpose({
  getPopupEl: () => popupRef.value,
  getValue,
  setValue,
  open,
  close,
});
</script>

<template>
  <ClientOnly>
    <OPopup
      v-model:visible="visible"
      :class="['o-date-panel', `o-date-panel-${size}`, 'o-date-range-panel']"
      hide-close
      :target="props.target"
      :transition="transition"
      :position="popupPosition"
      :wrapper="popupWrapper"
      trigger="none"
      :offset="4"
      :adjust-min-width="false"
      :adjust-width="false"
    >
      <div ref="popupRef">
        <DateRangePanelContent ref="contentRef" v-model:current-view="currentView" @change="handleContentChange" />

        <template v-if="!isEmptySlot($slots.shortcut) && isMainPanel">
          <ODivider class="o-date-panel-divider" />
          <div class="o-date-panel-footer">
            <span class="o-date-panel-shortcut">
              <slot name="shortcut" :set-value="setValue" :emit-change="() => emits('change', getValue().start, getValue().end)" />
            </span>
          </div>
        </template>
      </div>
    </OPopup>
  </ClientOnly>
</template>
