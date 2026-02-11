<script setup lang="ts">
import { ref, watch, onMounted, computed, inject } from 'vue';
import { OInput } from '../input';
import { InBox } from '../_components/in-box';
import { ipInputProps, type IpSegment } from './types';
import { formItemInjectKey } from '../form/provide';
import { Backspace } from '../_utils/keycode';
import { formateToString } from '../_utils/helper';

type InstanceOfOInputT = InstanceType<typeof OInput>;

const props = defineProps(ipInputProps);

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', valid: boolean, ip: string): void;
}>();

const MAX_LEN = 3;
const MIN_NUM = 0;
const MAX_NUM = 255;
const reg = /\D/g;
const originObj = { value: '', invalid: false };

const inputRefs = ref<Array<InstanceOfOInputT>>([]);
const segmentsLen = computed(() => props.segmentsLen);

const formItemInjection = inject(formItemInjectKey, null);

const color = computed(() => {
  if (formItemInjection?.fieldResult.value) {
    return formItemInjection?.fieldResult.value?.type || undefined;
  } else {
    return props.color;
  }
});

const initData = (data: typeof originObj, n: number) => {
  return Array(n)
    .fill(null)
    .map(() => ({ ...data }));
};

const ipSegments = ref<Array<IpSegment>>(initData(originObj, segmentsLen.value));

const validateSegment = (index: number) => {
  const val = ipSegments.value[index].value;
  const num = parseInt(val, 10);

  // 空串的情况
  if (Number.isNaN(num)) {
    ipSegments.value[index].invalid = false;
    return;
  }

  ipSegments.value[index].invalid = num < MIN_NUM || num > MAX_NUM;
};

const adjustSegment = (index: number) => {
  validateSegment(index);

  if (ipSegments.value[index].invalid) {
    ipSegments.value[index].value = formateToString(MAX_NUM);
  }
};

const initIpSegments = () => {
  if (!props.modelValue) return;

  const segments = props.modelValue.split('.');
  segments.forEach((val, index) => {
    if (index < segmentsLen.value) {
      ipSegments.value[index].value = val.replace(reg, '');
      adjustSegment(index);
    }
  });
};

const handleUpdate = (index: number, v: string) => {
  ipSegments.value[index].value = v.replace(reg, '');

  adjustSegment(index);

  if (ipSegments.value[index].value.length === MAX_LEN && index < segmentsLen.value - 1) {
    focusNextInput(index);
  }
};

const handleKeydown = (e: KeyboardEvent, index: number) => {
  if (props.disabled) {
    return;
  }

  if (e.key === Backspace.key && ipSegments.value[index].value === '' && index > 0) {
    focusPrevInput(index);
  }
};

const getValidIp = (): string => {
  const validSegments: string[] = [];
  let isValid = true;

  ipSegments.value.forEach((segment) => {
    const num = parseInt(segment.value, 10);
    if (isNaN(num) || num < MIN_NUM || num > MAX_NUM) {
      isValid = false;
    }
    validSegments.push(formateToString(num));
  });

  return isValid ? validSegments.join('.') : '';
};

const focusNextInput = (index: number) => {
  if (index < segmentsLen.value) {
    const nextInput = inputRefs.value[index + 1];
    nextInput?.focus();
  }
};

const focusPrevInput = (index: number) => {
  if (index > 0) {
    const prevInput = inputRefs.value[index - 1];
    prevInput?.focus();
  }
};

watch(
  () => props.modelValue,
  () => initIpSegments(),
  { immediate: true },
);

watch(
  ipSegments,
  () => {
    const ip = getValidIp();
    emit('update:modelValue', ip);
    emit('change', Boolean(ip), ip);
    formItemInjection?.fieldHandlers.onChange?.();
  },
  { deep: true },
);

onMounted(() => {
  initIpSegments();
});
</script>

<template>
  <InBox
    class="o-ip-input"
    :color="color"
    :size="props.size"
    :disabled="props.disabled"
    :round="props.round"
    :readonly="props.readonly"
    :variant="props.variant"
  >
    <template v-for="(segment, index) in ipSegments" :key="index">
      <OInput
        class="o-ip-segment"
        show-length="never"
        :variant="props.variant"
        :readonly="props.readonly"
        :size="props.size"
        :disabled="props.disabled"
        :modelValue="segment.value"
        :max-length="3"
        :input-on-outlimit="false"
        :ref="(el) => (inputRefs[index] = el as InstanceOfOInputT)"
        @keydown="handleKeydown($event, index)"
        @update:modelValue="
          (v) => {
            handleUpdate(index, v);
          }
        "
      />
      <div class="o-ip-separator" v-if="index < ipSegments.length - 1"></div>
    </template>
  </InBox>
</template>
