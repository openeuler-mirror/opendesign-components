<script setup lang="ts">
import { inject, computed } from 'vue';
import { formItemProps } from './types';
import { formInjectKey } from './provide';
import { getFlexValue } from './form';
const props = defineProps(formItemProps);

const align = computed(() => getFlexValue(props.labelAlign));
const justify = computed(() => getFlexValue(props.labelJustify));
const tabInjection = inject(formInjectKey, null);

const requireSymbol = '*';
</script>
<template>
  <div
    class="o-form-item"
    :class="[
      {
        'is-required': props.required,
      },
    ]"
    :style="{
      '--form-label-width': props.labelWidth,
      '--form-label-align': align,
      '--form-label-justify': justify,
    }"
  >
    <div class="o-form-item-label">
      <span
        class="o-form-require-symbol"
        :class="{
          visible: props.required,
        }"
      >
        <slot name="symbol">{{ requireSymbol }}</slot>
      </span>
      <slot name="name">
        <span>{{ props.label }}</span>
      </slot>
    </div>
    <div class="o-form-item-main">
      <slot></slot>
      <div v-if="$slots.extra" class="o-form-item-extra">
        <slot name="extra"> </slot>
      </div>
    </div>
  </div>
</template>
