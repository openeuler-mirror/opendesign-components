<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { defaultSize, defaultShape, SizeT, ShapeT } from '../_shared/global';
import { isFunction } from '../_shared/is';
import { IconX } from '../icons';
import { trigger } from '../_shared/event';
import { Enter } from '../_shared/keycode';
import { toInputString } from './input';

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
  modelValue: undefined,
  defaultValue: '',
  size: undefined,
  shape: undefined,
  placeholder: '',
  type: 'text',
  clearable: true,
  parse: undefined,
  format: undefined,
  status: undefined,
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'input', value: string, evt: Event): void;
  (e: 'blur', value: string, evt: FocusEvent): void;
  (e: 'focus', value: string, evt: FocusEvent): void;
  (e: 'clear', evt: Event): void;
  (e: 'pressEnter', value: string, evt: KeyboardEvent): void;
}>();

const inputRef = ref<HTMLElement | null>(null);
// 数字输入框当前值
const realValue = ref(toInputString(props.modelValue ?? props.defaultValue));
// 监听属性变化，刷新值
watch(
  () => props.modelValue,
  (val) => {
    // console.log('watch', val);
    realValue.value = toInputString(val);
  }
);

// 输入框显示的字符串
const displayValue = computed(() => {
  const v = isFunction(props.format) ? props.format(realValue.value) : realValue.value;
  // console.log('displayValue', v, realValue.value);
  return v;
});

// 输入框状态
const status = ref<undefined | 'warning' | 'warn' | 'error'>();
const statusClass = computed(() => (status.value || props.status ? `is-${status.value || props.status}` : ''));

// 是否聚焦状态
const isFocus = ref(false);
let lastValue: string = realValue.value;

function updateValue(val: string) {
  const value = isFunction(props.parse) ? props.parse(val) : val;
  emits('update:modelValue', value);

  if (lastValue !== value) {
    emits('change', value);
    lastValue = value;
  }
  return value;
}

// 正在输入中文，处理输入过程中触发input事件
let isComposing = false;
let clickInside = false;

// 开始中文输入
const onCompositionStart = () => {
  isComposing = true;
};
// 结束中文输入
const onCompositionEnd = (e: Event) => {
  if (!isComposing) {
    return;
  }

  isComposing = false;
  trigger(e.target as HTMLElement, 'input');
};

const onInput = (e: Event) => {
  if (isComposing) {
    return;
  }
  const val = (e.target as HTMLInputElement)?.value;
  emits('input', val, e);
  // console.log('input', val);

  if (!props.parse) {
    emits('update:modelValue', val);
    // console.log('update:modelValue', val);
  }
};

const onFocus = (e: FocusEvent) => {
  clickInside = false;
  if (isFocus.value) {
    return;
  }
  // console.log('onFocus', clickInside);
  isFocus.value = true;
  emits('focus', realValue.value, e);
  // console.log('focus', realValue.value);
};

const onBlur = (e: FocusEvent) => {
  if (clickInside) {
    clickInside = false;
    return;
  }
  // console.log('onBlur', clickInside);
  isFocus.value = false;
  const val = (e.target as HTMLInputElement)?.value;
  const v = updateValue(val);
  emits('blur', v, e);
  // console.log('blur', v);
};

const onKeyDown = (e: KeyboardEvent) => {
  const keyCode = e.key || e.code;
  if (!isComposing && keyCode === Enter.key) {
    const val = (e.target as HTMLInputElement)?.value;
    const v = updateValue(val);
    emits('pressEnter', v, e);
    // console.log('pressEnter', v);
  }
};
// 清除值
const clearClick = (e: Event) => {
  updateValue('');
  emits('clear', e);
};
const onMouseDown = (e: MouseEvent) => {
  if ((e.target as HTMLInputElement) !== inputRef.value) {
    clickInside = true;
  }
};
</script>
<template>
  <label
    class="o-input"
    :class="[
      statusClass,
      `o-input-size-${props.size || defaultSize}`,
      `o-input-shape-${props.shape || defaultShape}`,
      `o-input-status-${props.status}`,
      {
        'o-input-disabled': props.disabled,
        'o-input-focus': isFocus,
      },
    ]"
    @mousedown="onMouseDown"
  >
    <span v-if="$slots.prepend" class="o-input-prepend">
      <slot name="prepend"></slot>
    </span>
    <div
      class="o-input-wrap"
      :class="{
        'o-input-clearable': props.clearable && realValue !== '' && !props.disabled,
        'has-suffix': $slots.suffix,
        'has-prepend': $slots.prepend,
        'has-append': $slots.append,
        'is-focus': isFocus,
      }"
    >
      <div v-if="$slots.prefix" class="o-input-prefix">
        <slot name="prefix"></slot>
      </div>
      <input
        ref="inputRef"
        :value="displayValue"
        :type="type"
        :placeholder="props.placeholder"
        class="o-input-input"
        :readonly="props.readonly"
        :disabled="props.disabled"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
        @keydown="onKeyDown"
        @compositionstart="onCompositionStart"
        @compositionend="onCompositionEnd"
      />
      <div v-if="props.clearable || $slots.suffix" class="o-input-suffix">
        <span v-if="$slots.suffix" class="o-input-suffix-wrap">
          <slot name="suffix"></slot>
        </span>
        <div v-if="props.clearable" class="o-input-clear" @click="clearClick"><IconX class="o-input-clear-icon" /></div>
      </div>
    </div>
    <span v-if="$slots.append" class="o-input-append">
      <slot name="append"></slot>
    </span>
  </label>
</template>
