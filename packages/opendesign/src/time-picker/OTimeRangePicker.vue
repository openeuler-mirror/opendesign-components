<script setup lang="ts">
import { computed, nextTick, provide, ref, toRef, toRefs, watch } from 'vue';
import { useDebounceFn } from '@vueuse/core';

import { useI18n } from '../locale';
import { IconClose, IconTime } from '../_utils/icons';
import { InBox } from '../_components/in-box';
import { InInput } from '../_components/in-input';
import { useFormField } from '../_composables/use-form-field';
import { isEmptySlot } from '../_utils/vue-utils.ts';
import { ArrowLeft, ArrowRight, Tab } from '../_utils/keycode.ts';
import { useClickOutside } from '../date-picker/composables/use-click-outside.ts';

import { timeRangePickerProps, type TimePickerRangeShortcutSlotProps, type TimeRangeValue } from './types';
import { timePickerInjectKey } from './provide.ts';
import TimeRangePanel from './components/TimeRangePanel.vue';
import { useTimeRangeConstraints } from './use-time-range-constraints.ts';
import { useTimeRangeInputValidation } from './use-time-range-input-validation.ts';

enum RangeType {
  s = 'start',
  e = 'end',
}

const props = defineProps(timeRangePickerProps);
const emits = defineEmits<{
  /**
   * @zh-CN 值变化时触发
   * @en-US Emitted when the value changes
   */
  (e: 'change', newVal: TimeRangeValue, oldVal: TimeRangeValue): void;
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
   * @param props.setValue 设置值的函数，可同时设置开始和结束时间
   * @param props.emitChange 触发变更事件的函数
   */
  shortcut(props: TimePickerRangeShortcutSlotProps): any;
}>();

const {
  effectiveColor: color,
  effectiveRound,
  effectiveClearable,
  effectiveDisabled,
  effectiveSize,
  inputId: startInputId,
  triggerFocus,
  triggerBlur,
  onChange: onFormItemChange,
} = useFormField(props, emits);

/**
 * @zh-CN 时间范围选择器的值 v-model 开始时间
 * @en-US The value of the time picker. Start time
 */
const start = defineModel<string | undefined>('start', { default: undefined, required: true });
/**
 * @zh-CN 时间范围选择器的值 v-model 结束时间
 * @en-US The value of the time picker. End time
 */
const end = defineModel<string | undefined>('end', { default: undefined, required: true });

const tempStart = ref(start.value ?? '');
watch(start, (newVal) => (tempStart.value = newVal ?? ''));
const tempEnd = ref(end.value ?? '');
watch(end, (newVal) => (tempEnd.value = newVal ?? ''));

const startFocused = ref(false);
const endFocused = ref(false);
const focused = computed(() => startFocused.value || endFocused.value);

watch(focused, (newVal, oldVal) => {
  if (!newVal && oldVal) {
    emits('blur');
    triggerBlur();
  }
});

const isClearable = computed(() => effectiveClearable.value && !effectiveDisabled.value && !props.readonly && (!!tempStart.value || !!tempEnd.value));

const { t } = useI18n();

const inBoxRef = ref<InstanceType<typeof InBox>>();
const startInputRef = ref<InstanceType<typeof InInput>>();
const endInputRef = ref<InstanceType<typeof InInput>>();
const panelRef = ref<InstanceType<typeof TimeRangePanel>>();

const { maxStartTime, minEndTime } = useTimeRangeConstraints({
  startTime: tempStart,
  endTime: tempEnd,
  format: toRef(props, 'format'),
  hourStep: toRef(props, 'hourStep'),
  minuteStep: toRef(props, 'minuteStep'),
  secondStep: toRef(props, 'secondStep'),
});

const { isStartValid, isEndValid } = useTimeRangeInputValidation({
  tempStart,
  tempEnd,
  format: toRef(props, 'format'),
  hourStep: toRef(props, 'hourStep'),
  minuteStep: toRef(props, 'minuteStep'),
  secondStep: toRef(props, 'secondStep'),
  minTime: toRef(props, 'minTime'),
  maxTime: toRef(props, 'maxTime'),
  maxStartTime,
  minEndTime,
  disabledHours: toRef(props, 'disabledHours'),
  disabledMinutes: toRef(props, 'disabledMinutes'),
  disabledSeconds: toRef(props, 'disabledSeconds'),
});

watch(
  tempStart,
  useDebounceFn(async () => {
    await nextTick();
    if (isStartValid.value && tempStart.value) panelRef.value?.setStartValue(tempStart.value);
  }, 300),
);

watch(
  tempEnd,
  useDebounceFn(async () => {
    await nextTick();
    if (isEndValid.value && tempEnd.value) panelRef.value?.setEndValue(tempEnd.value);
  }, 300),
);

