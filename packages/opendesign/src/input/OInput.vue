<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { defaultSize } from '../_utils/global';
import { inputProps } from './types';
import { getRoundClass } from '../_utils/style-class';
import { formItemInjectKey } from '../form/provide';
import { innerComponentInjectKey } from '../_components/provide';

import { InInput, slotNames } from '../_components/in-input';
import { filterSlots } from '../_utils/vue-utils';
import { formateToString, uniqueId } from '../_utils/helper';

const props = defineProps(inputProps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'input', evt: Event): void;
  (e: 'blur', evt: FocusEvent): void;
  (e: 'focus', evt: FocusEvent): void;
  (e: 'clear', evt?: Event): void;
  (e: 'pressEnter', evt: KeyboardEvent): void;
}>();

const innerComponentInject = inject(innerComponentInjectKey, null);
const formItemInjection = innerComponentInject?.isInnerInput ? null : inject(formItemInjectKey, null);

const inInputRef = ref<InstanceType<typeof InInput>>();
const inputId = computed(() => props.inputId || uniqueId());

const color = computed(() => {
  if (formItemInjection?.fieldResult.value) {
    return formItemInjection?.fieldResult.value?.type;
  } else {
    return props.color;
  }
});

const onInput = (e: Event) => {
  emits('input', e);
};

let clickInside = false;
const isFocus = ref(false);
const onFocus = (e: FocusEvent) => {
  clickInside = false;
  if (isFocus.value) {
    return;
  }

  isFocus.value = true;
  emits('focus', e);
  formItemInjection?.fieldHandlers.onFocus?.();
};

const onBlur = (e: FocusEvent) => {
  if (clickInside) {
    clickInside = false;
    return;
  }
  isFocus.value = false;
  emits('blur', e);
  formItemInjection?.fieldHandlers.onBlur?.();
};

const onPressEnter = (e: KeyboardEvent) => {
  emits('pressEnter', e);
};

const onClear = (e?: Event) => {
  emits('clear', e);
};

const onUpdatedModelValue = (value: string) => {
  emits('update:modelValue', value);
};

const onChange = (value: string) => {
  emits('change', value);
  formItemInjection?.fieldHandlers.onChange?.();
};

const onMouseDown = (e: MouseEvent) => {
  if ((e.target as HTMLInputElement) !== inInputRef.value?.inputEl) {
    clickInside = true;
  }
};
const round = getRoundClass(props, 'input');
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
    @mousedown="onMouseDown"
    :for="inputId"
  >
    <span v-if="$slots.prepend" class="o-input-prepend">
      <slot name="prepend"></slot>
    </span>
    <InInput
      ref="inInputRef"
      class="o-input-wrap"
      :class="{
        'is-focus': isFocus,
        'is-readonly': props.readonly,
        'is-disabled': props.disabled,
        'has-suffix': $slots.suffix,
        'has-prepend': $slots.prepend,
        'has-append': $slots.append,
      }"
      :input-id="inputId"
      :model-value="formateToString(props.modelValue)"
      :default-value="formateToString(props.defaultValue)"
      :type="props.type"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :readonly="props.readonly"
      :clearable="props.clearable"
      :format="props.format"
      :show-password-event="props.showPasswordEvent"
      :validate="props.validate"
      :onInvalidChange="props.onInvalidChange"
      :auto-width="props.autoWidth"
      @change="onChange"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      @press-enter="onPressEnter"
      @clear="onClear"
      @update:model-value="onUpdatedModelValue"
    >
      <template v-for="name in filterSlots($slots, slotNames)" #[name]>
        <slot :name="name"></slot>
      </template>
    </InInput>
    <span v-if="$slots.append" class="o-input-append">
      <slot name="append"></slot>
    </span>
  </label>
</template>
