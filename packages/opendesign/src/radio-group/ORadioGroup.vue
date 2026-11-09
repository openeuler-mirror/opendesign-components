<script lang="ts" setup>
import { computed, provide, ref, useId, watch } from 'vue';
import { radioGroupProps } from './types';
import { radioGroupInjectKey } from './provide';
import { isUndefined } from '../_utils/is';
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
 * @description 组内共享的 name 属性，优先使用 props.name，否则回退 useId 生成的稳定 id
 * useId 在同一 app 内按组件实例创建顺序生成稳定 id，双端渲染顺序一致，
 * 故服务端与客户端水合时天然一致（SSR 安全）。
 * 确保 group 内所有 radio 共享同一 name，启用原生方向键导航。
 * 采用 computed 派生而非 ref+watch：fallback 只生成一次，prop 变化时自动同步，
 * 无需在初始化与 watch 两处重复 prop 优先逻辑；注入侧类型同步声明为 ComputedRef，消费方式不变。
 */
const fallbackName = useId();
const groupName = computed(() => props.name || fallbackName);

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