let skipOpenPanel = false;

const openPanel = () => {
  if (effectiveDisabled.value || props.readonly) return;
  panelRef.value?.open(tempStart.value || undefined, tempEnd.value || undefined);
};

const blurAndClose = () => {
  panelRef.value?.close();
  startFocused.value = false;
  endFocused.value = false;
  startInputRef.value?.blur();
  endInputRef.value?.blur();
};

const cancelEdit = () => {
  tempStart.value = start.value ?? '';
  tempEnd.value = end.value ?? '';
  blurAndClose();
};

useClickOutside({
  targets: [() => inBoxRef.value?.$el, () => panelRef.value?.getPopupEl()],
  onOutside: cancelEdit,
});

const onFocus = (e: FocusEvent, rangeType: RangeType) => {
  if (!focused.value) {
    emits('focus', e);
    triggerFocus(e);
  }
  if (rangeType === RangeType.s) {
    startFocused.value = true;
  } else {
    endFocused.value = true;
  }
  if (!skipOpenPanel) openPanel();
  skipOpenPanel = false;
};

let prevRangeValue: TimeRangeValue = { start: start.value, end: end.value };
let internalRangeChangePending = false;

watch([start, end], ([_newStart, _newEnd], [oldStart, oldEnd]) => {
  if (internalRangeChangePending) {
    internalRangeChangePending = false;
  } else {
    prevRangeValue = { start: oldStart, end: oldEnd };
  }
});

const onChange = () => {
  const empty = !tempStart.value && !tempEnd.value;
  const full = tempStart.value && tempEnd.value;
  if (empty || full) {
    const oldVal = prevRangeValue;
    internalRangeChangePending = true;
    start.value = tempStart.value;
    end.value = tempEnd.value;
    prevRangeValue = { start: start.value, end: end.value };
    emits('change', prevRangeValue, oldVal);
    onFormItemChange();
  }
};

const confirmAndClose = () => {
  onChange();
  blurAndClose();
  emits('pressEnter');
};

const onPanelChange = (startVal: string | undefined, endVal: string | undefined) => {
  tempStart.value = startVal ?? '';
  tempEnd.value = endVal ?? '';
};

const onPanelConfirm = (startVal: string | undefined, endVal: string | undefined) => {
  tempStart.value = startVal ?? '';
  tempEnd.value = endVal ?? '';
  onChange();
  startFocused.value = false;
  endFocused.value = false;
};

/** 切换焦点到目标输入框 */
const switchFocusTo = (targetRange: RangeType) => {
  const targetRef = targetRange === RangeType.s ? startInputRef : endInputRef;
  startFocused.value = targetRange === RangeType.s;
  endFocused.value = targetRange === RangeType.e;
  requestAnimationFrame(() => targetRef.value?.focus());
};

/** 检查光标是否在输入框的指定边界（无选中文本） */
const isCursorAtEdge = (inputRef: typeof startInputRef, position: 'start' | 'end'): boolean => {
  const inputEl = inputRef.value?.inputEl;
  if (!inputEl) return false;
  const { selectionStart, selectionEnd, value } = inputEl;
  return selectionStart === selectionEnd && (position === 'start' ? selectionStart === 0 : selectionStart === value.length);
};

type KeyHandler = (e: KeyboardEvent, rangeType: RangeType) => void;

/** Tab 键：在输入框间切换或离开组件 */
const handleTab: KeyHandler = (e, rangeType) => {
  const toEnd = rangeType === RangeType.s && !e.shiftKey;
  const toStart = rangeType === RangeType.e && e.shiftKey;
  if (toEnd || toStart) {
    e.preventDefault();
    switchFocusTo(toEnd ? RangeType.e : RangeType.s);
  } else {
    const bothValid = isStartValid.value && isEndValid.value;
    if (bothValid) confirmAndClose();
    else cancelEdit();
  }
};

/** ArrowRight 键：从开始框末尾跳转到结束框 */
const handleArrowRight: KeyHandler = (e, rangeType) => {
  if (rangeType === RangeType.s && isCursorAtEdge(startInputRef, 'end')) {
    e.preventDefault();
    switchFocusTo(RangeType.e);
  }
};

/** ArrowLeft 键：从结束框开头跳转到开始框 */
const handleArrowLeft: KeyHandler = (e, rangeType) => {
  if (rangeType === RangeType.e && isCursorAtEdge(endInputRef, 'start')) {
    e.preventDefault();
    switchFocusTo(RangeType.s);
  }
};

const keyHandlers: Record<string, KeyHandler> = {
  [Tab.key]: handleTab,
  [ArrowRight.key]: handleArrowRight,
  [ArrowLeft.key]: handleArrowLeft,
};

