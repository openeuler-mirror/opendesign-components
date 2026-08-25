<script setup lang="ts">
import { ref, h } from 'vue';
import { inputProps } from './types';

import { InInput } from '../_components/in-input';
import { InBox } from '../_components/in-box';
import { formateToString, pick } from '../_utils/helper';
import { useFormField } from '../_composables/use-form-field';

const props = defineProps(inputProps);

defineSlots<{
  default(): any;
  prepend(): any;
  append(): any;
  prefix(): any;
  suffix(): any;
  extra(): any;
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

const {
  effectiveColor: color,
  effectiveDisabled,
  effectiveSize,
  effectiveRound,
  effectiveClearable,
  inputId,
  isFocus,
  triggerFocus,
  triggerBlur,
  onChange: onFormItemChange,
  onInput: onFormItemInput,
} = useFormField(props, emits);

const inInputRef = ref<InstanceType<typeof InInput>>();

const onInput = (e: Event, value: string) => {
  emits('input', e, value);
  onFormItemInput();
};

const onFocus = (e: FocusEvent) => {
  if (isFocus.value) {
    return;
  }

  isFocus.value = true;
  emits('focus', e);
  triggerFocus(e);
};

const onBlur = (e: FocusEvent) => {
  isFocus.value = false;
  emits('blur', e);
  triggerBlur();
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
  onFormItemChange();
};

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
          size: effectiveSize,
          variant: props.variant,
          color: color,
          disabled: effectiveDisabled,
          readonly: props.readonly,
          round: effectiveRound,
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
                  'readonly',
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
                clearable: effectiveClearable,
                disabled: effectiveDisabled,
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
