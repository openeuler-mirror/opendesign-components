<script setup lang="ts">
import { flexProps, RowMediaT } from './types';
import { computed } from 'vue';

const props = defineProps(flexProps);

const getMediaGap = (opts?: RowMediaT) => {
  if (!opts) {
    return;
  }
  const { gapX, gapY, gap: gapXY } = opts;
  let gx = gapX;
  let gy = gapY;
  if (gapXY) {
    const [x, y] = gapXY.split(' ');
    gx = gx ?? x;
    gy = gy ?? y ?? gx;
  }
  return {
    x: gx === 'auto' ? undefined : gx,
    y: gy === 'auto' ? undefined : gy,
  };
};

const gap = computed(() => {
  return getMediaGap(props);
});
const xlGap = computed(() => {
  return getMediaGap(props.xl);
});

const lgGap = computed(() => {
  return getMediaGap(props.lg);
});

const mdGap = computed(() => {
  return getMediaGap(props.md);
});

const smGap = computed(() => {
  return getMediaGap(props.sm);
});

const xsGap = computed(() => {
  return getMediaGap(props.xs);
});
</script>
<template>
  <div
    class="o-flex"
    :style="{
      justifyContent: props.justify,
      flexDirection: props.direction,
      alignItems: props.align,
      flexWrap: props.wrap,
      '--flex-gap-x': gap?.x,
      '--flex-gap-y': gap?.y,
      '--flex-xs-gap-x': xsGap?.x,
      '--flex-xs-gap-y': xsGap?.y,
      '--flex-sm-gap-x': smGap?.x,
      '--flex-sm-gap-y': smGap?.y,
      '--flex-md-gap-x': mdGap?.x,
      '--flex-md-gap-y': mdGap?.y,
      '--flex-lg-gap-x': lgGap?.x,
      '--flex-lg-gap-y': lgGap?.y,
      '--flex-xl-gap-x': xlGap?.x,
      '--flex-xl-gap-y': xlGap?.y,
    }"
    :class="{
      'o-flex-xs': !!props.xs,
      'o-flex-sm': !!props.sm,
      'o-flex-md': !!props.md,
      'o-flex-lg': !!props.lg,
      'o-flex-xl': !!props.xl,
    }"
  >
    <slot></slot>
  </div>
</template>
