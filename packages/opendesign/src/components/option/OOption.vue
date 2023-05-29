<script setup lang="ts">
import { computed, inject, ref, watchEffect } from 'vue';
import { selectOptionInjectKey } from '../select/provide';
import { optionProps } from './types';
import { OCheckbox } from '../checkbox';

const props = defineProps(optionProps);

const selectInject = inject(selectOptionInjectKey, null);

const isMultiple = selectInject?.multiple;

const currentVal = computed(() => {
  return selectInject?.selectValue.value;
});

const isActive = ref(false);
watchEffect(() => {
  const old = isActive.value;
  isActive.value = !!currentVal.value?.includes(props.value);

  if (isActive.value && old !== isActive.value) {
    // 初始化select的值、相应modelValue变化

    selectInject?.select(
      {
        label: props.label || `${props.value}`,
        value: props.value,
      },
      false
    );
  }
});

const clickOption = () => {
  if (!props.disabled) {
    selectInject?.select(
      {
        label: props.label || `${props.value}`,
        value: props.value,
      },
      true
    );
  }
};
</script>
<template>
  <div
    class="o-option"
    :class="[
      {
        active: isActive,
        'o-option-disabled': props.disabled,
        'o-option-multiple': isMultiple,
      },
    ]"
    @click="clickOption"
  >
    <OCheckbox v-if="isMultiple" :model-value="(currentVal as Array<string|number>)" :value="props.value" class="o-option-checkbox" :disabled="props.disabled">
      <slot>{{ props.label || `${props.value}` }}</slot>
    </OCheckbox>
    <slot v-else>{{ props.label || `${props.value}` }}</slot>
  </div>
</template>
