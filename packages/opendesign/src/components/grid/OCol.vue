<script setup lang="ts">
import { colProps, mediaSize, ColMediaT, ColPropsT } from './types';
import { computed, StyleValue } from 'vue';

const props = defineProps(colProps);
interface Vars {
  '--col-flex'?: string;
  '--col-grow'?: string | number;
  '--col-shrink'?: string | number;
  '--col-align'?: string;
  '--col-basis'?: string;
  '--col-basis-xs'?: string;
  '--col-basis-s'?: string;
  '--col-basis-m'?: string;
  '--col-basis-l'?: string;
  '--col-basis-xl'?: string;
  '--col-basis-xxl'?: string;
}
const style = computed(() => {
  const s: Vars = {};
  if (props.flex) {
    s['--col-flex'] = props.flex;
  }
  if (props.width) {
    s['--col-basis'] = props.width;
  }

  if (props.grow) {
    s['--col-grow'] = props.grow;
  }
  if (props.shrink) {
    s['--col-shrink'] = props.shrink;
  }
  if (props.align) {
    s['--col-align'] = props.align;
  }
  mediaSize.forEach((k) => {
    const v = props[k as keyof ColPropsT] as ColMediaT;
    if (v) {
      s[`--col-basis-${k}` as keyof Vars] = v.width;
    }
  });
  return s as StyleValue;
});
</script>
<template>
  <div
    class="o-col"
    :style="style"
    :class="{
      'o-col-xs': !!props.xs,
      'o-col-s': !!props.s,
      'o-col-m': !!props.m,
      'o-col-l': !!props.l,
      'o-col-xl': !!props.xl,
      'o-col-xxl': !!props.xxl,
    }"
  >
    <slot></slot>
  </div>
</template>
