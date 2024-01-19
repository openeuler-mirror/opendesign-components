<script setup lang="ts">
import { provide, ref, useSlots, onMounted, computed } from 'vue';
import { formInjectKey } from './provide';
import { formProps } from './types';
import { getFlexValue } from './form';
const props = defineProps(formProps);

const labelWidth = computed(() => props.labelWidth);
const align = computed(() => getFlexValue(props.labelAlign));
const justify = computed(() => getFlexValue(props.labelJustify));

provide(formInjectKey, {
  labelWidth,
});
</script>
<template>
  <div
    class="o-form"
    :class="[
      {
        'o-form-has-required': props.hasRequired,
      },
      `o-form-layout-${props.layout}`,
    ]"
    :style="{
      '--form-label-width': props.labelWidth,
      '--form-label-align': props.labelAlign,
      '--form-label-justify': justify,
      '--form-item-align': align,
    }"
  >
    <slot></slot>
  </div>
</template>
