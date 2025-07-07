<script setup lang="ts">
import { computed, inject, ref, onMounted, h } from 'vue';
import { textareaProps } from './types';
import { formItemInjectKey } from '../form/provide';

import { InBox } from '../_components/in-box';
import { InTextarea } from '../_components/in-textarea';
import { formateToString, uniqueId, pick } from '../_utils/helper';

const props = defineProps(textareaProps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'input', evt: Event): void;
  (e: 'blur', evt: FocusEvent): void;
  (e: 'focus', evt: FocusEvent): void;
  (e: 'clear', evt?: Event): void;
}>();

defineSlots<{
  prepend(): any;
  append(): any;
  suffix(): any;
}>();

const formItemInjection = inject(formItemInjectKey, null);

const inTextareaRef = ref<InstanceType<typeof InTextarea>>();

const color = computed(() => {
  if (formItemInjection?.fieldResult.value) {
    return formItemInjection?.fieldResult.value?.type || 'normal';
  } else {
    return props.color;
  }
});

const onInput = (e: Event) => {
  emits('input', e);
  formItemInjection?.fieldHandlers.onInput?.();
};

const isFocus = ref(false);
const onFocus = (e: FocusEvent) => {
  if (isFocus.value) {
    return;
  }

  isFocus.value = true;
  emits('focus', e);
  formItemInjection?.fieldHandlers.onFocus?.();
};

const onBlur = (e: FocusEvent) => {
  isFocus.value = false;
  emits('blur', e);
  formItemInjection?.fieldHandlers.onBlur?.();
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

const textareaId = ref(props.textareaId);
onMounted(() => {
  if (!textareaId.value) {
    textareaId.value = uniqueId();
  }
});

defineExpose({
  focus: () => inTextareaRef.value?.focus(),
  blur: () => inTextareaRef.value?.blur(),
  clear: () => inTextareaRef.value?.clear(),
  inputEl: () => inTextareaRef.value?.inputEl,
});
</script>
<template>
  <component
    :is="
      h(
        InBox,
        {
          class: 'o-textarea',
          size: props.size,
          variant: props.variant,
          color: color,
          disabled: props.disabled,
          readonly: props.readonly,
          round: props.round,
          focused: isFocus,
        },
        {
          default: () =>
            h(
              InTextarea,
              {
                ref: 'inTextareaRef',
                class: 'o-textarea-textarea',
                modelValue: formateToString(props.modelValue),
                defaultValue: formateToString(props.defaultValue),
                textareaId: textareaId,
                ...pick(props, [
                  'scrollbar',
                  'placeholder',
                  'disabled',
                  'readonly',
                  'clearable',
                  'format',
                  'validate',
                  'valueOnInvalidChange',
                  'autoSize',
                  'resize',
                  'rows',
                  'cols',
                  'getLength',
                  'maxLength',
                  'inputOnOutlimit',
                ]),
                onChange: onChange,
                onInput: onInput,
                onFocus: onFocus,
                onBlur: onBlur,
                onClear: onClear,
                'onUpdate:modelValue': onUpdatedModelValue,
              },
              pick($slots, ['prefix', 'suffix'])
            ),
        }
      )
    "
  />
</template>
