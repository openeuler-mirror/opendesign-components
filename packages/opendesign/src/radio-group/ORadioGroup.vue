<script lang="ts" setup>
import { provide, ref, watch } from 'vue';
import { radioGroupProps } from './types';
import { radioGroupInjectKey } from './provide';
import { isUndefined } from '../_utils/is';
import { uniqueId } from '../_utils/helper';
import { useI18n } from '../locale';
import { useFormField } from '../_composables/use-form-field';

const props = defineProps(radioGroupProps);
const { t } = useI18n();

const emits = defineEmits<{
  (e: 'update:modelValue', val: string | number | boolean): void;
  (e: 'change', val: string | number | boolean, ev: Event): void;
}>();

// 表单注入，用于规则校验
const { effectiveDisabled, onChange: onFormItemChange } = useFormField(props);

const realValue = ref(props.modelValue ?? props.defaultValue);

/**
 * @description 组内共享的 name 属性，优先使用 props.name，否则自动生成唯一 name
 * 确保 group 内所有 radio 共享同一 name，启用原生方向键导航
 */
const groupName = ref(props.name || uniqueId('radio-'));

watch(
  () => props.name,
  (val) => {
    if (val) {
      groupName.value = val;
    }
  },
);

watch(
  () => props.modelValue,
  (val) => {
    if (!isUndefined(val)) {
      realValue.value = val;
    }
  },
);

const updateModelValue = (val: string | number | boolean) => {
  realValue.value = val;
  emits('update:modelValue', val);
};

const onChange = (val: string | number | boolean, ev: Event) => {
  emits('change', val, ev);
  onFormItemChange();
};

provide(radioGroupInjectKey, {
  realValue,
  disabled: effectiveDisabled,
  name: groupName,
  updateModelValue,
  onChange,
});
</script>

<template>
  <div class="o-radio-group" :class="[`o-radio-group-${props.direction}`]" role="radiogroup" :aria-label="props.ariaLabel ?? t('radio.group')">
    <slot></slot>
  </div>
</template>
