<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { OButton } from '../button';
import { buttonToggleProps } from './types';
import { isUndefined } from '../_shared/is';

const props = defineProps(buttonToggleProps);
const isChecked = ref(props.checked ?? props.defaultChecked);

const btnVariant = computed(() => (isChecked.value ? 'outline' : 'solid'));

const btnColor = computed(() => (isChecked.value ? 'primary' : 'normal'));

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
  if (props.disabled) {
    return;
  }
  isChecked.value = !isChecked.value;
  emits('update:checked', isChecked.value);
  emits('change', isChecked.value, ev);
};
</script>

<template>
  <OButton
    class="o-btn-toggle"
    :class="{ 'o-btn-toggle-checked': props.checked }"
    tag="div"
    size="medium"
    :round="props.round"
    :variant="btnVariant"
    :color="btnColor"
    :disabled="props.disabled"
    :icon="props.icon"
    @click="onClick"
  >
    <slot></slot>
    <template #icon>
      <slot name="icon"></slot>
    </template>
  </OButton>
</template>
