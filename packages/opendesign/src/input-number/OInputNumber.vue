<script setup lang="ts">
import { ref, watch, computed, inject, provide } from 'vue';
import { defaultSize } from '../_utils/global';
import { IconMinus, IconAdd, IconChevronUp, IconChevronDown } from '../_utils/icons';
import { OInput } from '../input';
import { isValidNumber, correctValue, string2number, number2string } from './input-number';
import { isFunction, isUndefined } from '../_utils/is';
import { inputNumberPorps } from './types';
import { formItemInjectKey } from '../form/provide';
import { innerComponentInjectKey } from '../_components/provide';

const props = defineProps(inputNumberPorps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: number): void;
  (e: 'change', value: number): void;
  (e: 'input', inputValue: string, value: number, evt: Event): void;
  (e: 'blur', value: number, evt: FocusEvent): void;
  (e: 'focus', value: number, evt: FocusEvent): void;
  (e: 'plus', value: number, evt: MouseEvent): void;
  (e: 'minus', value: number, evt: MouseEvent): void;
  (e: 'pressEnter', value: number, evt: Event): void;
}>();

// 当前数字值
const defaultVal = ref<number>(props.defaultValue ?? 0);
// 输入框的值
const inputValue = ref<string>(number2string(props.modelValue ?? props.defaultValue));
const currentValue = computed(() => string2number(inputValue.value));

// 记录上一次值
let lastValue = currentValue.value;

watch(
  () => props.modelValue,
  (val?: number) => {
    if (currentValue.value !== val) {
      inputValue.value = number2string(val);
    }
  }
);

const formItemInjection = inject(formItemInjectKey, null);

const color = computed(() => {
  if (formItemInjection?.fieldResult.value) {
    return formItemInjection?.fieldResult.value?.type;
  } else {
    return props.color;
  }
});

const parseFun = (v: string) => {
  let val = string2number(v);
  if (props.parse) {
    val = props.parse(val);
  }
  return number2string(val);
};

const checkValidFun = (value: string) => {
  const val = string2number(value);
  let valid = isValidNumber(val, props.min, props.max);
  if (valid) {
    valid = isFunction(props.checkValid) ? props.checkValid(val) : true;
  }
  return valid;
};

const onInvalidChange = (value: string, last: string) => {
  return last;
};

const canAdd = computed(() => {
  if (props.disabled) {
    return false;
  }
  if (!isUndefined(props.max) && props.max <= currentValue.value) {
    return false;
  }
  return true;
});
const canMinus = computed(() => {
  if (props.disabled) {
    return false;
  }
  if (!isUndefined(props.min) && props.min >= currentValue.value) {
    return false;
  }
  return true;
});

const emitChange = () => {
  emits('change', currentValue.value);
  formItemInjection?.fieldHandlers.onChange?.(currentValue.value);
};
const updateValue = (val: number) => {
  inputValue.value = number2string(val);

  emits('update:modelValue', currentValue.value);

  if (currentValue.value !== lastValue) {
    emitChange();
    lastValue = currentValue.value;
  }
  return currentValue.value;
};

const onInput = (val: string, evt: Event) => {
  inputValue.value = val;
  emits('input', val, currentValue.value, evt);
};

const onFocus = (val: string, evt: FocusEvent) => {
  emits('focus', currentValue.value, evt);
};
const onBlur = (val: string, evt: FocusEvent) => {
  emits('blur', currentValue.value, evt);
};
const onPressEnter = (val: string, evt: Event): void => {
  emits('pressEnter', currentValue.value, evt);
};

const onChange = (val: string) => {
  inputValue.value = val;
  emitChange();
};

const onUpdateModelValue = (val: string) => {
  inputValue.value = val;

  emits('update:modelValue', currentValue.value);
};

const controlClick = (type: 'plus' | 'minus', e: MouseEvent) => {
  if (props.disabled) {
    return;
  }
  let v = Number.isNaN(currentValue.value) ? 0 : currentValue.value;

  if (type === 'plus' && canAdd.value) {
    v += props.step;
    v = correctValue(v, lastValue, props.min, props.max);
    updateValue(v);
    emits('plus', v, e);
  } else if (type === 'minus' && canMinus.value) {
    v -= props.step;
    v = correctValue(v, lastValue, props.min, props.max);
    updateValue(v);
    emits('minus', v, e);
  }
};

// 表明是否为嵌套子组件
provide(innerComponentInjectKey, {
  isInnerInput: true,
});
</script>
<template>
  <OInput
    :default-value="defaultVal"
    :model-value="inputValue"
    class="o-input-number"
    :class="[`o-input-number-size-${props.size || defaultSize}`]"
    :check-valid="checkValidFun"
    :on-invalid-change="onInvalidChange"
    :size="props.size"
    :placeholder="props.placeholder"
    :color="color"
    :variant="props.variant"
    :round="props.round"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :clearable="props.clearable"
    :parse="parseFun"
    :format="props.format"
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
          @click="(e:MouseEvent) => controlClick('minus', e)"
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
            @click="(e:MouseEvent) => controlClick('plus', e)"
          >
            <slot name="add"><IconChevronUp class="o-input-number-icon-plus" /></slot>
          </div>
          <div
            class="o-input-number-btn minus"
            :class="{
              'is-disabled': !canMinus,
            }"
            tabindex="-1"
            @click="(e:MouseEvent) => controlClick('minus', e)"
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
          @click="(e:MouseEvent) => controlClick('plus', e)"
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
            @click="(e:MouseEvent) => controlClick('plus', e)"
          >
            <slot name="add"><IconChevronUp class="o-input-number-icon-plus" /></slot>
          </div>
          <div
            class="o-input-number-btn minus"
            tabindex="-1"
            :class="{
              'is-disabled': !canMinus,
            }"
            @click="(e:MouseEvent) => controlClick('minus', e)"
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
