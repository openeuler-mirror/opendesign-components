<script setup lang="ts">
import { computed, inject, ref, onMounted } from 'vue';
import { defaultSize } from '../_utils/global';
import { textareaProps } from './types';
import { getRoundClass } from '../_utils/style-class';
import { formItemInjectKey } from '../form/provide';

import { InTextarea, slotNames } from '../_components/in-textarea';
import { filterSlots } from '../_utils/vue-utils';
import { formateToString, uniqueId } from '../_utils/helper';

const props = defineProps(textareaProps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'input', evt: Event): void;
  (e: 'blur', evt: FocusEvent): void;
  (e: 'focus', evt: FocusEvent): void;
  (e: 'clear', evt?: Event): void;
}>();

const formItemInjection = inject(formItemInjectKey, null);

const inTextareaRef = ref<InstanceType<typeof InTextarea>>();

const color = computed(() => {
  if (formItemInjection?.fieldResult.value) {
    return formItemInjection?.fieldResult.value?.type;
  } else {
    return props.color;
  }
});

const onInput = (e: Event) => {
  emits('input', e);
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
  if ((e.target as HTMLInputElement) !== inTextareaRef.value?.inputEl) {
    clickInside = true;
  }
};
const round = getRoundClass(props, 'textarea');

const textareaId = ref(props.textareaId);
onMounted(() => {
  if (!textareaId.value) {
    textareaId.value = uniqueId();
  }
});
</script>
<template>
  <label
    class="o-textarea"
    :class="[
      `o-textarea-${color}`,
      `o-textarea-${props.variant}`,
      `o-textarea-${props.size || defaultSize}`,
      round.class.value,
      {
        'o-textarea-disabled': props.disabled,
        'o-textarea-focus': isFocus,
      },
    ]"
    :style="round.style.value"
    @mousedown="onMouseDown"
    :for="textareaId"
  >
    <div
      class="o-textarea-wrap"
      :class="{
        'is-focus': isFocus,
        'is-readonly': props.readonly,
        'is-disabled': props.disabled,
      }"
    >
      <div class="o-textarea-prepend">
        <slot name="prepend"></slot>
      </div>
      <InTextarea
        class="o-textarea-textarea"
        ref="inTextareaRef"
        :model-value="formateToString(props.modelValue)"
        :default-value="formateToString(props.defaultValue)"
        :scrollbar="props.scrollbar"
        :placeholder="props.placeholder"
        :disabled="props.disabled"
        :readonly="props.readonly"
        :clearable="props.clearable"
        :format="props.format"
        :validate="props.validate"
        :onInvalidChange="props.onInvalidChange"
        :auto-size="props.autoSize"
        :resize="props.resize"
        :rows="props.rows"
        :cols="props.cols"
        :get-length="props.getLength"
        :max-length="props.maxLength"
        :min-length="props.minLength"
        :input-on-outlimit="props.inputOnOutlimit"
        :textarea-id="textareaId"
        @change="onChange"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @clear="onClear"
        @update:model-value="onUpdatedModelValue"
      >
        <template v-for="name in filterSlots($slots, slotNames)" #[name]>
          <slot :name="name"></slot>
        </template>
      </InTextarea>
      <div class="o-textarea-append">
        <slot name="append"></slot>
      </div>
    </div>
  </label>
</template>
