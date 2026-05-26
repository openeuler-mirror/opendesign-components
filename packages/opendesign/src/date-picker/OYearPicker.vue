<!-- packages/opendesign/src/date-picker/OYearPicker.vue -->
<script setup lang="ts">
import { ref } from 'vue';
import { InBox } from '../_components/in-box';
import { isEmptySlot } from '../_utils/vue-utils';

import { yearPickerProps, type DateModelValue, type DatePickerShortcutSlotProps } from './types';
import { usePickerBase } from './composables/use-picker-base';
import InnerDatePicker from './components/InnerDatePicker.vue';

const props = defineProps(yearPickerProps);
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
 * @zh-CN 年份选择器的值
 * @en-US The value of the year picker
 */
const modelValue = defineModel<DateModelValue>('modelValue', { default: undefined });

const { timestampValue, effectiveColor, inputId, isFocus, onFocus, onBlur, onClear, onPressEnter, notifyChange } = usePickerBase({
  props,
  mode: 'year',
  modelValue,
  emit: emits,
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
    :class="['o-date-picker', 'o-year-picker', 'o-input']"
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
