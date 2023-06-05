<script setup lang="ts">
import { defaultSize } from '../_shared/global';
import { IconLoading } from '../_shared/icons';
import { getRoundClass } from '../_shared/style-class';
import { buttonProps } from './types';
import HtmlTag from '../_shared/components/html-tag';
import { isEmptySlot } from '../_shared/vue-utils';

const props = defineProps(buttonProps);

const round = getRoundClass(props, 'btn');
</script>
<template>
  <HtmlTag
    :tag="!!props.href ? 'a' : props.tag"
    :href="props.href"
    type="button"
    class="o-btn"
    :class="[
      `o-btn-${props.color}`,
      `o-btn-${props.size || defaultSize}`,
      `o-btn-${props.variant}`,
      round.class.value,
      {
        'o-btn-icon-only': isEmptySlot($slots.default) && (props.icon || $slots.icon),
        'o-btn-disabled': props.disabled,
      },
    ]"
    :style="round.style.value"
  >
    <span v-if="props.icon || $slots.icon || props.loading" class="o-btn-prefix" :class="{ loading: props.loading }">
      <IconLoading v-if="props.loading" class="o-rotating" />
      <slot v-else name="icon">
        <component :is="props.icon" />
      </slot>
    </span>
    <slot></slot>
    <span v-if="$slots.suffix" class="o-btn-suffix">
      <slot name="suffix"></slot>
    </span>
  </HtmlTag>
</template>
