<script setup lang="ts">
import { computed, type PropType } from 'vue';
import { OLink, type ColorT } from '@opensig/opendesign';
import { DocIconOutLink } from '@/icon-components';

const props = defineProps({
  href: {
    type: String,
    required: true,
  },
  target: {
    type: String as PropType<'_blank' | '_self' | '_parent' | '_top'>,
  },
  color: {
    type: String as PropType<ColorT>,
    default: 'primary',
  },
  hoverUnderline: {
    type: Boolean,
    default: true,
  },
  rel: {
    type: String,
  },
});
const isOutLink = computed(() => {
  const url = new URL(props.href, window.location.href);
  return url.origin !== window.location.origin;
});
const realTarget = computed(() => props.target ?? (isOutLink.value ? '_blank' : '_self'));
const realRel = computed(() => props.rel ?? (isOutLink.value ? 'noopener noreferrer nofollow' : undefined));
</script>
<template>
  <OLink v-bind="$attrs" :href="props.href" :color="props.color" :hover-underline="props.hoverUnderline" :target="realTarget" :rel="realRel"
    ><slot></slot><template v-if="isOutLink" #suffix><DocIconOutLink /></template
  ></OLink>
</template>