/** 处理键盘导航 */
const onKeydown = (e: KeyboardEvent, rangeType: RangeType) => {
  keyHandlers[e.key]?.(e, rangeType);
};

const confirmOrSwitchFocus = (rangeType: RangeType) => {
  const bothValid = isStartValid.value && isEndValid.value;

  if (rangeType === RangeType.s) {
    if (!tempEnd.value) {
      switchFocusTo(RangeType.e);
    } else if (bothValid) {
      confirmAndClose();
    }
  } else {
    if (!tempStart.value) {
      switchFocusTo(RangeType.s);
    } else if (bothValid) {
      confirmAndClose();
    }
  }
};

const onPressEnter = (rangeType: RangeType) => {
  if (rangeType === RangeType.s && !isStartValid.value) {
    cancelEdit();
    return;
  }
  if (rangeType === RangeType.e && !isEndValid.value) {
    cancelEdit();
    return;
  }
  confirmOrSwitchFocus(rangeType);
};

const onClear = () => {
  const oldVal = prevRangeValue;
  internalRangeChangePending = true;
  start.value = undefined;
  end.value = undefined;
  tempStart.value = '';
  tempEnd.value = '';
  prevRangeValue = { start: undefined, end: undefined };
  emits('clear');
  emits('change', prevRangeValue, oldVal);
  onFormItemChange();
  blurAndClose();
};

provide(timePickerInjectKey, {
  ...toRefs(props),
  disabled: effectiveDisabled,
  size: effectiveSize,
  round: effectiveRound,
  isRange: ref(true),
});

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
   * @zh-CN 使输入框失去焦点，校验合法则应用当前值，否则回滚
   * @en-US Blur the input. Applies the current value if valid, otherwise rolls back.
   */
  blur: () => {
    if (isStartValid.value && isEndValid.value) {
      confirmAndClose();
    } else {
      cancelEdit();
    }
  },
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
      color: color,
      disabled: effectiveDisabled,
      readonly: props.readonly,
      round: effectiveRound,
      focused: !!focused,
    }"
    :class="['o-time-picker', 'o-time-range-picker', { 'o_input-clearable': isClearable }, 'o-input']"
  >
    <template v-if="!isEmptySlot($slots.prepend)" #prepend><slot name="prepend" /></template>
    <InInput
      ref="startInputRef"
      v-model="tempStart"
      class="o-input-wrap o-range-start-input-wrap"
      :class="{ 'o-input-wrap-focused': startFocused }"
      :disabled="effectiveDisabled"
      :readonly="readonly"
      :input-id="startInputId"
      :placeholder="props.placeholderStart ?? t('timePicker.startTime')"
      :max-length="props.format?.length ?? 8"
      :input-on-outlimit="false"
      show-length="never"
      no-keyboard
      @focus="(e: FocusEvent) => onFocus(e, RangeType.s)"
      @keydown="(e: KeyboardEvent) => onKeydown(e, RangeType.s)"
      @press-enter="() => onPressEnter(RangeType.s)"
    >
      <template #extra>
        <TimeRangePanel
          v-if="!effectiveDisabled && !readonly"
          ref="panelRef"
          :target="inBoxRef?.$el"
          :option-title="props.optionTitle"
          @change="onPanelChange"
          @confirm="onPanelConfirm"
        >
          <template v-if="!isEmptySlot($slots.shortcut)" #shortcut="{ setValue, emitChange }">
            <slot name="shortcut" :set-value="setValue" :emit-change="emitChange" />
          </template>
        </TimeRangePanel>
      </template>
    </InInput>
    <div class="o-time-range-picker-divider">-</div>
    <InInput
      ref="endInputRef"
      v-model="tempEnd"
      class="o-input-wrap o-range-end-input-wrap"
      :class="{ 'o-input-wrap-focused': endFocused }"
      :disabled="effectiveDisabled"
      :readonly="readonly"
      :placeholder="props.placeholderEnd ?? t('timePicker.endTime')"
      :max-length="props.format?.length ?? 8"
      :input-on-outlimit="false"
      show-length="never"
      no-keyboard
      @focus="(e: FocusEvent) => onFocus(e, RangeType.e)"
      @keydown="(e: KeyboardEvent) => onKeydown(e, RangeType.e)"
      @press-enter="() => onPressEnter(RangeType.e)"
    />
    <div class="o_input-suffix" @mousedown.prevent>
      <span class="o_input-suffix-icon">
        <IconTime />
      </span>
      <div v-if="isClearable" class="o_input-clear" @click="onClear" @mousedown.prevent>
        <IconClose class="o_input-clear-icon" />
      </div>
    </div>
    <template v-if="!isEmptySlot($slots.append)" #append><slot name="append" /></template>
  </InBox>
</template>
