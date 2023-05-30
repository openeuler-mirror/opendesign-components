<script lang="ts" setup>
import { resultProps } from './types';
import { OIconWarning, OIconDanger, OIconPoint, OIconSuccess } from '../icon-components';
import { computed } from 'vue';

const props = defineProps(resultProps);

// TODO:修改图标命名-->IconInfo、OIconSuccess、IconWarning、IconDanger、Icon500...支持全局配置图标
const iconMap = {
  info: OIconPoint,
  success: OIconSuccess,
  warning: OIconWarning,
  danger: OIconDanger,
};

const icon: any = computed(() => (props.status ? iconMap[props.status] : undefined));
</script>

<template>
  <div class="o-result" :class="{ [`o-result-${props.status}`]: props.status }">
    <div v-if="props.status || $slots.icon" class="o-result-icon" :class="{ 'o-result-icon-custom': $slots.icon }">
      <slot name="icon">
        <component :is="icon" />
      </slot>
    </div>
    <div v-if="props.title || $slots.title" class="o-result-title">
      <slot name="title">{{ props.title }}</slot>
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
