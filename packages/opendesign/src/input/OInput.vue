<script setup lang="ts">
import { ref, computed, watch, inject } from 'vue';
import { defaultSize } from '../_utils/global';
import { isFunction } from '../_utils/is';
import { IconClose, IconEyeOn, IconEyeOff } from '../_utils/icons';
import { Enter } from '../_utils/keycode';
import { toInputString } from './input';
import { OResizeObserver } from '../resize-observer';
import { inputProps } from './types';
import { getRoundClass } from '../_utils/style-class';
import ClientOnly from '../_components/client-only';
import { uniqueId } from '../_utils/helper';
import { useComposition } from '../hooks/use-composition';
import { formItemInjectKey } from '../form/provide';
import { innerComponentInjectKey } from '../_components/provide';

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

const inputId = uniqueId('input');
const inputType = ref(props.type);

const innerComponentInject = inject(innerComponentInjectKey, null);
const isInnerInput = innerComponentInject?.isInnerInput;
const formItemInjection = isInnerInput ? null : inject(formItemInjectKey, null);

const color = computed(() => {
  if (formItemInjection?.fieldResult.value) {
    return formItemInjection?.fieldResult.value?.type;
  } else {
    return props.color;
  }
});

const formatFun = computed(() => (isFunction(props.format) ? props.format : (v: string) => v));
const parseFun = computed(() => (isFunction(props.parse) ? props.parse : (v: string) => v));
const checkValidFun = computed(() => (isFunction(props.checkValid) ? props.checkValid : () => true));

const inputRef = ref<HTMLElement | null>(null);
const inputWidth = ref();
// 数字输入框当前值
const realValue = ref(toInputString(props.modelValue ?? props.defaultValue));
// 当前input显示值
const inputText = ref(formatFun.value(realValue.value));
// 记录上一次值(chang事件或者外部prop改变后的值)
let lastValue: string = realValue.value;
// 记录上一次有效输入值
let lastValidInputText: string = inputText.value;
// 值可用状态
const isValid = ref(true);

const doCheckValid = (value: string) => {
  if (value === '') {
    isValid.value = true;
  } else {
    isValid.value = checkValidFun.value(value);
  }
  return isValid.value;
};
// 初始可用状态
doCheckValid(realValue.value);

// 是否聚焦状态
const isFocus = ref(false);
// 监听属性变化，刷新值
watch(
  () => props.modelValue,
  (val) => {
    // 内部值与传入不一致时，再处理
    if (realValue.value !== val) {
      realValue.value = toInputString(val);
      inputText.value = formatFun.value(realValue.value);

      if (doCheckValid(realValue.value)) {
        lastValue = realValue.value;
        lastValidInputText = realValue.value;
      }
    }
  }
);

const isClearable = computed(() => props.clearable && !props.disabled && !props.readonly);

let clickInside = false;

// 正在输入中文，处理输入过程中触发input事件
const composition = useComposition({ el: inputRef });
const onInput = (e: Event) => {
  if (composition.isComposing.value) {
    return;
  }
  const val = (e.target as HTMLInputElement)?.value;

  emits('input', val, e);
  realValue.value = val;
  inputText.value = val;

  // 有效数据再更改modelValue值
  if (doCheckValid(val)) {
    lastValidInputText = val;
    emits('update:modelValue', val);
  }
};

const onFocus = (e: FocusEvent) => {
  clickInside = false;
  if (isFocus.value) {
    return;
  }
  isFocus.value = true;
  if (isValid.value) {
    inputText.value = realValue.value;
  }
  emits('focus', realValue.value, e);
};

function updateValue(val: string) {
  let nowVal = val;
  if (!isValid.value) {
    if (isFunction(props.onInvalidChange)) {
      nowVal = props.onInvalidChange(val, lastValidInputText, lastValue);
      isValid.value = true;
    } else {
      return lastValue;
    }
  }
  let value = nowVal;
  if (nowVal !== lastValue) {
    value = parseFun.value(nowVal);
  }
  emits('update:modelValue', value);

  realValue.value = value;
  inputText.value = formatFun.value(realValue.value);

  if (lastValue !== value) {
    emits('change', value);
    lastValue = value;
    lastValidInputText = value;
    formItemInjection?.fieldHandlers.onChange?.(value);
  }
  return value;
}

