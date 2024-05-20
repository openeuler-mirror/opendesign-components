<script lang="ts" setup>
import { computed } from 'vue';
import { resultProps } from './types';
import { IconInfo, IconSuccess, IconWarning, IconDanger } from '../_utils/icons';

const props = defineProps(resultProps);

const iconMap = {
  info: IconInfo.value,
  success: IconSuccess.value,
  warning: IconWarning.value,
  danger: IconDanger.value,
};

const icon: any = computed(() => (props.status ? iconMap[props.status] : undefined));
</script>

<template>
  <div class="o-result" :class="{ [`o-result-${props.status}`]: props.status }">
    <div v-if="$slots.image" class="o-result-image">
      <slot name="image"></slot>
    </div>
    <div v-if="props.status || $slots.icon || props.title || $slots.title" class="o-result-header">
      <div v-if="props.status || $slots.icon" class="o-result-icon" :class="{ 'o-result-icon-custom': $slots.icon }">
        <slot name="icon">
          <component :is="icon" />
        </slot>
      </div>
      <div v-if="props.title || $slots.title" class="o-result-title">
        <slot name="title">{{ props.title }}</slot>
      </div>
    </div>

    <div v-if="props.description || $slots.description" class="o-result-description">
      <slot name="description">{{ props.description }}</slot>
    </div>
    <div v-if="$slots.extra" class="o-result-extra">
      <slot name="extra"></slot>
    </div>
    <div v-if="$slots.default" class="o-result-content">
      <slot></slot>
    </div>
  </div>
</template>
