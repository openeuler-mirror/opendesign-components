<script setup lang="ts">
import { computed, nextTick, provide, ref, toRefs, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';
import dayjs from 'dayjs';

import { InBox } from '../_components/in-box';
import { InInput } from '../_components/in-input';
import { isEmptySlot } from '../_utils/vue-utils';
import { useFormField } from '../_composables/use-form-field';
import { useScreen } from '../hooks';
import { useI18n } from '../locale';
import { IconTime } from '../_utils/icons.ts';
import { useClickOutside } from '../date-picker/composables/use-click-outside.ts';

import { timePickerProps, type TimePickerShortcutSlotProps } from './types';
import { timePickerInjectKey } from './provide';
import { useTimePickerOptions } from './use-time-picker-options.ts';
import { findNearestTime } from './find-nearest-time.ts';
import { isValidTimeUnit } from './use-time-range-input-validation.ts';
import TimePanel from './components/TimePanel.vue';

const props = defineProps(timePickerProps);
const emits = defineEmits<{
  /**
   * @zh-CN 值变化时触发
   * @en-US Emitted when the value changes
   */
  (e: 'change', newVal: string | undefined, oldVal: string | undefined): void;
  /**
   * @zh-CN 失去焦点时触发
   * @en-US Emitted when losing focus
   */
  (e: 'blur'): void;
  /**
   * @zh-CN 获得焦点时触发
   * @en-US Emitted when gaining focus
   */
  (e: 'focus', evt: FocusEvent): void;
  /**
   * @zh-CN 清除时触发
   * @en-US Emitted when clearing
   */
  (e: 'clear', evt?: Event): void;
  /**
   * @zh-CN 按下回车键时触发
   * @en-US Emitted when pressing Enter key
   */
  (e: 'pressEnter'): void;
}>();

defineSlots<{
  /**
   * @zh-CN 前置内容
   * @en-US Prepend content
   */
  prepend(): any;
  /**
   * @zh-CN 后置内容
   * @en-US Append content
   */
  append(): any;
  /**
   * @zh-CN 快捷选项
   * @en-US Shortcut options
   * @param props.setValue 设置值的函数
   * @param props.emitChange 触发变更事件的函数
   */
  shortcut(props: TimePickerShortcutSlotProps): any;
}>();

/**
 * @zh-CN 时间选择器的值
 * @en-US The value of the time picker
 */
const modelValue = defineModel<string | undefined>('modelValue', { default: undefined });

const {
  effectiveColor: color,
  inputId,
  isFocus,
  onFocus: formOnFocus,
  onBlur: formOnBlur,
  onClear: formOnClear,
  onPressEnter: formOnPressEnter,
  notifyChange,
} = useFormField(props, emits);

const propsRefs = toRefs(props);
const { format, hourStep, minuteStep, secondStep, disabled, readonly, noResponsive } = propsRefs;

const { t } = useI18n();
const { isPhonePad } = useScreen();
const isResponding = computed(() => !noResponsive?.value && isPhonePad.value);

const inBoxRef = ref<InstanceType<typeof InBox>>();
const inInputRef = ref<InstanceType<typeof InInput>>();
const panelRef = ref<InstanceType<typeof TimePanel>>();

const tempInputValue = ref<string | undefined>();

const tempParsed = computed(() => {
  const [hour, minute, second] = tempInputValue.value?.split(':').map((v) => Number.parseInt(v)) ?? [];
  return { hour, minute, second };
});

const tempSelectedHour = computed(() => (Number.isNaN(tempParsed.value.hour) ? null : tempParsed.value.hour));
const tempSelectedMinute = computed(() => (Number.isNaN(tempParsed.value.minute) ? null : tempParsed.value.minute));

const { hourOptions, minuteOptions, secondOptions, disabledHourOptions, disabledMinuteOptions, disabledSecondOptions } = useTimePickerOptions({
  hourStep,
  minuteStep,
  secondStep,
  disabledHours: propsRefs.disabledHours,
  disabledMinutes: propsRefs.disabledMinutes,
  disabledSeconds: propsRefs.disabledSeconds,
  minTime: propsRefs.minTime,
  maxTime: propsRefs.maxTime,
  selectedHour: tempSelectedHour,
  selectedMinute: tempSelectedMinute,
});

// 向下传递预计算的共享选项，TimeColumns 可直接 inject 而无需重复计算
provide(timePickerInjectKey, {
  ...propsRefs,
  computedOptions: { hourOptions, minuteOptions, secondOptions, disabledHourOptions },
});

const isTempInputValueValid = computed(() => {
  const { hour, minute, second } = tempParsed.value;
  if (!isValidTimeUnit(hour, hourOptions.value, disabledHourOptions.value)) return false;
  if (!isValidTimeUnit(minute, minuteOptions.value, disabledMinuteOptions.value)) return false;
  if (!isValidTimeUnit(second, secondOptions.value, disabledSecondOptions.value)) return false;
  return true;
});

watch(
  modelValue,
  (newValue) => {
    tempInputValue.value = newValue ?? '';
  },
  { immediate: true },
);

watch(isFocus, (newVal, oldVal) => {
  if (!newVal && oldVal) {
    tempInputValue.value = modelValue.value ?? '';
    if (!isResponding.value) {
      panelRef.value?.close();
    }
  }
});

useClickOutside({
  targets: [() => inBoxRef.value?.$el, () => panelRef.value?.getPopupEl()],
  onOutside: () => {
    formOnBlur();
  },
  disabled: isResponding,
});

const getNearestAvailableTime = (): string | undefined => {
  const now = dayjs();
  return findNearestTime({
    hourOptions: hourOptions.value,
    minuteOptions: minuteOptions.value,
    secondOptions: secondOptions.value,
    minTime: props.minTime,
    maxTime: props.maxTime,
    disabledHours: props.disabledHours,
    disabledMinutes: props.disabledMinutes,
    disabledSeconds: props.disabledSeconds,
    target: { hour: now.hour(), minute: now.minute(), second: now.second() },
    format: format.value,
  });
};

let skipOpenPanel = false;

const onFocus = (e: FocusEvent) => {
  if (readonly.value) return;
  if (!skipOpenPanel) {
    let valueToOpen = tempInputValue.value;
    if (!valueToOpen) {
      const nearest = getNearestAvailableTime();
      if (nearest) {
        tempInputValue.value = nearest;
        valueToOpen = nearest;
      }
    }
    panelRef.value?.open(valueToOpen);
  }
  skipOpenPanel = false;
  if (isFocus.value) return;
  formOnFocus(e);
};

let prevValue = modelValue.value;
let internalChangePending = false;

watch(modelValue, (_, old) => {
  if (internalChangePending) {
    internalChangePending = false;
  } else {
    prevValue = old;
  }
});

const handleChange = () => {
  internalChangePending = true;
  modelValue.value = isTempInputValueValid.value ? tempInputValue.value : panelRef.value?.getValue();
  emits('change', modelValue.value, prevValue);
  prevValue = modelValue.value;
  notifyChange();
};

const handleInput = useDebounceFn(async () => {
  await nextTick();
  if (isTempInputValueValid.value) {
    panelRef.value?.setValue(tempInputValue.value);
  }
});

const blurAndClose = () => {
  inInputRef.value?.blur();
  panelRef.value?.close();
  formOnBlur();
};

const cancelEdit = () => {
  tempInputValue.value = modelValue.value ?? '';
  blurAndClose();
};

const handlePanelChange = (newVal: string | undefined) => {
  tempInputValue.value = newVal;
};

const onPressEnter = () => {
  if (!isTempInputValueValid.value) {
    cancelEdit();
    return;
  }
  handleChange();
  blurAndClose();
  formOnPressEnter();
};

const handleConfirm = () => {
  handleChange();
  formOnBlur();
  formOnPressEnter();
};

const handleCancel = () => {
  cancelEdit();
};

const onClear = (e?: Event) => {
  e?.stopPropagation();
  const oldVal = prevValue;
  internalChangePending = true;
  modelValue.value = undefined;
  tempInputValue.value = '';
  prevValue = undefined;
  emits('change', undefined, oldVal);
  formOnClear(e);
  notifyChange();
  blurAndClose();
};

defineExpose({
  /**
   * @zh-CN 使输入框获取焦点，open 为 false 时仅聚焦不打开面板
   * @en-US Focus the input. Pass false to focus without opening the panel.
   */
  focus: (open = true) => {
    if (!open) skipOpenPanel = true;
    inInputRef.value?.focus();
  },
  /**
   * @zh-CN 使输入框失去焦点，校验合法则应用当前值，否则回滚
   * @en-US Blur the input. Applies the current value if valid, otherwise rolls back.
   */
  blur: () => {
    if (isTempInputValueValid.value) {
      handleChange();
      blurAndClose();
    } else {
      cancelEdit();
    }
  },
  /**
   * @zh-CN 清除输入值
   * @en-US Clear the input value
   */
  clear: () => inInputRef.value?.clear(),
  /**
   * @zh-CN 获取输入框 DOM 元素
   * @en-US Get the input DOM element
   */
  inputEl: () => inInputRef.value?.inputEl,
});
</script>

<template>
  <InBox
    ref="inBoxRef"
    v-bind="{
      size: props.size,
      variant: props.variant,
      color: color,
      disabled: props.disabled,
      readonly: props.readonly,
      round: props.round,
      focused: isFocus,
    }"
    :class="['o-time-picker', 'o-input']"
  >
    <template v-if="!isEmptySlot($slots.prepend)" #prepend><slot name="prepend" /></template>
    <InInput
      ref="inInputRef"
      v-model="tempInputValue"
      :class="['o-input-wrap', { 'o-input-wrap-focused': isFocus, 'o-input-wrap-touch': isResponding }]"
      :disabled="disabled"
      :clearable="props.clearable && !!tempInputValue"
      :placeholder="props.placeholder ?? t('timePicker.placeholder')"
      :input-id="inputId"
      :max-length="format?.length ?? 8"
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
      <template v-if="!isResponding || !tempInputValue" #suffix>
        <IconTime />
      </template>
      <template #extra>
        <TimePanel
          v-if="!disabled && !readonly"
          ref="panelRef"
          :target="inBoxRef?.$el"
          :option-title="props.optionTitle"
          @change="handlePanelChange"
          @cancel="handleCancel"
          @confirm="handleConfirm"
        >
          <template #shortcut="{ setValue: panelSetValue, emitChange }">
            <slot name="shortcut" :set-value="panelSetValue" :emit-change="emitChange" />
          </template>
        </TimePanel>
      </template>
    </InInput>
    <template v-if="!isEmptySlot($slots.append)" #append><slot name="append" /></template>
  </InBox>
</template>
