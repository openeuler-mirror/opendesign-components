<script setup lang="ts">
import { ref, watch, computed, inject, provide } from 'vue';
import { defaultSize } from '../_utils/global';
import { OInput } from '../input';
import { isValidNumber, correctValue, string2number, number2string } from './input-number';
import { isFunction, isUndefined, isNumber } from '../_utils/is';
import { inputNumberProps } from './types';
import NumberControl from './NumberControl.vue';
import { formItemInjectKey } from '../form/provide';
import { innerComponentInjectKey } from '../_components/provide';

const props = defineProps(inputNumberProps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'change', value: number): void;
  (e: 'input', evt: Event): void;
  (e: 'blur', evt: FocusEvent): void;
  (e: 'focus', evt: FocusEvent): void;
  (e: 'clear', evt?: Event): void;
  (e: 'pressEnter', evt: KeyboardEvent): void;
  (e: 'plus', value: number, evt: MouseEvent): void;
  (e: 'minus', value: number, evt: MouseEvent): void;
}>();

const inputValue = ref(number2string(props.modelValue ?? props.defaultValue));
const realValue = ref(props.modelValue ?? props.defaultValue ?? NaN);
let lastValue = realValue.value;

const formItemInjection = inject(formItemInjectKey, null);
const color = computed(() => {
  if (formItemInjection?.fieldResult.value) {
    return formItemInjection?.fieldResult.value?.type || undefined;
  } else {
    return props.color;
  }
});

watch(
  () => props.modelValue,
  (val?: number) => {
    if (realValue.value !== val) {
      inputValue.value = number2string(val);
      realValue.value = val ?? 0;
      lastValue = realValue.value;
    }
  }
);

const validate = (value: string) => {
  const val = string2number(value);
  let valid = isValidNumber(val, props.min, props.max);
  if (valid) {
    valid = isFunction(props.validate) ? props.validate(val) : true;
  }
  return valid;
};
const onInvalidChange = (_: string, last: string) => {
  return last;
};

const emitChange = () => {
  if (realValue.value !== lastValue) {
    emits('change', realValue.value);
    lastValue = realValue.value;
    formItemInjection?.fieldHandlers.onChange?.();
  }
};

const emitUpdateValue = () => {
  emits('update:modelValue', realValue.value);
};

const onInput = (evt: Event) => {
  emits('input', evt);
  formItemInjection?.fieldHandlers.onInput?.();
};
const onFocus = (evt: FocusEvent) => {
  emits('focus', evt);
  formItemInjection?.fieldHandlers.onFocus?.();
};
const onBlur = (evt: FocusEvent) => {
  emits('blur', evt);
  formItemInjection?.fieldHandlers.onBlur?.();
};
const onPressEnter = (evt: KeyboardEvent): void => {
  emits('pressEnter', evt);
};

const onChange = (value: string) => {
  realValue.value = string2number(value);
  // 设置空字符串时对应的值
  if (isNaN(realValue.value) && isNumber(props.clearValue)) {
    realValue.value = props.clearValue;
    emitUpdateValue();
  }
  inputValue.value = number2string(realValue.value);
  emitChange();
};

const onUpdateModelValue = (value: string) => {
  inputValue.value = value;
  realValue.value = string2number(value);
  emitUpdateValue();
};

const addable = computed(() => {
  if (props.disabled) {
    return false;
  }
  if (!isUndefined(props.max) && props.max <= realValue.value) {
    return false;
  }
  return true;
});
const reducible = computed(() => {
  if (props.disabled) {
    return false;
  }
  if (!isUndefined(props.min) && props.min >= realValue.value) {
    return false;
  }
  return true;
});

const onControlEvent = (type: 'plus' | 'minus', e: MouseEvent) => {
  if (props.disabled) {
    return;
  }
  let v = Number.isNaN(realValue.value) ? 0 : realValue.value;

  if (type === 'plus') {
    v += props.step;
  } else if (type === 'minus') {
    v -= props.step;
  }

  v = correctValue(v, lastValue, props.min, props.max);

  realValue.value = v;
  inputValue.value = number2string(v);

  emitUpdateValue();
  emitChange();

  if (type === 'plus') {
    emits('plus', v, e);
  } else if (type === 'minus') {
    emits('minus', v, e);
  }
};

// 表明是否为嵌套子组件，避免表单验证逻辑重复执行
provide(innerComponentInjectKey, {
  isInnerInput: true,
});
</script>
<template>
  <OInput
    :model-value="inputValue"
    class="o-input-number"
    :class="[props.autoWidth ? '' : `o-input-number-size-${props.size || defaultSize}`]"
    :validate="validate"
    :on-invalid-change="onInvalidChange"
    :size="props.size"
    :placeholder="props.placeholder"
    :color="color"
    :variant="props.variant"
    :round="props.round"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :clearable="props.clearable"
    :auto-width="props.autoWidth"
    :format="props.format"
    :input-id="props.inputId"
    type="text"
    @input="onInput"
    @blur="onBlur"
    @focus="onFocus"
    @press-enter="onPressEnter"
    @change="onChange"
    @update:model-value="onUpdateModelValue"
  >
    <template v-if="['both', 'left'].includes(props.controls)" #prepend>
      <NumberControl
        :class="{ 'o-input-control-left': props.controls === 'both' }"
        :type="props.controls === 'left' ? 'both' : 'minus'"
        :addable="addable"
        :reducible="reducible"
        @minus="(e) => onControlEvent('minus', e)"
        @plus="(e) => onControlEvent('plus', e)"
      >
        <template #plus>
          <slot name="plus"></slot>
        </template>
        <template #minus>
          <slot name="minus"></slot>
        </template>
      </NumberControl>
    </template>
    <template v-if="['both', 'right'].includes(props.controls)" #append>
      <NumberControl
        :class="{ 'o-input-control-right': props.controls === 'both' }"
        :type="props.controls === 'right' ? 'both' : 'plus'"
        :addable="addable"
        :reducible="reducible"
        @minus="(e) => onControlEvent('minus', e)"
        @plus="(e) => onControlEvent('plus', e)"
      >
        <template #plus>
          <slot name="plus"></slot>
        </template>
        <template #minus>
          <slot name="minus"></slot>
        </template>
      </NumberControl>
    </template>
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix"></slot>
    </template>
    <template v-if="$slots.suffix" #suffix>
      <slot name="suffix"></slot>
    </template>
  </OInput>
</template>
