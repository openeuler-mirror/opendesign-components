<script setup lang="ts">
import { IconLinkPrefix, IconLinkArrow, IconLoading } from '../_shared/icons';

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
    <span v-if="$slots.iconPrefix || props.iconPrefix || props.loading" class="o-link-icon-wrap prefix">
      <IconLoading v-if="props.loading" class="o-rotating" />
      <slot v-else name="icon">
        <IconLinkPrefix />
      </slot>
    </span>
    <slot></slot>
    <span v-if="$slots.iconSuffix || props.iconSuffix" class="o-link-icon-wrap suffix">
      <slot name="iconSuffix"><IconLinkArrow class="o-link-icon-arrow" /></slot>
    </span>
  </a>
</template>
