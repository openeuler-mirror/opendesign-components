<script setup lang="ts">
import { rowProps, RowMediaT } from './types';
import { computed } from 'vue';

const props = defineProps(rowProps);

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

const lgGap = computed(() => {
  return getMediaGap(props.laptop);
});

const mdGap = computed(() => {
  return getMediaGap(props.pad);
});

const smGap = computed(() => {
  return getMediaGap(props.padV);
});

const xsGap = computed(() => {
  return getMediaGap(props.phone);
});
</script>
<template>
  <div
    class="o-row"
    :style="{
      justifyContent: props.justify,
      flexDirection: props.direction,
      alignItems: props.align,
      flexWrap: props.wrap,
      '--row-gap-x': gap?.x,
      '--row-gap-y': gap?.y,
      '--row-phone-gap-x': xsGap?.x,
      '--row-phone-gap-y': xsGap?.y,
      '--row-pad-v-gap-x': smGap?.x,
      '--row-pad-v-gap-y': smGap?.y,
      '--row-pad-gap-x': mdGap?.x,
      '--row-pad-gap-y': mdGap?.y,
      '--row-laptop-gap-x': lgGap?.x,
      '--row-laptop-gap-y': lgGap?.y,
    }"
    :class="{
      'o-row-phone': !!props.phone,
      'o-row-pad-v': !!props.padV,
      'o-row-pad': !!props.pad,
      'o-row-laptop': !!props.laptop,
    }"
  >
    <slot></slot>
  </div>
</template>
