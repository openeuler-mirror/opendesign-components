<script setup lang="ts">
import { ref, watch, inject, nextTick } from 'vue';
import { buttonToggleProps } from './types';
import { getRoundClass } from '../_utils/style-class';
import { isUndefined } from '../_utils/is';
import { checkboxInjectKey } from '../checkbox/provide';
import { radioInjectKey } from '../radio/provide';

const checkboxInjection = inject(checkboxInjectKey, null);
const radioInjection = inject(radioInjectKey, null);

const props = defineProps(buttonToggleProps);

const round = getRoundClass(props, 'toggle');

const isChecked = ref(props.checked ?? props.defaultChecked);

const emits = defineEmits<{
  (e: 'update:checked', val: boolean): void;
  (e: 'change', val: boolean, ev: MouseEvent): void;
}>();

watch(
  () => props.checked,
  (val) => {
    if (!isUndefined(val)) {
      isChecked.value = val;
    }
  }
);

const onClick = (ev: MouseEvent) => {
  if (props.disabled || checkboxInjection || radioInjection) {
    return;
  }
  isChecked.value = !isChecked.value;
  emits('update:checked', isChecked.value);
  nextTick(() => {
    emits('change', isChecked.value, ev);
  });
};
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
    @click="onClick"
  >
    <span v-if="props.icon || $slots.icon" class="o-toggle-prefix">
      <slot name="icon">
        <component :is="props.icon" />
      </slot>
    </span>
    <slot></slot>
  </div>
</template>
