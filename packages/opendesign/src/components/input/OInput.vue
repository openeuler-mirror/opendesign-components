<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { defaultSize, defaultShape, SizeT, ShapeT } from '../_shared/global';
import { isNull, isUndefined } from '../_shared/is';
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
   * 是否可以清除
   */
  clearable?: boolean;
  /**
   * 是否是密码输入
   */
  type?: 'text' | 'password' | 'textarea' | 'number';
}
const props = withDefaults(defineProps<InputPropT>(), {
  value: '',
  size: undefined,
  shape: undefined,
  placeholder: '',
  type: 'text',
  clearable: true,
});

const emits = defineEmits<{
  (e: 'update:value', value: string | number): void;
  (e: 'change', value: string | number): void;
  (e: 'input', value: string | number, evt: Event): void;
  (e: 'blur', evt: FocusEvent): void;
  (e: 'focus', evt: FocusEvent): void;
  (e: 'clear', evt: Event): void;
  (e: 'pressEnter', value: string | number, evt: Event): void;
}>();

const currentValue = ref(props.value);
const isFocus = ref(false);

function updateValue(val: string) {
  if (props.type === 'number') {
    currentValue.value = parseInt(val);
  } else {
    currentValue.value = val;
  }

  emits('change', val);
  emits('update:value', val);
}

watch(
  () => props.value,
  (val) => {
    if (isNull(val) || isUndefined(val)) {
      currentValue.value = '';
    }
    if (currentValue.value !== val) {
      currentValue.value = val;
      emits('change', val);
    }
  }
);

// 正在输入中文，处理输入过程中触发input事件
let isComposing = false;

const onInput = (e: Event) => {
  if (isComposing) {
    return;
  }
  const val = (e.target as HTMLInputElement)?.value;
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
  emits('focus', e);
};

const onBlur = (e: FocusEvent) => {
  isFocus.value = false;
  emits('blur', e);
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
        :value="props.value ?? currentValue"
        :type="type"
        :placeholder="props.placeholder"
        class="o-input-input"
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
