<script lang="ts" setup>
import { computed, provide, ref, watch } from 'vue';
import { checkboxGroupProps } from './types';
import { checkboxGroupInjectKey } from './provide';
import { isArray, isUndefined } from '../_utils/is';
import { useFormField } from '../_composables/use-form-field';
import { useI18n } from '../locale';

const props = defineProps(checkboxGroupProps);

// 复选组可访问名称：显式 ariaLabel 优先，未传回退 i18n 默认词条（与 ORadioGroup 同构）
const { t } = useI18n();

const emits = defineEmits<{
  (e: 'update:modelValue', val: Array<string | number>): void;
  (e: 'change', val: Array<string | number>, ev: Event): void;
}>();

// 表单注入，用于规则校验
const { effectiveDisabled, onChange: onFormItemChange } = useFormField(props);

const realValue = ref(isArray(props.modelValue) ? props.modelValue : props.defaultValue);

watch(
  () => props.modelValue,
  (val) => {
    if (isArray(val)) {
      realValue.value = val;
    }
  },
);

const isMinimum = computed(() => (isUndefined(props.min) ? false : realValue.value.length <= props.min));

const isMaximum = computed(() => (isUndefined(props.max) ? false : realValue.value.length >= props.max));

const updateModelValue = (val: Array<string | number>) => {
  realValue.value = val;
  emits('update:modelValue', val);
};

const onChange = (val: Array<string | number>, ev: Event) => {
  emits('change', val, ev);
  onFormItemChange();
};

provide(checkboxGroupInjectKey, {
  realValue,
  disabled: effectiveDisabled,
  isMinimum,
  isMaximum,
  updateModelValue,
  onChange,
});
</script>

<template>
  <div
    class="o-checkbox-group"
    :class="`o-checkbox-group-${props.direction}`"
    role="group"
    :aria-label="props.ariaLabel ?? t('checkbox.group')"
    :aria-describedby="props.ariaDescribedBy"
  >
    <slot></slot>
  </div>
</template>
