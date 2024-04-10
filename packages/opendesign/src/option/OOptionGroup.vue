<script setup lang="ts">
interface OptionPropT {
  name: string;
}
const props = defineProps<OptionPropT>();
</script>
<template>
  <div class="o-option-group">
    <div class="o-option-group-name">{{ props.name }}</div>
    <slot></slot>
  </div>
</template>
