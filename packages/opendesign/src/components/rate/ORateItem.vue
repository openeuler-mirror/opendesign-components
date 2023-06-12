<script setup lang="ts">
import { rateItemProps } from './types';
import { IconStar } from '../_shared/icons';
const props = defineProps(rateItemProps);

const emits = defineEmits<{
  (e: 'hover', isHalf: boolean): void;
  (e: 'change', isHalf: boolean): void;
}>();

const onHover = (isHalf: boolean) => {
  emits('hover', isHalf);
};

const onClick = (isHalf: boolean) => {
  emits('change', isHalf);
};
</script>

<template>
  <div class="o-rate-item" :class="{ 'is-full': props.status === 'full', 'is-half': props.status === 'half' }">
    <span class="o-rate-icon o-rate-icon-top" @mouseenter="onHover(true)" @click="onClick(true)">
      <slot>
        <IconStar />
      </slot>
    </span>
    <span class="o-rate-icon o-rate-icon-bottom" @mouseenter="onHover(false)" @click="onClick(false)">
      <slot>
        <IconStar />
      </slot>
    </span>
  </div>
</template>
