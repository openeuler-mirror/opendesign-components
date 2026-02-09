<script setup lang="ts">
import { inject, watch, ref, useSlots, computed } from 'vue';
import { OIconCheckMark, OIconExclamationMark } from '../icon-components';
import { ODivider } from '../divider';
import { isEmptySlot } from '../_utils/vue-utils';
import { stepInjectKey } from './provide';
import { stepItemProps } from './types';

const props = defineProps(stepItemProps);
const slots = useSlots();

const stepInjection = inject(stepInjectKey);

const stepItemHeadRef = ref<HTMLDivElement>();

const isCustomIcon = computed(() => {
  return !isEmptySlot(slots.icon);
});

const hasTitle = computed(() => {
  return !isEmptySlot(slots.title) || props.title;
});

const hasDescription = computed(() => {
  return !isEmptySlot(slots.default) || props.description;
});

const defaultIcon = computed(() => {
  if (props.status === 'failed') {
    return OIconExclamationMark;
  }
  return OIconCheckMark;
});

watch(stepItemHeadRef, (val) => {
  if (val) {
    if (!stepInjection?.stepItemHeadRefs) {
      return;
    }
    stepInjection.stepItemHeadRefs.value[props.stepIndex] = val;
  }
});
</script>

<template>
  <div class="o-step-item" :class="[`o-step-item-${stepInjection?.props.direction}`, `o-step-item-${props.status}`]">
    <div ref="stepItemHeadRef" class="o-step-item-head">
      <ODivider class="o-step-item-line" :direction="stepInjection?.props.direction" :style="stepInjection?.stepItemDividerRects.value[props.stepIndex]" />
      <div class="o-step-item-symbol" :class="{ 'o-step-item-symbol-custom': isCustomIcon }">
        <slot name="icon">
          <template v-if="props.icon">
            <component class="o-step-item-icon" :is="typeof props.icon === 'boolean' ? defaultIcon : props.icon" />
          </template>
          <template v-else>
            {{ props.stepIndex! + 1 }}
          </template>
        </slot>
      </div>
    </div>

    <div class="o-step-item-main">
      <div v-if="hasTitle" class="o-step-item-title">
        <slot name="title">{{ props.title }}</slot>
      </div>
      <div v-if="hasDescription" class="o-step-item-desc">
        <slot>{{ props.description }}</slot>
      </div>
    </div>
  </div>
</template>
