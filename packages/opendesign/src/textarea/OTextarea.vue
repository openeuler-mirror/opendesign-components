<script setup lang="ts">
import { ref, h, computed } from 'vue';
import { textareaProps } from './types';

import { InBox } from '../_components/in-box';
import { InTextarea } from '../_components/in-textarea';
import { formateToString, pick } from '../_utils/helper';
import { useFormField } from '../_composables/use-form-field';
import { defaultRound } from '../_utils/global';

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

const {
  effectiveColor: color,
  effectiveDisabled,
  effectiveSize,
  effectiveRound,
  effectiveClearable,
  inputId: textareaId,
  isFocus,
  triggerFocus,
  triggerBlur,
  onChange: onFormItemChange,
  onInput: onFormItemInput,
} = useFormField(props, emits);

const inTextareaRef = ref<InstanceType<typeof InTextarea>>();

const originRound = computed(() => {
  return effectiveRound.value || defaultRound.value;
});

/**
 * @description 圆角归一化：textarea 为多行控件、高度不定，`pill` 若按 InBox
 * 通用逻辑（100vh 圆角）渲染，圆角会随文本域高度放大，故归一化为按控件尺寸
 * 的半高圆角 `--o-textarea-pill-radius`；显式自定义值与非 pill 值原样透传
 */
const round = computed(() => {
  return originRound.value === 'pill' ? 'var(--o-textarea-pill-radius)' : originRound.value;
});

const onInput = (e: Event) => {
  emits('input', e);
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
          size: effectiveSize,
          variant: props.variant,
          color: color,
          disabled: effectiveDisabled,
          readonly: props.readonly,
          round: originRound,
          focused: isFocus,
          style: { '--_box-radius': round },
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
                  'readonly',
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
                  'showLength',
                ]),
                disabled: effectiveDisabled,
                clearable: effectiveClearable,
                onChange: onChange,
                onInput: onInput,
                onFocus: onFocus,
                onBlur: onBlur,
                onClear: onClear,
                'onUpdate:modelValue': onUpdatedModelValue,
              },
              pick($slots, ['prefix', 'suffix']),
            ),
        },
      )
    "
  />
</template>
