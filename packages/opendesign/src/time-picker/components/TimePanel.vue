<script setup lang="ts">
import { computed, inject, nextTick, ref } from 'vue';
import { until } from '@vueuse/core';

import { ODialog } from '../../dialog';
import { OPopup } from '../../popup';
import ClientOnly from '../../_components/client-only.ts';
import { OButton } from '../../button';
import { ODivider } from '../../divider';
import { useI18n } from '../../locale';
import { useScreen } from '../../hooks';

import TimeColumns from './TimeColumns.vue';
import { timePickerInjectKey } from '../provide.ts';

const props = defineProps<{
  target?: HTMLElement;
  optionTitle?: string;
}>();
const emits = defineEmits<{
  (e: 'cancel'): void;
  (e: 'change', newVal: string | undefined): void;
  (e: 'confirm', value: string | undefined): void;
}>();

const visible = ref(false);
const setVisible = (newVal: boolean) => {
  visible.value = newVal;
  if (!newVal) {
    emits('cancel');
  }
};

const timePickerCtx = inject(timePickerInjectKey)!;
const { size, transition, popupPosition, popupWrapper, noResponsive, isRange } = timePickerCtx;

const { t } = useI18n();
const { isPhonePad } = useScreen();

const isResponding = computed(() => {
  return !noResponsive.value && isPhonePad.value;
});

const popupRef = ref<HTMLDivElement>();
const timeColumnsRef = ref<InstanceType<typeof TimeColumns>>();

const getValue = () => timeColumnsRef.value?.getValue();
const setValue = (value: string | undefined, smooth = false) => {
  timeColumnsRef.value?.setValue(value);
  timeColumnsRef.value?.scrollAllToSelected(smooth);
};
const open = async (newVal: string | undefined) => {
  visible.value = true;
  await until(timeColumnsRef).toBeTruthy();
  await nextTick();
  setValue(newVal);
};
const close = () => {
  visible.value = false;
};

const handleCancel = () => {
  emits('cancel');
  close();
};
const handleConfirm = () => {
  emits('confirm', timeColumnsRef.value?.getValue());
  close();
};
const handleChange = () => {
  emits('change', timeColumnsRef.value?.getValue());
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
    <ODialog
      v-if="isResponding"
      :visible="visible"
      class="o-select-dlg"
      :main-class="['o-time-panel', `o-time-panel-${size}`, { 'o-time-panel-touch': isResponding }]"
      hide-close
      size="small"
      @update:visible="setVisible"
    >
      <template #header>
        <div class="o-select-options-head">{{ props.optionTitle ?? t('timePicker.selectTime') }}</div>
      </template>
      <template #actions>
        <OButton class="o-dlg-btn" variant="text" size="large" @click="handleCancel">
          {{ t('select.cancel') }}
        </OButton>
        <OButton class="o-dlg-btn" variant="text" size="large" @click="handleConfirm">
          {{ t('select.confirm') }}
        </OButton>
      </template>
      <div class="o-time-panel-content">
        <TimeColumns ref="timeColumnsRef" @change="handleChange" />
      </div>
    </ODialog>
    <OPopup
      v-else
      v-model:visible="visible"
      :class="['o-time-panel', `o-time-panel-${size}`]"
      hide-close
      :target="props.target"
      :transition="transition"
      :position="popupPosition"
      :wrapper="popupWrapper"
      trigger="none"
      :offset="isRange ? 8 : 4"
      :adjust-min-width="false"
      :adjust-width="false"
    >
      <div ref="popupRef">
        <div class="o-time-panel-content">
          <TimeColumns ref="timeColumnsRef" @change="handleChange" />
        </div>
        <ODivider class="o-time-panel-divider" />
        <div class="o-time-panel-footer">
          <span class="o-time-panel-shortcut">
            <slot name="shortcut" :set-value="setValue" :emit-change="handleChange" />
          </span>
          <OButton round="pill" @click="handleConfirm">{{ t('select.confirm') }}</OButton>
        </div>
      </div>
    </OPopup>
  </ClientOnly>
</template>
