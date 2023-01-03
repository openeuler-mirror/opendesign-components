<script setup lang="ts">
import { inject } from 'vue';
import { OptionProvideKey } from '../_shared/global';
import type { OptionValueT } from '../_shared/global';

interface OptionPropT {
  label?: string;
  value: string | number;
  disabled?: boolean;
}
const props = withDefaults(defineProps<OptionPropT>(), {
  value: '',
  label: '',
});

const val = inject(`${OptionProvideKey}/value`);
const updateFn = inject(`${OptionProvideKey}/update`) as (val: OptionValueT, emit?: boolean) => void;

if (props.value === val) {
  updateFn({
    label: props.label || `${props.value}`,
    value: props.value,
  });
}

const clickOption = () => {
  if (!props.disabled) {
    updateFn(
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
  <div class="o-option" :class="{ active: val === props.value, 'is-disabled': props.disabled }" @click="clickOption">
    <slot>{{ props.label || `${props.value}` }}</slot>
  </div>
</template>
