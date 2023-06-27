<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { defaultSize } from '../_utils/global';
import { datePickerProps } from './types';
import { getRoundClass } from '../_utils/style-class';
import { InputFrame } from '../_components/input-frame';
import { uniqueId } from '../_utils/helper';

const props = defineProps(datePickerProps);

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'clear', evt: Event): void;
}>();

const value1 = ref<string>('');
const inputId = uniqueId('input');

// 是否聚焦状态
const isFocus = ref(false);

const onFocus = (e: FocusEvent) => {
  // clickInside = false;
  if (isFocus.value) {
    return;
  }
  isFocus.value = true;
  // emits('focus', realValue.value, e);
};

const onBlur = (e: FocusEvent) => {
  // if (clickInside) {
  //   clickInside = false;
  //   return;
  // }
  isFocus.value = false;
  // const val = (e.target as HTMLInputElement)?.value;
  // const v = updateValue(val);
  // emits('blur', v, e);
};
</script>
<template>
  <InputFrame
    class="o-date-picker"
    :variant="props.variant"
    :color="props.color"
    :disabled="props.disabled"
    :size="props.size"
    :round="props.round"
    :readonly="props.readonly"
    :for="inputId"
  >
    <!-- <template #prepend>prepend</template> -->
    <div class="o-date-picker-wrap">
      <div class="o-date-picker-input1">
        <input
          :id="inputId"
          v-model="value1"
          type="text"
          :placeholder="props.placeholder"
          :disabled="props.disabled"
          :readonly="props.readonly"
          @focus="onFocus"
          @blur="onBlur"
        />
      </div>
    </div>
    <!-- <template #append>append</template> -->
  </InputFrame>
</template>
