<script setup lang="ts">
import { IconLinkPrefix, IconLinkArrow, IconLoading } from '../_shared/icons';

import { linkProps } from './types';

const props = defineProps(linkProps);

const emits = defineEmits<{ (e: 'click', val: MouseEvent): void }>();
const onClick = (e: MouseEvent) => {
  if (props.disabled) {
    e.preventDefault();
    return;
  }
  if (!props.href) {
    e.preventDefault();
  }
  emits('click', e);
};
</script>
<template>
  <a
    class="o-link"
    :href="props.href"
    :target="props.target"
    :class="[
      {
        'o-link-disabled': props.disabled,
        'o-link-hoverable': props.hoverable,
      },
      `o-link-${props.color}`,
    ]"
    v-bind="$attrs"
    @click="onClick"
  >
    <span v-if="props.iconPrefix || $slots.iconPrefix || props.loading" class="o-link-icon prefix">
      <IconLoading v-if="props.loading" class="o-rotating" />
      <slot v-else-if="$slots.icon" name="icon"></slot>
      <IconLinkPrefix v-else />
    </span>
    <slot></slot>
    <span v-if="$slots.iconSuffix" class="o-link-icon suffix">
      <slot name="iconSuffix"></slot>
    </span>
    <span v-else-if="props.iconArrow" class="o-link-icon suffix arrow"><IconLinkArrow /></span>
  </a>
</template>
