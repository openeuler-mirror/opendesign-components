<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'OIconMinus',
  svgType: 'fill',
  setup() {
    const classnames = ['o-svg-icon', 'o-icon-minus', 'type-fill'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path d="m3.608 11.321.114-.009 16.555-.024a.7.7 0 0 1 .116 1.391l-.114.009-16.555.024a.7.7 0 0 1-.116-1.391z"/></svg>
</template>