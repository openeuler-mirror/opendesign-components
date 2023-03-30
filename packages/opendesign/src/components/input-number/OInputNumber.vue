<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { defaultSize } from '../_shared/global';
import { IconMinus, IconAdd, IconChevronUp, IconChevronDown } from '../_shared/icons';
import { OInput } from '../input';
import { isValidNumber, correctValue, getRealValue } from './input-number';
import { isFunction, isUndefined } from '../_shared/is';
import { inputNumberPorps } from './types';

const props = defineProps(inputNumberPorps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'change', value: number): void;
  (e: 'input', value: string, evt: Event): void;
  (e: 'blur', value: number, evt: FocusEvent): void;
  (e: 'focus', value: number, evt: FocusEvent): void;
  (e: 'plus', value: number, evt: MouseEvent): void;
  (e: 'minus', value: number, evt: MouseEvent): void;
  (e: 'pressEnter', value: number, evt: Event): void;
}>();

const currentValue = ref<number | string | undefined>(props.modelValue ?? props.defaultValue);
const isValid = ref(isValidNumber(currentValue.value, props.min, props.max));

let numberValue = getRealValue(currentValue.value);
let lastNumberValue = numberValue;
let lastInputValue = currentValue.value;

watch(
  () => props.modelValue,
  (val) => {
    isValid.value = isValidNumber(val, props.min, props.max);
    if (isFunction(props.format)) {
      currentValue.value = props.format(val ?? '');
    } else {
      currentValue.value = val;
    }
    numberValue = getRealValue(currentValue.value);
    lastNumberValue = numberValue;
    lastInputValue = currentValue.value;
    // console.log('watch', val);
  }
);

const canAdd = computed(() => {
  if (props.disabled) {
    return false;
  }
  const n = Number(currentValue.value);
  if (!isUndefined(props.max) && props.max <= n) {
    return false;
  }
  return true;
});
const canMinus = computed(() => {
  if (props.disabled) {
    return false;
  }
  const n = Number(currentValue.value);
  if (!isUndefined(props.min) && props.min >= n) {
    return false;
  }
  return true;
});

const updateValue = (val: string) => {
  const v = isFunction(props.parse) ? props.parse(val) : val;
  // const v = val;

  if (isValid.value) {
    numberValue = getRealValue(v);
  } else {
    // 不合法数据矫正
    numberValue = correctValue(v, lastNumberValue, props.min, props.max);
    isValid.value = true;
  }

  emits('update:modelValue', numberValue);

  if (numberValue !== lastNumberValue) {
    emits('change', numberValue);
  }

  if (val !== lastInputValue) {
    if (isFunction(props.format)) {
      currentValue.value = props.format(numberValue);
    } else {
      // 更新输入框显示的值
      currentValue.value = numberValue;
    }
  }

  lastNumberValue = numberValue;
  lastInputValue = currentValue.value;
  return numberValue;
};

const onInput = (val: string, evt: Event) => {
  emits('input', val, evt);
};

const onFocus = (val: string, evt: FocusEvent) => {
  // lastNumberValue = numberValue;
  emits('focus', numberValue, evt);
  // console.log('focus', numberValue);
};
const onBlur = (val: string, evt: FocusEvent) => {
  const v = updateValue(val);
  emits('blur', v, evt);
};
const onPressEnter = (val: string, evt: Event): void => {
  const v = updateValue(val);

  emits('pressEnter', v, evt);
};

const onChange = (val: string) => {
  // console.log('change', val);
  if (isValid.value) {
    updateValue(val);
  }
};

const onUpdateModelValue = (val: string) => {
  // console.log('update model');
  isValid.value = isValidNumber(val, props.min, props.max, props.parse);

  if (isValid.value) {
    numberValue = getRealValue(val, undefined, undefined, props.parse);
    if (!isFunction(props.format)) {
      emits('update:modelValue', numberValue);
    }
  }
  currentValue.value = val;
};

const controlClick = (type: 'plus' | 'minus', e: MouseEvent) => {
  if (props.disabled) {
    return;
  }
  let v = Number.isNaN(numberValue) ? 0 : numberValue;

  if (type === 'plus' && canAdd.value) {
    v += props.step;
    v = updateValue(String(v));
    emits('plus', v, e);
  } else if (type === 'minus' && canMinus.value) {
    v -= props.step;
    v = updateValue(String(v));
    emits('minus', v, e);
  }
};
</script>
<template>
  <OInput
    :model-value="currentValue"
    class="o-input-number"
    :class="[`o-input-number-size-${props.size || defaultSize}`, { 'is-invalid': !isValid }]"
    :size="props.size"
    :placeholder="props.placeholder"
    :color="props.color"
    :round="props.round"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :clearable="false"
    type="text"
    @input="onInput"
    @change="onChange"
    @blur="onBlur"
    @focus="onFocus"
    @press-enter="onPressEnter"
    @update:model-value="onUpdateModelValue"
  >
    <template v-if="['both', 'left'].includes(props.controls)" #prepend>
      <div class="o-input-number-btn-wrap">
        <div
          v-if="props.controls === 'both'"
          class="o-input-number-btn both-left"
          tabindex="-1"
          :class="{
            'is-disabled': !canMinus,
          }"
          @click="(e) => controlClick('minus', e)"
        >
          <slot name="minus"><IconMinus /></slot>
        </div>
        <template v-if="props.controls === 'left'">
          <div
            class="o-input-number-btn plus"
            :class="{
              'is-disabled': !canAdd,
            }"
            tabindex="-1"
            @click="(e) => controlClick('plus', e)"
          >
            <slot name="add"><IconChevronUp class="o-input-number-icon-plus" /></slot>
          </div>
          <div
            class="o-input-number-btn minus"
            :class="{
              'is-disabled': !canMinus,
            }"
            tabindex="-1"
            @click="(e) => controlClick('minus', e)"
          >
            <slot name="minus"><IconChevronDown class="o-input-number-icon-minus" /></slot>
          </div>
        </template>
      </div>
    </template>
    <template v-if="['both', 'right'].includes(props.controls)" #append>
      <div class="o-input-number-btn-wrap">
        <div
          v-if="props.controls === 'both'"
          class="o-input-number-btn both-right"
          :class="{
            'is-disabled': !canAdd,
          }"
          tabindex="-1"
          @click="(e) => controlClick('plus', e)"
        >
          <slot name="add"><IconAdd /></slot>
        </div>
        <template v-else-if="props.controls === 'right'">
          <div
            class="o-input-number-btn plus"
            tabindex="-1"
            :class="{
              'is-disabled': !canAdd,
            }"
            @click="(e) => controlClick('plus', e)"
          >
            <slot name="add"><IconChevronUp class="o-input-number-icon-plus" /></slot>
          </div>
          <div
            class="o-input-number-btn minus"
            tabindex="-1"
            :class="{
              'is-disabled': !canMinus,
            }"
            @click="(e) => controlClick('minus', e)"
          >
            <slot name="minus"><IconChevronDown class="o-input-number-icon-minus" /></slot>
          </div>
        </template>
      </div>
    </template>
    <template v-if="$slots.prefix" #prefix>
      <slot name="prefix"></slot>
    </template>

    <template v-if="$slots.suffix" #suffix>
      <slot name="suffix"></slot>
    </template>
  </OInput>
</template>
