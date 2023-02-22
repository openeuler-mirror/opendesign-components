<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { defaultSize } from '../_shared/global';
import { isFunction } from '../_shared/is';
import { IconX } from '../icons';
import { trigger } from '../_shared/event';
import { Enter } from '../_shared/keycode';
import { toInputString } from './input';
import { OResizeObserver } from '../resize-observer';
import { inputProps } from './types';
import { getRoundClass } from '../_shared/style-class';

const props = defineProps(inputProps);

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
const inputWidth = ref();
// 数字输入框当前值
const realValue = ref(toInputString(props.modelValue ?? props.defaultValue));
// 当前input文本值
const inputText = ref(realValue.value);
// 监听属性变化，刷新值
watch(
  () => props.modelValue,
  (val) => {
    // console.log('watch', val);
    realValue.value = toInputString(val);
    inputText.value = realValue.value;
  }
);

// 输入框显示的字符串
const displayValue = computed(() => {
  const v = isFunction(props.format) ? props.format(realValue.value) : realValue.value;
  // console.log('displayValue', v, realValue.value);
  return v;
});

// 是否聚焦状态
const isFocus = ref(false);
let lastValue: string = realValue.value;
const isClearable = computed(() => props.clearable && !props.disabled && !props.readonly);

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

  inputText.value = val;

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

const onMirrorResize = (en: ResizeObserverEntry) => {
  inputWidth.value = en.target.clientWidth;
};
const round = getRoundClass(props, 'input');
</script>
<template>
  <label
    class="o-input"
    :class="[
      `o-input-${props.color}`,
      `o-input-size-${props.size || defaultSize}`,
      round.class.value,
      {
        'o-input-disabled': props.disabled,
        'o-input-focus': isFocus,
      },
    ]"
    :style="round.style.value"
    @mousedown="onMouseDown"
  >
    <span v-if="$slots.prepend" class="o-input-prepend">
      <slot name="prepend"></slot>
    </span>
    <div
      class="o-input-wrap"
      :class="{
        'o-input-clearable': isClearable && realValue !== '',
        'has-suffix': $slots.suffix,
        'has-prepend': $slots.prepend,
        'has-append': $slots.append,
        'is-focus': isFocus,
        'is-readonly': props.readonly,
      }"
    >
      <div v-if="$slots.prefix" class="o-input-prefix">
        <slot name="prefix"></slot>
      </div>
      <div class="o-input-input-wrap">
        <input
          ref="inputRef"
          :value="displayValue"
          :type="type"
          :placeholder="props.placeholder"
          class="o-input-input"
          :class="{
            'is-auto-size': props.autoWidth,
          }"
          :style="{
            width: inputWidth + 'px',
          }"
          :readonly="props.readonly"
          :disabled="props.disabled"
          @focus="onFocus"
          @blur="onBlur"
          @input="onInput"
          @keydown="onKeyDown"
          @compositionstart="onCompositionStart"
          @compositionend="onCompositionEnd"
        />
        <OResizeObserver v-if="props.autoWidth" @resize="onMirrorResize">
          <div class="o-input-mirror">{{ inputText }}</div>
        </OResizeObserver>
      </div>
      <div v-if="props.clearable || $slots.suffix" class="o-input-suffix">
        <span v-if="$slots.suffix" class="o-input-suffix-wrap">
          <slot name="suffix"></slot>
        </span>
        <div v-if="isClearable" class="o-input-clear" @click="clearClick"><IconX class="o-input-clear-icon" /></div>
      </div>
    </div>
    <span v-if="$slots.append" class="o-input-append">
      <slot name="append"></slot>
    </span>
  </label>
</template>
