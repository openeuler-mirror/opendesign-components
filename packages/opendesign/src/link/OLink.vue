<script setup lang="ts">
import { configProviderInjectKey } from '../config-provider';
import { defaultSize } from '../_utils/global';
import { IconLinkArrow, IconLoading } from '../_utils/icons';
import HtmlTag from '../_components/html-tag';

import { linkProps } from './types';
import { inject, useAttrs } from 'vue';

const props = defineProps(linkProps);
const configProvider = inject(configProviderInjectKey, {});
const $attr = useAttrs();

const emits = defineEmits<{ (e: 'click', val: MouseEvent): void }>();
const onClick = (e: MouseEvent) => {
  if (props.disabled || props.loading) {
    e.preventDefault();
    return;
  }

  emits('click', e);

  if (props.global) {
    configProvider.link?.click(e, props, $attr);
  }
};
</script>
<template>
  <HtmlTag
    :tag="props.tag"
    class="o-link"
    :href="props.href"
    :target="props.target"
    :class="[
      {
        'o-link-disabled': props.disabled,
        'o-link-hover-bg': props.hoverBg,
        'o-link-hover-underline': props.hoverUnderline,
      },
      `o-link-${props.color}`,
      `o-link-${props.size || defaultSize}`,
    ]"
    v-bind="$attrs"
    @click="onClick"
  >
    <span v-if="$slots.icon || props.icon || props.loading" class="o-link-prefix">
      <IconLoading v-if="props.loading" class="o-rotating" />
      <slot v-else name="icon">
        <component :is="props.icon" />
      </slot>
    </span>
    <span class="o-link-label"><slot></slot></span>
    <span v-if="$slots.suffix || props.suffix" class="o-link-suffix">
      <slot name="suffix"><IconLinkArrow class="o-link-icon-arrow" /></slot>
    </span>
  </HtmlTag>
</template>
