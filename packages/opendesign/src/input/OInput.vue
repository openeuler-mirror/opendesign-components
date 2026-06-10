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
  /**
   * @zh-CN 输入框值变化时触发
   * @en-US Triggered when the input value changes
   */
  (e: 'update:modelValue', value: string): void;
  /**
   * @zh-CN 输入框值变化且失去焦点后触发
   * @en-US Triggered when the input value changes and loses focus
   */
  (e: 'change', value: string): void;
  /**
   * @zh-CN 输入内容时触发
   * @en-US Triggered when inputting content
   */
  (e: 'input', evt: Event, value: string): void;
  /**
   * @zh-CN 输入框失去焦点时触发
   * @en-US Triggered when the input loses focus
   */
  (e: 'blur', evt: FocusEvent): void;
  /**
   * @zh-CN 输入框获得焦点时触发
   * @en-US Triggered when the input gains focus
   */
  (e: 'focus', evt: FocusEvent): void;
  /**
   * @zh-CN 点击清除按钮时触发
   * @en-US Triggered when the clear button is clicked
   */
  (e: 'clear', evt?: Event): void;
  /**
   * @zh-CN 按下 Enter 键时触发
   * @en-US Triggered when the Enter key is pressed
   */
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

const inputId = ref(props.inputId);
onMounted(() => {
  if (!inputId.value) {
    inputId.value = uniqueId();
  }
});

defineExpose({
  /**
   * @zh-CN 聚焦输入框
   * @en-US Focus the input
   */
  focus: () => inInputRef.value?.focus(),
  /**
   * @zh-CN 取消输入框聚焦
   * @en-US Blur the input
   */
  blur: () => inInputRef.value?.blur(),
  /**
   * @zh-CN 清空输入内容
   * @en-US Clear the input value
   */
  clear: () => inInputRef.value?.clear(),
  /**
   * @zh-CN 获取原生 input 元素
   * @en-US Get the native input element
   */
  inputEl: () => inInputRef.value?.inputEl,
  /**
   * @zh-CN 切换密码显示/隐藏
   * @en-US Toggle password visibility
   */
  togglePassword: () => inInputRef.value?.togglePassword(),
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
        },
        {
          default: () =>
            h(
              InInput,
              {
                ref: (el) => {
                  inInputRef = el as InstanceType<typeof InInput>;
                },
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
                  'showLength',
                  'onlyNumericInput',
                ]),
                onChange: onChange,
                onInput: onInput,
                onFocus: onFocus,
                onBlur: onBlur,
                onPressEnter: onPressEnter,
                onClear: onClear,
                'onUpdate:modelValue': onUpdatedModelValue,
              },
              pick($slots, ['extra', 'prefix', 'suffix']),
            ),
          ...pick($slots, ['append', 'prepend']),
        },
      )
    "
  />
</template>
