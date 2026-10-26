<!-- packages/opendesign/src/date-picker/OYearRangePicker.vue -->
<script setup lang="ts">
import { computed, ref, watch } from 'vue';

import { InBox } from '../_components/in-box';
import { InInput } from '../_components/in-input';
import { isEmptySlot } from '../_utils/vue-utils';
import { IconCalendar, IconClose } from '../_utils/icons';
import { useI18n } from '../locale';
import { useScreen } from '../hooks';

import { yearRangePickerProps, type DateModelValue, type DatePickerRangeShortcutSlotProps } from './types';
import { useRangePickerBase } from './composables/use-range-picker-base';
import { parseValue } from './utils';
import DateRangePanel from './components/DateRangePanel.vue';
import { useClickOutside } from './composables/use-click-outside';

const props = defineProps(yearRangePickerProps);
const emits = defineEmits<{
  /**
   * @zh-CN 值变化时触发
   * @en-US Emitted when the value changes
   */
  (e: 'change', start: DateModelValue, end: DateModelValue): void;
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
  shortcut(props: DatePickerRangeShortcutSlotProps): any;
}>();

/**
 * @zh-CN 年份范围选择器的起始值
 * @en-US The start value of the year range picker
 */
const start = defineModel<DateModelValue>('start', { default: undefined });
/**
 * @zh-CN 年份范围选择器的结束值
 * @en-US The end value of the year range picker
 */
const end = defineModel<DateModelValue>('end', { default: undefined });

const {
  startTimestamp,
  endTimestamp,
  effectiveColor,
  effectiveRound,
  effectiveClearable,
  effectiveDisabled,
  effectiveSize,
  onFocus: baseOnFocus,
  onChange: onFormItemChange,
} = useRangePickerBase({ props, mode: 'year', start, end, emit: emits });

const { t } = useI18n();
const { isPhonePad } = useScreen();
const isResponding = computed(() => !props.noResponsive && isPhonePad.value);

const format = computed(() => props.format ?? 'YYYY');

const toDisplayStr = (ts: number | undefined): string => {
  if (ts === undefined) return '';
  return parseValue(ts)?.format(format.value) ?? '';
};

const tempStart = computed(() => toDisplayStr(startTimestamp.value));
const tempEnd = computed(() => toDisplayStr(endTimestamp.value));

const startFocused = ref(false);
const endFocused = ref(false);
const anyFocused = computed(() => startFocused.value || endFocused.value);

watch(anyFocused, (newVal, oldVal) => {
  if (!newVal && oldVal) {
    emits('blur');
  }
});

const inBoxRef = ref<InstanceType<typeof InBox>>();
const startInputRef = ref<InstanceType<typeof InInput>>();
const endInputRef = ref<InstanceType<typeof InInput>>();
const panelRef = ref<InstanceType<typeof DateRangePanel>>();

const isClearable = computed(() => effectiveClearable.value && !effectiveDisabled.value && !props.readonly && (!!tempStart.value || !!tempEnd.value));

let skipOpenPanel = false;

const openPanel = () => {
  if (effectiveDisabled.value || props.readonly) return;
  panelRef.value?.open(startTimestamp.value, endTimestamp.value);
};

const closeAndBlur = () => {
  panelRef.value?.close();
  startFocused.value = false;
  endFocused.value = false;
  startInputRef.value?.blur();
  endInputRef.value?.blur();
};

const onStartFocus = (e: FocusEvent) => {
  if (!anyFocused.value) {
    baseOnFocus(e);
  }
  startFocused.value = true;
  if (!skipOpenPanel) openPanel();
  skipOpenPanel = false;
};

const onEndFocus = (e: FocusEvent) => {
  if (!anyFocused.value) {
    baseOnFocus(e);
  }
  endFocused.value = true;
  openPanel();
};

useClickOutside({
  targets: [() => inBoxRef.value?.$el, () => panelRef.value?.getPopupEl()],
  onOutside: () => closeAndBlur(),
  disabled: isResponding,
});

const handlePanelChange = (newStart: number | undefined, newEnd: number | undefined) => {
  startTimestamp.value = newStart;
  endTimestamp.value = newEnd;
  if ((newStart && newEnd) || (!newStart && !newEnd)) {
    emits('change', start.value, end.value);
    onFormItemChange();
    if (newStart && newEnd) closeAndBlur();
  }
};

const onClear = (e?: Event) => {
  e?.stopPropagation();
  startTimestamp.value = undefined;
  endTimestamp.value = undefined;
  emits('clear', e);
  emits('change', undefined, undefined);
  onFormItemChange();
  closeAndBlur();
};

defineExpose({
  /**
   * @zh-CN 使输入框获取焦点，open 为 false 时仅聚焦不打开面板
   * @en-US Focus the input. Pass false to focus without opening the panel.
   */
  focus: (open = true) => {
    if (!open) skipOpenPanel = true;
    startInputRef.value?.focus();
  },
  /**
   * @zh-CN 使输入框失去焦点
   * @en-US Blur the input
   */
  blur: () => closeAndBlur(),
  /**
   * @zh-CN 清除输入值
   * @en-US Clear the input value
   */
  clear: () => onClear(),
});
</script>

<template>
  <InBox
    ref="inBoxRef"
    v-bind="{
      size: effectiveSize,
      variant: props.variant,
      color: effectiveColor,
      disabled: effectiveDisabled,
      readonly: props.readonly,
      round: effectiveRound,
      focused: !!anyFocused,
    }"
    :class="['o-date-picker', 'o-year-range-picker', 'o-time-picker', 'o-time-range-picker', { 'o_input-clearable': isClearable }, 'o-input']"
  >
    <template v-if="!isEmptySlot($slots.prepend)" #prepend><slot name="prepend" /></template>

    <InInput
      ref="startInputRef"
      :model-value="tempStart"
      class="o-input-wrap"
      :class="{ 'o-input-wrap-focused': startFocused }"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="props.placeholderStart ?? t('dateRangePicker.placeholderStart')"
      :max-length="format.length"
      :input-on-outlimit="false"
      show-length="never"
      no-keyboard
      @focus="onStartFocus"
    >
      <template #extra>
        <DateRangePanel v-if="!disabled && !readonly" ref="panelRef" :target="inBoxRef?.$el" :option-title="props.optionTitle" @change="handlePanelChange">
          <template #shortcut="{ setValue, emitChange }">
            <slot name="shortcut" :set-value="setValue" :emit-change="emitChange" />
          </template>
        </DateRangePanel>
      </template>
    </InInput>

    <div class="o-date-range-picker-divider">-</div>

    <InInput
      ref="endInputRef"
      :model-value="tempEnd"
      class="o-input-wrap"
      :class="{ 'o-input-wrap-focused': endFocused }"
      :disabled="disabled"
      :readonly="readonly"
      :placeholder="props.placeholderEnd ?? t('dateRangePicker.placeholderEnd')"
      :max-length="format.length"
      :input-on-outlimit="false"
      show-length="never"
      no-keyboard
      @focus="onEndFocus"
    />

    <div class="o_input-suffix" @mousedown.prevent>
      <span v-if="!isResponding || !isClearable" class="o_input-suffix-icon"><IconCalendar /></span>
      <div v-if="isClearable" class="o_input-clear" @click="onClear" @mousedown.prevent>
        <IconClose class="o_input-clear-icon" />
      </div>
    </div>

    <template v-if="!isEmptySlot($slots.append)" #append><slot name="append" /></template>
  </InBox>
</template>
