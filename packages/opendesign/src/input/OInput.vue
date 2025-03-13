<script setup lang="ts">
import { computed, inject, ref, onMounted, h } from 'vue';
import { inputProps } from './types';
import { formItemInjectKey } from '../form/provide';
import { innerComponentInjectKey } from '../_components/provide';

import { InInput } from '../_components/in-input';
import { InBox } from '../_components/in-box';
import { formateToString, uniqueId, pick } from '../_utils/helper';

const props = defineProps(inputProps);

defineSlots<{
  default(): any;
  prepend(): any;
  append(): any;
  prefix(): any;
  suffix(): any;
}>();

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'input', evt: Event, value: string): void;
  (e: 'blur', evt: FocusEvent): void;
  (e: 'focus', evt: FocusEvent): void;
  (e: 'clear', evt?: Event): void;
  (e: 'pressEnter', evt: KeyboardEvent): void;
}>();

const innerComponentInject = inject(innerComponentInjectKey, null);
const formItemInjection = innerComponentInject?.isInnerInput ? null : inject(formItemInjectKey, null);

const inInputRef = ref<InstanceType<typeof InInput>>();

const color = computed(() => {
  if (formItemInjection?.fieldResult.value) {
    return formItemInjection?.fieldResult.value?.type || 'normal';
  }
  return props.color;
});

const onInput = (e: Event, value: string) => {
  emits('input', e, value);
  formItemInjection?.fieldHandlers.onInput?.();
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

const inputId = ref(props.inputId);
onMounted(() => {
  if (!inputId.value) {
    inputId.value = uniqueId();
  }
});
</script>
<template>
  <component
    :is="
      h(
        InBox,
        {
          class: 'o-input',
          size: props.size,
          variant: props.variant,
          color: color,
          disabled: props.disabled,
          readonly: props.readonly,
          round: props.round,
          focused: isFocus,
          for: inputId,
          onMousedown: onMouseDown,
        },
        {
          default: () =>
            h(
              InInput,
              {
                ref: 'inInputRef',
                class: [
                  'o-input-wrap',
                  {
                    'has-suffix': $slots.suffix,
                    'has-prepend': $slots.prepend,
                    'has-append': $slots.append,
                  },
                ],
                inputId: inputId,
                modelValue: formateToString(props.modelValue),
                defaultValue: formateToString(props.defaultValue),
                ...pick(props, [
                  'type',
                  'placeholder',
                  'disabled',
                  'readonly',
                  'clearable',
                  'format',
                  'showPasswordEvent',
                  'validate',
                  'valueOnInvalidChange',
                  'autoWidth',
                  'maxLength',
                  'minLength',
                  'getLength',
                  'inputOnOutlimit',
                ]),
                onChange: onChange,
                onInput: onInput,
                onFocus: onFocus,
                onBlur: onBlur,
                onPressEnter: onPressEnter,
                onClear: onClear,
                'onUpdate:modelValue': onUpdatedModelValue,
              },
              pick($slots, ['extra', 'prefix', 'suffix'])
            ),
          ...pick($slots, ['append', 'prepend']),
        }
      )
    "
  />
</template>
