<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue';
import { OInput } from '../input';
import { InBox } from '../_components/in-box';
import { ipInputProps, type IpSegment } from './types';
import { Backspace } from '../_utils/keycode';
import { formateToString } from '../_utils/helper';
import { useFormField } from '../_composables/use-form-field';

type InstanceOfOInputT = InstanceType<typeof OInput>;

const props = defineProps(ipInputProps);

const emit = defineEmits<{
  /**
   * @zh-CN 输入框值更新
   * @en-US Input value update
   */
  (e: 'update:modelValue', value: string): void;
  /**
   * @zh-CN IP值改变时触发，valid表示IP是否合法，ip为当前IP值
   * @en-US Triggered when IP value changes, valid indicates whether the IP is valid, ip is the current IP value
   */
  (e: 'change', valid: boolean, ip: string): void;
}>();

const { effectiveColor: color, effectiveDisabled, effectiveSize, effectiveRound, onChange: onFormItemChange, blockChildInject } = useFormField(props);

/**
 * @description 阻断内嵌 OInput 的 FormItem inject，OIpInput 自身通过 useFormField 统一获取继承值
 */
blockChildInject();

const MAX_LEN = 3;
const MIN_NUM = 0;
const MAX_NUM = 255;
const reg = /\D/g;
const originObj = { value: '', invalid: false };

const inputRefs = ref<Array<InstanceOfOInputT>>([]);
const segmentsLen = computed(() => props.segmentsLen);

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

const handleUpdate = (index: number, v: string) => {
  ipSegments.value[index].value = v.replace(reg, '');

  adjustSegment(index);

  if (ipSegments.value[index].value.length === MAX_LEN && index < segmentsLen.value - 1) {
    focusNextInput(index);
  }
};

const handleKeydown = (e: KeyboardEvent, index: number) => {
  if (effectiveDisabled.value) {
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
    onFormItemChange();
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
    :size="effectiveSize"
    :disabled="effectiveDisabled"
    :round="effectiveRound"
    :readonly="props.readonly"
    :variant="props.variant"
  >
    <template v-for="(segment, index) in ipSegments" :key="index">
      <OInput
        :ref="(el) => (inputRefs[index] = el as InstanceOfOInputT)"
        class="o-ip-segment"
        show-length="never"
        :variant="props.variant"
        :readonly="props.readonly"
        :size="effectiveSize"
        :disabled="effectiveDisabled"
        :model-value="segment.value"
        :max-length="3"
        :input-on-outlimit="false"
        @keydown="handleKeydown($event, index)"
        @update:model-value="
          (v) => {
            handleUpdate(index, v);
          }
        "
      />
      <div v-if="index < ipSegments.length - 1" class="o-ip-separator"></div>
    </template>
  </InBox>
</template>
