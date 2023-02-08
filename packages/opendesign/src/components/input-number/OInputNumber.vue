<script setup lang="ts">
import { ref, watch } from 'vue';
import { defaultSize, defaultShape, SizeT, ShapeT } from '../_shared/global';
import { IconMinus, IconAdd } from '../icons';
import { OInput } from '../input';
import { isNumberString, getInputValueString, getRealValue } from './input-number';

interface InputPropT {
  /**
   * 下拉框的值
   * v-model
   */
  modelValue?: string | number;
  /**
   * 下拉框的默认值
   * 非受控
   */
  defaultValue?: string | number;
  /**
   * 大小
   */
  step?: number;
  /**
   * 大小
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
  defaultValue: '',
  step: 1,
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
  (e: 'update:modelValue', value: string | number): void;
  (e: 'change', value: string | number): void;
  (e: 'input', value: string | number, evt: Event): void;
  (e: 'blur', value: string | number, evt: FocusEvent): void;
  (e: 'focus', value: string | number, evt: FocusEvent): void;
  (e: 'pressEnter', value: string | number, evt: Event): void;
  (e: 'update:value', value: string | number, evt: Event): void;
}>();

const currentValue = ref<number | string>(getInputValueString(props.modelValue ?? props.defaultValue));

watch(
  () => props.modelValue,
  (val) => {
    currentValue.value = getInputValueString(val);
  }
);

let realValue = getRealValue(currentValue.value);

const isValid = ref(isNumberString(currentValue.value));
let lastValidValue: number | string = '';

const parseValue = (val: string | number) => {
  if (!isValid.value) {
    currentValue.value = lastValidValue;
  } else {
    realValue = Number(val);
    if (realValue !== currentValue.value) {
      currentValue.value = realValue;

      emits('update:modelValue', realValue);
      emits('change', realValue);
    }
  }
  isValid.value = true;
};
const updateValue = (val: string | number) => {
  isValid.value = isNumberString(val);
  currentValue.value = val;

  if (isValid.value && props.updateOnInput) {
    parseValue(val);
  }
};

const onInput = (val: string | number, evt: Event) => {
  emits('input', val, evt);
};

const onFocus = (val: string | number, evt: FocusEvent) => {
  lastValidValue = currentValue.value;
  emits('focus', realValue, evt);
};
const onBlur = (val: string | number, evt: FocusEvent) => {
  parseValue(val);
  emits('blur', realValue, evt);
};
const onPressEnter = (val: string | number, evt: FocusEvent) => {
  parseValue(val);
  emits('pressEnter', realValue, evt);
};

const constrolClick = (type: 'plus' | 'minus') => {
  if (type === 'plus') {
    realValue += props.step;
  } else {
    realValue -= props.step;
  }
  parseValue(realValue);
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
    :parse="props.parse"
    :format="props.format"
    @input="onInput"
    @blur="onBlur"
    @focus="onFocus"
    @press-enter="onPressEnter"
    @update:model-value="updateValue"
  >
    <template v-if="['default', 'left'].includes(props.controls)" #prepend>
      <div class="o-input-number-btn" @click="constrolClick('minus')">
        <slot name="control-left"><IconMinus /></slot>
      </div>
    </template>
    <template v-if="['default', 'right'].includes(props.controls)" #append>
      <div class="o-input-number-btn" @click="constrolClick('plus')">
        <slot name="control-right"><IconAdd /></slot>
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
