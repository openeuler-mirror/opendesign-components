<script setup lang="ts">
import { computed, inject, ref, toRefs, watchEffect } from 'vue';
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
watchEffect(() => {
  isActive.value = !!currentVal.value?.includes(value.value);

  // 初始化select的值、相应modelValue变化

  selectInject?.select(
    {
      label: label.value || `${value.value}`,
      value: value.value,
    },
    false
  );
});

const clickOption = () => {
  if (!props.disabled) {
    selectInject?.select(
      {
        label: label.value || `${value.value}`,
        value: value.value,
      },
      true
    );
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
