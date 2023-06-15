<script setup lang="ts">
import { ref, watch } from 'vue';
import { buttonToggleProps } from './types';
import { getRoundClass } from '../_shared/style-class';
import { isUndefined } from '../_shared/is';

const props = defineProps(buttonToggleProps);

const round = getRoundClass(props, 'toggle');

const isChecked = ref(props.checked ?? props.defaultChecked);

// const emits = defineEmits<{
//   (e: 'update:checked', val: boolean): void;
//   (e: 'change', val: boolean, ev: MouseEvent): void;
// }>();

watch(
  () => props.checked,
  (val) => {
    if (!isUndefined(val)) {
      isChecked.value = val;
    }
  }
);

// const onClick = (ev: MouseEvent) => {
//   if (props.disabled) {
//     return;
//   }
//   isChecked.value = !isChecked.value;
//   emits('update:checked', isChecked.value);
//   emits('change', isChecked.value, ev);
// };
</script>

<template>
  <div
    class="o-toggle"
    :class="[
      round.class.value,
      {
        'o-toggle-disabled': props.disabled,
        'o-toggle-checked': isChecked,
      },
    ]"
  >
    <span v-if="props.icon || $slots.icon" class="o-toggle-prefix">
      <slot name="icon">
        <component :is="props.icon" />
      </slot>
    </span>
    <slot></slot>
  </div>
</template>
