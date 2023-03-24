<script setup lang="ts">
import { rowProps, mediaSize, RowPropsT, RowMediaT } from './types';
import { computed, StyleValue } from 'vue';

const props = defineProps(rowProps);

interface Vars {
  '--row-justify'?: string;
  '--row-wrap'?: string;
  '--row-direction'?: string;
  '--row-align'?: string;
  '--row-gap-x'?: string;
  '--col-gap-x'?: string;
  '--row-gap-y'?: string;
  '--col-gap-y'?: string;
  '--row-gap-x-xs'?: string;
  '--col-gap-x-xs'?: string;
  '--row-gap-y-xs'?: string;
  '--col-gap-y-xs'?: string;
  '--row-gap-x-s'?: string;
  '--col-gap-x-s'?: string;
  '--row-gap-y-s'?: string;
  '--col-gap-y-s'?: string;
  '--row-gap-x-m'?: string;
  '--col-gap-x-m'?: string;
  '--row-gap-y-m'?: string;
  '--col-gap-y-m'?: string;
  '--row-gap-x-l'?: string;
  '--col-gap-x-l'?: string;
  '--row-gap-y-l'?: string;
  '--col-gap-y-l'?: string;
  '--row-gap-x-xl'?: string;
  '--col-gap-x-xl'?: string;
  '--row-gap-y-xl'?: string;
  '--col-gap-y-xl'?: string;
  '--row-gap-x-xxl'?: string;
  '--col-gap-x-xxl'?: string;
  '--row-gap-y-xxl'?: string;
  '--col-gap-y-xxl'?: string;
}
const style = computed(() => {
  const s: Vars = {};
  if (props.justify) {
    s['--row-justify'] = props.justify;
  }
  if (props.direction) {
    s['--row-direction'] = props.direction;
  }
  if (props.wrap) {
    s['--row-wrap'] = props.wrap;
  }
  if (props.align) {
    s['--row-align'] = props.align;
  }
  if (props.gapX) {
    s['--col-gap-x'] = `calc(${props.gapX} / 2)`;
    s['--row-gap-x'] = `calc(-1 * ${props.gapX} / 2)`;
  }
  if (props.gapY) {
    s['--col-gap-y'] = props.gapY;
    s['--row-gap-y'] = `calc(-1 * ${props.gapY})`;
  }

  mediaSize.forEach((key) => {
    const v = props[key as keyof RowPropsT] as RowMediaT;
    if (v) {
      if (v.gapX) {
        s[`--col-gap-x-${key}` as keyof Vars] = `calc(${v.gapX} / 2)`;
        s[`--row-gap-x-${key}` as keyof Vars] = `calc(-1 * ${v.gapX} / 2)`;
      }
      if (v.gapY) {
        s[`--col-gap-y-${key}` as keyof Vars] = `calc(${v.gapY} / 2)`;
        s[`--row-gap-y-${key}` as keyof Vars] = `calc(-1 * ${v.gapY} / 2)`;
      }
    }
  });
  return s as StyleValue;
});
</script>
<template>
  <div class="o-row" :style="style">
    <slot></slot>
  </div>
</template>
