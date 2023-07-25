<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: Date;
  }>(),
  {
    modelValue: undefined,
  }
);

const emits = defineEmits<{
  (e: 'update:modelValue', value: Date): void;
}>();
</script>
<template>
  <div class="o-calendar"></div>
</template>
