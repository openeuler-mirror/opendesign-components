<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { defaultSize, SizeT, ShapeT } from '../_shared/global';
import { IconMinus, IconAdd, IconChevronDown, IconChevronUp } from '../icons';
import { OInput } from '../input';
import { isValidNumber, correctValue, getRealValue } from './input-number';
import { isFunction, isUndefined } from '../_shared/is';

interface InputPropT {
  /**
   * 数字输入框的值
   * v-model
   */
  modelValue?: string | number;
  /**
   * 数字输入框的默认值
   * 非受控
   */
  defaultValue?: string | number;
  /**
   * 按钮点击时步长
   */
  step?: number;
  /**
   * 最小值
   */
  min?: number;
  /**
   * 最大值
   */
  max?: number;
  /**
   * 样式尺寸
   */
  size?: SizeT;
  /**
   * 形状
   */
  shape?: ShapeT;
  /**
   * 提示文本
   */
  placeholder?: string;
  /**
   * 状态，显示指定，用于非表单场景
   */
  status?: 'success' | 'warning' | 'error';
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是否只读
   */
  readonly?: boolean;
  /**
   * 是否可以清除
   */
  clearable?: boolean;
  /**
   * 控制按钮位置
   */
  controls?: 'default' | 'right' | 'left' | 'none';
  /**
   * 是否在输入合法时，更新modelvalue
   */
  updateOnInput?: boolean;
  /**
   * 解析输入框的值
   */
  parse?: (value: string) => string;
  /**
   * 对值格式化，控制显示格式
   * 需搭配parse处理，保证值的正确性
   */
  format?: (value: string | number) => string | number;
}
const props = withDefaults(defineProps<InputPropT>(), {
  modelValue: undefined,
  defaultValue: undefined,
  step: 1,
  min: undefined,
  max: undefined,
  size: undefined,
  shape: undefined,
  placeholder: '',
  clearable: true,
  parse: undefined,
  format: undefined,
  status: undefined,
  controls: 'default',
  updateOnInput: true,
});

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

watch(
  () => props.modelValue,
  (val) => {
    isValid.value = isValidNumber(val, props.min, props.max);
    if (isFunction(props.format)) {
      currentValue.value = props.format(val ?? '');
    } else {
      currentValue.value = val;
    }
    // console.log('watch', val);
  }
);

let numberValue = getRealValue(currentValue.value);
let lastNumberValue = numberValue;

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
  } else {
    if (isFunction(props.format)) {
      currentValue.value = props.format(numberValue);
    } else {
      // 更新输入框显示的值
      currentValue.value = numberValue;
    }
  }

  lastNumberValue = numberValue;
  return numberValue;
};

const onInput = (val: string, evt: Event) => {
  emits('input', val, evt);
};

const onFocus = (val: string, evt: FocusEvent) => {
  lastNumberValue = numberValue;
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
      lastNumberValue = numberValue;
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
    :shape="props.shape"
    :placeholder="props.placeholder"
    :status="props.status"
    :disabled="props.disabled"
    :readonly="props.readonly"
    :clearable="false"
    @input="onInput"
    @change="onChange"
    @blur="onBlur"
    @focus="onFocus"
    @press-enter="onPressEnter"
    @update:model-value="onUpdateModelValue"
  >
    <template v-if="['default', 'left'].includes(props.controls)" #prepend>
      <div
        v-if="props.controls === 'default'"
        class="o-input-number-btn prepend"
        :class="{
          'is-disabled': !canMinus,
        }"
        @click="(e) => controlClick('minus', e)"
      >
        <slot name="minus"><IconMinus /></slot>
      </div>
      <div v-if="props.controls === 'left'" class="o-input-number-btn is-vertical">
        <div
          class="o-input-number-btn-plus"
          :class="{
            'is-disabled': !canAdd,
          }"
          @click="(e) => controlClick('plus', e)"
        >
          <slot name="add"><IconChevronUp class="o-input-number-icon-plus" /></slot>
        </div>
        <div
          class="o-input-number-btn-minus"
          :class="{
            'is-disabled': !canMinus,
          }"
          @click="(e) => controlClick('minus', e)"
        >
          <slot name="minus"><IconChevronDown class="o-input-number-icon-minus" /></slot>
        </div>
      </div>
    </template>
    <template v-if="['default', 'right'].includes(props.controls)" #append>
      <div
        v-if="props.controls === 'default'"
        class="o-input-number-btn append"
        :class="{
          'is-disabled': !canAdd,
        }"
        @click="(e) => controlClick('plus', e)"
      >
        <slot name="add"><IconAdd /></slot>
      </div>
      <div v-if="props.controls === 'right'" class="o-input-number-btn is-vertical">
        <div
          class="o-input-number-btn-plus"
          :class="{
            'is-disabled': !canAdd,
          }"
          @click="(e) => controlClick('plus', e)"
        >
          <slot name="add"><IconChevronUp class="o-input-number-icon-plus" /></slot>
        </div>
        <div
          class="o-input-number-btn-minus"
          :class="{
            'is-disabled': !canMinus,
          }"
          @click="(e) => controlClick('minus', e)"
        >
          <slot name="minus"><IconChevronDown class="o-input-number-icon-minus" /></slot>
        </div>
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
