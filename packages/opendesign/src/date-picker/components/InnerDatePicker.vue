<script setup lang="ts">
import { computed, inject, ref, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import dayjs from 'dayjs';

import { InInput } from '../../_components/in-input';
import { useScreen } from '../../hooks';
import { useI18n } from '../../locale';
import { IconCalendar } from '../../_utils/icons.ts';
import { isEmptySlot } from '../../_utils/vue-utils.ts';

import { datePickerInjectKey } from '../provide.ts';
import { parseValue } from '../utils.ts';
import DatePanel from './DatePanel.vue';
import { useClickOutside } from '../composables/use-click-outside.ts';

const props = withDefaults(
  defineProps<{
    placeholder?: string;
    optionTitle?: string;
    inBoxRef?: HTMLElement;
    inputId?: string;
    hasIcon?: boolean;
  }>(),
  {
    placeholder: undefined,
    optionTitle: undefined,
    inBoxRef: undefined,
    inputId: undefined,
    hasIcon: false,
  },
);
const emits = defineEmits<{
  (e: 'change', newVal: number | undefined, oldVal: number | undefined): void;
  (e: 'blur'): void;
  (e: 'focus', evt: FocusEvent): void;
  (e: 'clear', evt?: Event): void;
  (e: 'pressEnter'): void;
}>();

const modelValue = defineModel<number | undefined>('modelValue', { default: undefined, required: true });

const datePickerCtx = inject(datePickerInjectKey)!;
const { clearable, disabled, readonly, noResponsive, mode: effectiveMode, minDate, maxDate } = datePickerCtx;

const effectiveFormat = computed(() => datePickerCtx.format?.value);

const parsedMinDate = computed(() => {
  return minDate?.value ? parseValue(minDate.value) : null;
});
const parsedMaxDate = computed(() => {
  return maxDate?.value ? parseValue(maxDate.value) : null;
});

const { t } = useI18n();
const { isPhonePad } = useScreen();
const isResponding = computed(() => !noResponsive?.value && isPhonePad.value);

const inInputRef = ref<InstanceType<typeof InInput>>();
const panelRef = ref<InstanceType<typeof DatePanel>>();

const effectivePlaceholder = computed(() => {
  if (props.placeholder !== undefined) return props.placeholder;
  if (effectiveMode.value === 'year') return t('datePicker.yearPlaceholder');
  if (effectiveMode.value === 'month') return t('datePicker.monthPlaceholder');
  return t('datePicker.placeholder');
});

const tempInputValue = ref<string | undefined>();

const isTempInputValueValid = computed(() => {
  if (!tempInputValue.value) return true;
  const d = dayjs(tempInputValue.value);
  if (!d.isValid()) return false;
  if (parsedMinDate.value && d.isBefore(parsedMinDate.value)) return false;
  if (parsedMaxDate.value && d.isAfter(parsedMaxDate.value)) return false;
  if (datePickerCtx.disabledDate?.value?.({ date: d.toDate(), year: d.year(), month: d.month(), day: d.date() })) return false;
  return true;
});

watch(
  modelValue,
  (newValue) => {
    if (!newValue && newValue !== 0) {
      tempInputValue.value = '';
      return;
    }
    tempInputValue.value = dayjs(newValue).format(effectiveFormat.value);
  },
  {
    immediate: true,
  },
);

const isFocus = ref(false);
watch(isFocus, (newVal, oldVal) => {
  if (!newVal && oldVal) {
    tempInputValue.value = modelValue.value ? dayjs(modelValue.value).format(effectiveFormat.value) : '';
    if (!isResponding.value) {
      panelRef.value?.close();
    }
    emits('blur');
  }
});

useClickOutside({
  targets: [() => props.inBoxRef, () => panelRef.value?.getPopupEl()],
  onOutside: () => {
    isFocus.value = false;
  },
  disabled: isResponding,
});

let skipOpenPanel = false;

const onFocus = (e: FocusEvent) => {
  if (readonly?.value) {
    return;
  }
  if (!skipOpenPanel) {
    let valueToOpen = tempInputValue.value;
    if (!valueToOpen) {
      const today = dayjs().format(effectiveFormat.value);
      tempInputValue.value = today;
      valueToOpen = today;
    }
    // 用 dayjs 解析完整格式（含时间），确保时间部分正确同步
    panelRef.value?.open(dayjs(valueToOpen, effectiveFormat.value).valueOf());
  }
  skipOpenPanel = false;
  if (isFocus.value) {
    return;
  }

  isFocus.value = true;
  emits('focus', e);
};

let prevValue = modelValue.value;
const handleChange = () => {
  // datetime 模式下时间列由 panel 管理，始终从 panel 取完整值
  const newFormatted =
    effectiveMode.value === 'datetime'
      ? panelRef.value?.getValue()
      : isTempInputValueValid.value
        ? parseValue(tempInputValue.value)?.valueOf()
        : panelRef.value?.getValue();
  modelValue.value = newFormatted;
  emits('change', newFormatted, prevValue);
  prevValue = newFormatted;
};
const handleInput = useDebounceFn(async () => {
  if (isTempInputValueValid.value) {
    panelRef.value?.setValue(parseValue(tempInputValue.value)?.valueOf());
  }
});
const handlePanelChange = (newVal: number | undefined) => {
  tempInputValue.value = newVal ? dayjs(newVal).format(effectiveFormat.value) : '';
  handleChange();
  panelRef.value?.close();
  isFocus.value = false;
  inInputRef.value?.blur();
};
const handlePanelPreview = (newVal: number | undefined) => {
  tempInputValue.value = newVal ? dayjs(newVal).format(effectiveFormat.value) : '';
};
const onPressEnter = () => {
  if (!isTempInputValueValid.value) {
    return;
  }
  handleChange();
  panelRef.value?.close();
  isFocus.value = false;
  inInputRef.value?.blur();
  emits('pressEnter');
};
const handleConfirm = () => {
  // 从 panel 取完整值（含时间列）格式化后写回输入框
  const panelVal = panelRef.value?.getValue();
  if (panelVal) {
    tempInputValue.value = dayjs(panelVal).format(effectiveFormat.value);
  }
  handleChange();
  panelRef.value?.close();
  isFocus.value = false;
  inInputRef.value?.blur();
  emits('pressEnter');
};
const handleCancel = () => {
  isFocus.value = false;
  inInputRef.value?.blur();
  panelRef.value?.close();
};
const onClear = (e?: Event) => {
  e?.stopPropagation();
  const oldVal = prevValue;
  modelValue.value = undefined;
  tempInputValue.value = '';
  prevValue = undefined;
  emits('clear', e);
  emits('change', undefined, oldVal);
  panelRef.value?.close();
  isFocus.value = false;
  inInputRef.value?.blur();
};

const inputId = props.inputId;

defineExpose({
  focus: (open = true) => {
    if (!open) skipOpenPanel = true;
    inInputRef.value?.focus();
  },
  blur: () => {
    inInputRef.value?.blur();
    panelRef.value?.close();
    isFocus.value = false;
  },
  clear: () => inInputRef.value?.clear(),
  inputEl: () => inInputRef.value?.inputEl,
  getTempValue: () => (isTempInputValueValid.value ? tempInputValue.value : panelRef.value?.getValue()),
});
</script>

<template>
  <InInput
    ref="inInputRef"
    v-model="tempInputValue"
    :class="['o-input-wrap', { 'o-input-wrap-focused': isFocus, 'o-input-wrap-touch': isResponding }]"
    :disabled="disabled"
    :clearable="clearable && !!tempInputValue"
    :placeholder="effectivePlaceholder"
    :input-id="inputId"
    :max-length="effectiveFormat?.length"
    :input-on-outlimit="false"
    show-length="never"
    :readonly="readonly"
    no-keyboard
    @keydown.esc="handleCancel"
    @input="handleInput"
    @focus="onFocus"
    @clear="onClear"
    @press-enter="onPressEnter"
  >
    <template v-if="props.hasIcon && (!isResponding || !tempInputValue)" #suffix>
      <slot name="suffix"><IconCalendar /></slot>
    </template>
    <template #extra>
      <DatePanel
        v-if="!disabled && !readonly"
        ref="panelRef"
        :target="props.inBoxRef"
        :option-title="props.optionTitle"
        @change="handlePanelChange"
        @preview="handlePanelPreview"
        @cancel="handleCancel"
        @confirm="handleConfirm"
      >
        <template v-if="!isEmptySlot($slots.shortcut)" #shortcut="{ setValue, emitChange }">
          <slot name="shortcut" :set-value="setValue" :emit-change="emitChange" />
        </template>
      </DatePanel>
    </template>
  </InInput>
</template>