const onBlur = (e: FocusEvent) => {
  if (clickInside) {
    clickInside = false;
    return;
  }
  isFocus.value = false;
  const val = (e.target as HTMLInputElement)?.value;
  const v = updateValue(val);
  emits('blur', v, e);
};

const onKeyDown = (e: KeyboardEvent) => {
  const keyCode = e.key || e.code;
  // 处理回车
  if (!composition.isComposing.value && keyCode === Enter.key) {
    const val = (e.target as HTMLInputElement)?.value;
    const v = updateValue(val);
    emits('pressEnter', v, e);
  }
};
// 清除值
const clearClick = (e: Event) => {
  // 清空值后，纠正不可用样式
  doCheckValid('');
  // 更新当前值
  updateValue('');
  emits('clear', e);
};
const onMouseDown = (e: MouseEvent) => {
  if ((e.target as HTMLInputElement) !== inputRef.value) {
    clickInside = true;
  }
};

const onMirrorResize = (en: ResizeObserverEntry) => {
  // + 1; 修复宽度为小数的情况
  inputWidth.value = en.target.clientWidth + 1;
};
const round = getRoundClass(props, 'input');

const isEyeOn = ref(false);
const toggleEye = (show?: boolean) => {
  if (show === undefined) {
    isEyeOn.value = !isEyeOn.value;
  } else {
    isEyeOn.value = show;
  }
  if (isEyeOn.value) {
    inputType.value = 'text';
  } else {
    inputType.value = 'password';
  }
};

const onEyeClick = () => {
  if (props.showPasswordOn === 'click') {
    toggleEye();
  }
};

const onEyeMouseUp = () => {
  if (isEyeOn.value) {
    toggleEye(false);

    window.removeEventListener('mouseup', onEyeMouseUp);
  }
};
const onEyeMouseDown = () => {
  if (props.showPasswordOn === 'mousedown') {
    toggleEye(true);
    window.addEventListener('mouseup', onEyeMouseUp);
  }
};
</script>
<template>
  <label
    class="o-input"
    :class="[
      `o-input-${color}`,
      `o-input-${props.variant}`,
      `o-input-${props.size || defaultSize}`,
      round.class.value,
      {
        'o-input-disabled': props.disabled,
        'o-input-focus': isFocus,
      },
    ]"
    :style="round.style.value"
    :for="inputId"
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
        'is-invalid': !isValid,
        'is-readonly': props.readonly,
        'is-disabled': props.disabled,
      }"
    >
      <div v-if="$slots.prefix" class="o-input-prefix">
        <slot name="prefix"></slot>
      </div>
      <div
        class="o-input-input-wrap"
        :style="{
          width: inputWidth + 'px',
        }"
      >
        <input
          :id="inputId"
          ref="inputRef"
          :value="inputText"
          :type="inputType"
          :placeholder="props.placeholder"
          class="o-input-input"
          :class="{
            'is-auto-size': props.autoWidth,
          }"
          :readonly="props.readonly"
          :disabled="props.disabled"
          @focus="onFocus"
          @blur="onBlur"
          @input="onInput"
          @keydown="onKeyDown"
        />
        <ClientOnly>
          <OResizeObserver v-if="props.autoWidth" @resize="onMirrorResize">
            <div class="o-input-mirror">{{ inputText }}</div>
          </OResizeObserver>
        </ClientOnly>
      </div>
      <div v-if="props.clearable || $slots.suffix || props.type === 'password'" class="o-input-suffix">
        <span v-if="$slots.suffix" class="o-input-suffix-wrap">
          <slot name="suffix"></slot>
        </span>
        <div v-if="isClearable" class="o-input-clear" @click="clearClick"><IconClose class="o-input-clear-icon" /></div>
        <div v-if="props.type === 'password'" class="o-input-eye" @click="onEyeClick" @mousedown="onEyeMouseDown" @mouseup="onEyeMouseUp">
          <IconEyeOn v-if="isEyeOn" class="o-input-eye-icon" /><IconEyeOff v-else class="o-input-eye-icon" />
        </div>
      </div>
    </div>
    <span v-if="$slots.append" class="o-input-append">
      <slot name="append"></slot>
    </span>
  </label>
</template>
