<script setup lang="ts">
import { IconLinkArrow, IconLoading } from '../_shared/icons';

import { linkProps } from './types';

const props = defineProps(linkProps);

const emits = defineEmits<{ (e: 'click', val: MouseEvent): void }>();
const onClick = (e: MouseEvent) => {
  if (props.disabled || props.loading) {
    e.preventDefault();
    return;
  }
  emits('click', e);
};
</script>
<template>
  <a
    class="o-link"
    :href="props.disabled ? void 0 : props.href"
    :target="props.target"
    :class="[
      {
        'o-link-disabled': props.disabled,
        'o-link-hover-bg': props.hoverBg,
        'o-link-hover-underline': props.hoverUnderline,
      },
      `o-link-${props.color}`,
    ]"
    v-bind="$attrs"
    @click="onClick"
  >
    <span v-if="$slots.icon || props.icon || props.loading" class="o-link-icon-wrap prefix">
      <IconLoading v-if="props.loading" class="o-rotating" />
      <slot v-else name="icon">
        <component :is="props.icon" />
      </slot>
    </span>
    <slot></slot>
    <span v-if="$slots.suffix || props.suffix" class="o-link-icon-wrap suffix">
      <slot name="suffix"><IconLinkArrow class="o-link-icon-arrow" /></slot>
    </span>
  </a>
</template>
