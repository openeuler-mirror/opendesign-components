<script setup lang="ts">
import { computed, inject, ref, toRefs, watch } from 'vue';
import { selectOptionInjectKey } from '../select/provide';
import { optionProps } from './types';
import { OCheckbox } from '../checkbox';

const props = defineProps(optionProps);

// label增加响应式，用于支持国际化切换语言
const { label, value } = toRefs(props);

const selectInject = inject(selectOptionInjectKey, null);

const isMultiple = selectInject?.multiple;

const currentVal = computed(() => {
  return selectInject?.selectValue.value;
});

const isActive = ref(false);
watch(
  [currentVal, value],
  () => {
    // 响应modelValue变化
    // 与 selectInject.select 拆分开，避免 modelValue 改变时，不必要地调用selectInject.select
    isActive.value = Boolean(currentVal.value?.includes(value.value));
  },
  // currentVal 会被 OSelect 通过数组下标及push方法修改，所以需要deep
  { immediate: true, deep: true }
);
watch(
  [value, label],
  ([newValue, newLabel]) => {
    // 初始化并同步 select 的候选项
    selectInject?.registerOption({
      label: newLabel || `${newValue}`,
      value: newValue,
    });
  },
  { immediate: true }
);

const clickOption = () => {
  if (!props.disabled) {
    selectInject?.select({
      label: label.value || `${value.value}`,
      value: value.value,
    });
  }
};
</script>
<template>
  <div class="o-option" @click="clickOption">
    <div
      class="o-option-item"
      :class="[
        {
          active: isActive,
          'o-option-disabled': props.disabled,
          'o-option-multiple': isMultiple,
        },
      ]"
    >
      <OCheckbox v-if="isMultiple" :model-value="currentVal" :value="props.value" class="o-option-checkbox" :disabled="props.disabled">
        <slot>{{ props.label || `${props.value}` }}</slot>
      </OCheckbox>
      <slot v-else>{{ props.label || `${props.value}` }}</slot>
    </div>
  </div>
</template>
