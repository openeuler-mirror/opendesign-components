<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { defaultSize, defaultShape, SizeT, ShapeT } from '../_shared/global';
import { isFunction, isNull, isUndefined } from '../_shared/is';
import { IconX } from '../icons';
import { trigger } from '../_shared/event';
import { Enter } from '../_shared/keycode';

interface InputPropT {
  /**
   * 下拉框的值
   * v-model
   */
  value: string | number;
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
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是否只读
   */
  readonly?: false;
  /**
   * 是否可以清除
   */
  clearable?: boolean;
  /**
   * 是否是密码输入
   */
  type?: 'text' | 'password' | 'textarea';
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
  value: '',
  size: undefined,
  shape: undefined,
  placeholder: '',
  type: 'text',
  clearable: true,
  parse: undefined,
  format: undefined,
});

const emits = defineEmits<{
  (e: 'update:value', value: string | number): void;
  (e: 'change', value: string | number): void;
  (e: 'input', value: string | number, evt: Event): void;
  (e: 'blur', value: string | number, evt: FocusEvent): void;
  (e: 'focus', value: string | number, evt: FocusEvent): void;
  (e: 'clear', evt: Event): void;
  (e: 'pressEnter', value: string | number, evt: Event): void;
}>();

// 输入框值
const currentValue = ref(props.value);
// 输入框显示的字符串
const displayValue = computed(() => {
  if (isNull(currentValue.value) || isUndefined(currentValue.value)) {
    return '';
  }
  return isFunction(props.format) ? props.format(currentValue.value) : currentValue.value;
});

const isFocus = ref(false);

function updateValue(val: string) {
  currentValue.value = isFunction(props.parse) ? props.parse(val) : val;

  emits('change', val);
  emits('update:value', val);
}

// 正在输入中文，处理输入过程中触发input事件
let isComposing = false;

const onInput = (e: InputEvent) => {
  if (isComposing) {
    return;
  }
  const val = (e.target as HTMLInputElement)?.value;
  console.log(e.data);

  updateValue(val);
  emits('input', currentValue.value, e);
};

const onCompositionStart = () => {
  isComposing = true;
};
const onCompositionEnd = (e: Event) => {
  if (!isComposing) {
    return;
  }

  isComposing = false;
  trigger(e.target as HTMLElement, 'input');
};

const onFocus = (e: FocusEvent) => {
  isFocus.value = true;
  emits('focus', currentValue.value, e);
};

const onBlur = (e: FocusEvent) => {
  isFocus.value = false;
  emits('blur', currentValue.value, e);
};

const onKeyDown = (e: KeyboardEvent) => {
  const keyCode = e.key || e.code;
  if (!isComposing && keyCode === Enter.key) {
    emits('pressEnter', currentValue.value, e);
  }
};

const clearClick = (e: Event) => {
  updateValue('');
  emits('clear', e);
};
</script>
<template>
  <label
    class="o-input"
    :class="[
      `o-input-size-${props.size || defaultSize}`,
      `o-input-shape-${props.shape || defaultShape}`,
      {
        'is-disabled': props.disabled,
        'is-focus': isFocus,
      },
    ]"
  >
    <span v-if="$slots.prepend" class="o-input-prepend">
      <slot name="prepend"></slot>
    </span>
    <div
      class="o-input-wrap"
      :class="{
        'has-suffix': $slots.suffix,
        clearable: props.clearable && props.value !== '',
        'has-prepend': $slots.prepend,
        'has-append': $slots.append,
      }"
    >
      <div v-if="$slots.prefix" class="o-input-prefix">
        <slot name="prefix"></slot>
      </div>
      <input
        :value="displayValue"
        :type="type"
        :placeholder="props.placeholder"
        class="o-input-input"
        :readonly="props.readonly || props.disabled"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
        @keydown="onKeyDown"
        @compositionstart="onCompositionStart"
        @compositionend="onCompositionEnd"
      />
      <div v-if="props.clearable || $slots.suffix" class="o-input-suffix">
        <div v-if="props.clearable" class="o-input-clear" @click="clearClick"><IconX class="o-input-clear-icon" /></div>
        <span v-if="$slots.suffix" class="o-input-suffix-wrap">
          <slot name="suffix"></slot>
        </span>
      </div>
    </div>
    <span v-if="$slots.append" class="o-input-append">
      <slot name="append"></slot>
    </span>
  </label>
</template>
