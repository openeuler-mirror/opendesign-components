<script setup lang="ts">
import { rowProps } from './types';
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
  console.log(s);

  return s as StyleValue;
});
</script>
<template>
  <div class="o-row" :style="style">
    <slot></slot>
  </div>
</template>
