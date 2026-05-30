<!-- packages/opendesign/src/date-picker/ODateTimePicker.vue -->
<script setup lang="ts">
import { computed, provide, ref, toRefs } from 'vue';
import { InBox } from '../_components/in-box';
import { isEmptySlot } from '../_utils/vue-utils';
import { timePickerInjectKey } from '../time-picker/provide';

import { dateTimePickerProps, type DateModelValue, type DatePickerShortcutSlotProps } from './types';
import { usePickerBase } from './composables/use-picker-base';
import { parseValue } from './utils';
import InnerDatePicker from './components/InnerDatePicker.vue';

const props = defineProps(dateTimePickerProps);
const emits = defineEmits<{
  /**
   * @zh-CN 值变化时触发
   * @en-US Emitted when the value changes
   */
  (e: 'change', newVal: DateModelValue, oldVal: DateModelValue): void;
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
  shortcut(props: DatePickerShortcutSlotProps): any;
}>();

/**
 * @zh-CN 日期时间选择器的值
 * @en-US The value of the date time picker
 */
const modelValue = defineModel<DateModelValue>('modelValue', { default: undefined });

const { timestampValue, effectiveColor, inputId, isFocus, onFocus, onBlur, onClear, onPressEnter, notifyChange } = usePickerBase({
  props,
  mode: 'datetime',
  modelValue,
  emit: emits,
});

const propsRefs = toRefs(props);

// 为 DatePanelTime 提供 time-picker 上下文
provide(timePickerInjectKey, {
  disabled: propsRefs.disabled,
  readonly: propsRefs.readonly,
  size: propsRefs.size,
  round: propsRefs.round,
  noResponsive: propsRefs.noResponsive,
  popupPosition: propsRefs.popupPosition,
  popupWrapper: propsRefs.popupWrapper,
  transition: propsRefs.transition,
  // 时间格式：从 format 中提取时间部分
  format: computed(() => {
    const match = props.format.match(/HH:mm(?::ss)?/);
    return match ? match[0] : 'HH:mm:ss';
  }),
  // 时间约束：dateTimePickerProps 包含 timeConstraintProps，直接使用
  hourStep: propsRefs.hourStep,
  minuteStep: propsRefs.minuteStep,
  secondStep: propsRefs.secondStep,
  disabledHours: propsRefs.disabledHours,
  disabledMinutes: propsRefs.disabledMinutes,
  disabledSeconds: propsRefs.disabledSeconds,
  minTime: computed(() => propsRefs.minTime?.value ?? (propsRefs.minDate?.value ? parseValue(propsRefs.minDate.value)?.format('HH:mm:ss') : undefined)),
  maxTime: computed(() => propsRefs.maxTime?.value ?? (propsRefs.maxDate?.value ? parseValue(propsRefs.maxDate.value)?.format('HH:mm:ss') : undefined)),
});

const onChange = (newVal: number | undefined, oldVal: number | undefined) => {
  emits('change', newVal, oldVal);
  notifyChange();
};

const inBoxRef = ref<InstanceType<typeof InBox>>();
const innerRef = ref<InstanceType<typeof InnerDatePicker>>();

defineExpose({
  /**
   * @zh-CN 使输入框获取焦点，open 为 false 时仅聚焦不打开面板
   * @en-US Focus the input. Pass false to focus without opening the panel.
   */
  focus: (open = true) => innerRef.value?.focus(open),
  /**
   * @zh-CN 使输入框失去焦点
   * @en-US Blur the input
   */
  blur: () => innerRef.value?.blur(),
  /**
   * @zh-CN 清除输入值
   * @en-US Clear the input value
   */
  clear: () => innerRef.value?.clear(),
  /**
   * @zh-CN 获取输入框 DOM 元素
   * @en-US Get the input DOM element
   */
  inputEl: () => innerRef.value?.inputEl(),
});
</script>

<template>
  <InBox
    ref="inBoxRef"
    v-bind="{
      size: props.size,
      variant: props.variant,
      color: effectiveColor,
      disabled: props.disabled,
      readonly: props.readonly,
      round: props.round,
      focused: isFocus,
    }"
    :class="['o-date-picker', 'o-datetime-picker', 'o-input']"
  >
    <template v-if="!isEmptySlot($slots.prepend)" #prepend><slot name="prepend" /></template>
    <InnerDatePicker
      ref="innerRef"
      v-model="timestampValue"
      :in-box-ref="inBoxRef?.$el"
      :input-id="inputId"
      has-icon
      @focus="onFocus"
      @blur="onBlur"
      @clear="onClear"
      @press-enter="onPressEnter"
      @change="onChange"
    >
      <template v-if="!isEmptySlot($slots.shortcut)" #shortcut="{ setValue, emitChange }">
        <slot name="shortcut" :set-value="setValue" :emit-change="emitChange" />
      </template>
    </InnerDatePicker>
    <template v-if="!isEmptySlot($slots.append)" #append><slot name="append" /></template>
  </InBox>
</template>
