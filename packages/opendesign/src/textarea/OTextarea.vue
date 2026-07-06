<script setup lang="ts">
import { computed, inject, ref, onMounted, h } from 'vue';
import { textareaProps } from './types';
import { formItemInjectKey } from '../form/provide';

import { InBox } from '../_components/in-box';
import { InTextarea } from '../_components/in-textarea';
import { formateToString, uniqueId, pick } from '../_utils/helper';

const props = defineProps(textareaProps);

const emits = defineEmits<{
  /**
   * @zh-CN 文本域值变化时触发
   * @en-US Triggered when the textarea value changes
   */
  (e: 'update:modelValue', value: string): void;
  /**
   * @zh-CN 文本域值改变后触发
   * @en-US Triggered when the textarea value changes
   */
  (e: 'change', value: string): void;
  /**
   * @zh-CN 文本域输入时触发
   * @en-US Triggered when inputting in the textarea
   */
  (e: 'input', evt: Event): void;
  /**
   * @zh-CN 文本域失焦时触发
   * @en-US Triggered when the textarea loses focus
   */
  (e: 'blur', evt: FocusEvent): void;
  /**
   * @zh-CN 文本域聚焦时触发
   * @en-US Triggered when the textarea gets focus
   */
  (e: 'focus', evt: FocusEvent): void;
  /**
   * @zh-CN 清空文本域内容时触发
   * @en-US Triggered when the textarea content is cleared
   */
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

const round = computed(()=>{
  return props.round === 'pill' ? 'var(--o-radius_control-l)' : props.round;
})

defineExpose({
  /**
   * @zh-CN 聚焦文本域
   * @en-US Focus the textarea
   */
  focus: () => inTextareaRef.value?.focus(),
  /**
   * @zh-CN 取消文本域聚焦
   * @en-US Blur the textarea
   */
  blur: () => inTextareaRef.value?.blur(),
  /**
   * @zh-CN 清空文本域内容
   * @en-US Clear the textarea value
   */
  clear: () => inTextareaRef.value?.clear(),
  /**
   * @zh-CN 获取原生 textarea 元素
   * @en-US Get the native textarea element
   */
  inputEl: () => inTextareaRef.value?.inputEl as HTMLTextAreaElement | undefined,
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
          round: round,
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
                  'showLength'
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
