<script setup lang="ts">
import { inject } from 'vue';
import { selectOptionUpdateFnInjectKey, selectOptionValueInjectKey } from '../select/provide';

interface OptionPropT {
  label?: string;
  value: string | number;
  disabled?: boolean;
}

const props = withDefaults(defineProps<OptionPropT>(), {
  value: '',
  label: '',
});

const val = inject(selectOptionValueInjectKey);
const updateFn = inject(selectOptionUpdateFnInjectKey);

// 是否是select
const isInSelect = !!updateFn;

if (props.value === val?.value) {
  if (isInSelect) {
    updateFn({
      label: props.label || `${props.value}`,
      value: props.value,
    });
  }
}

const clickOption = () => {
  if (!props.disabled) {
    if (isInSelect) {
      updateFn(
        {
          label: props.label || `${props.value}`,
          value: props.value,
        },
        true
      );
    }
  }
};
</script>
<template>
  <div class="o-option" :class="{ active: val === props.value, 'is-disabled': props.disabled }" @click="clickOption">
    <slot>{{ props.label || `${props.value}` }}</slot>
  </div>
</template>
