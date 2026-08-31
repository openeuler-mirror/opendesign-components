<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { defaultSize } from '../_utils/global';
import { OInput } from '../input';
import { isValidNumber, correctValue, string2number, number2string } from './input-number';
import { isFunction, isUndefined, isNumber } from '../_utils/is';
import { inputNumberProps } from './types';
import NumberControl from './NumberControl.vue';
import { useFormField } from '../_composables/use-form-field';

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

const {
  effectiveColor: color,
  effectiveDisabled,
  effectiveSize,
  effectiveRound,
  effectiveClearable,
  triggerFocus,
  triggerBlur,
  onChange: onFormItemChange,
  onInput: onFormItemInput,
  blockChildInject,
} = useFormField(props, emits);

/**
 * @description 阻断内嵌 OInput 的 FormItem inject，OInputNumber 自身通过 useFormField 统一获取继承值
 */
blockChildInject();

const inputValue = ref(number2string(props.modelValue ?? props.defaultValue));
const realValue = ref(props.modelValue ?? props.defaultValue ?? NaN);
let lastValue = realValue.value;

watch(
  () => props.modelValue,
  (val?: number) => {
    if (realValue.value !== val) {
      inputValue.value = number2string(val);
      realValue.value = val ?? 0;
      lastValue = realValue.value;
    }
  },
);

const validate = (value: string) => {
  const val = string2number(value);
  let valid = isValidNumber(val, props.min, props.max);
  if (valid) {
    valid = isFunction(props.validate) ? props.validate(val) : true;
  }
  return valid;
};
const valueOnInvalidChange = (_: string, last: string) => {
  return last;
};

const emitChange = () => {
  if (realValue.value !== lastValue) {
    emits('change', realValue.value);
    lastValue = realValue.value;
    onFormItemChange();
  }
};

const emitUpdateValue = () => {
  emits('update:modelValue', realValue.value);
};

const onInput = (evt: Event) => {
  emits('input', evt);
  onFormItemInput();
};
const onFocus = (evt: FocusEvent) => {
  emits('focus', evt);
  triggerFocus(evt);
};
const onBlur = (evt: FocusEvent) => {
  emits('blur', evt);
  triggerBlur();
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
  if (effectiveDisabled.value) {
    return false;
  }
  if (!isUndefined(props.max) && props.max <= realValue.value) {
    return false;
  }
  return true;
});
const reducible = computed(() => {
  if (effectiveDisabled.value) {
    return false;
  }
  if (!isUndefined(props.min) && props.min >= realValue.value) {
    return false;
  }
  return true;
});

const onControlEvent = (type: 'plus' | 'minus', e: MouseEvent) => {
  if (effectiveDisabled.value) {
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
</script>
<template>
  <OInput
    :model-value="inputValue"
    class="o-input-number"
    :class="[props.autoWidth ? '' : `o-input-number-size-${effectiveSize || defaultSize}`]"
    :validate="validate"
    :value-on-invalid-change="valueOnInvalidChange"
    :size="effectiveSize"
    :placeholder="props.placeholder"
    :color="color"
    :variant="props.variant"
    :round="effectiveRound"
    :disabled="effectiveDisabled"
    :readonly="props.readonly"
    :clearable="effectiveClearable"
    :auto-width="props.autoWidth"
    :format="props.format"
    :input-id="props.inputId"
    only-numeric-input
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
