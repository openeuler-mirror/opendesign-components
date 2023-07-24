<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'OIconArrowLeft',
  svgType: 'fill',
  setup() {
    const classnames = ['o-svg-icon', 'o-icon-arrow-left', 'type-fill'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path d="m3.099 12.022.002.005.006.084a.7.7 0 0 0 .597.589l.095.006h16.402a.7.7 0 0 0 .095-1.394l-.095-.006-14.919.001 5.698-5.699a.7.7 0 0 0-.903-1.064l-.087.074-6.539 6.539a1.196 1.196 0 0 0-.351.812l-.001.037v.015zm7.868 7.359a.7.7 0 0 0 .073-.903l-.074-.087-4.574-4.571a.7.7 0 0 0-.99.99l4.574 4.571a.7.7 0 0 0 .99 0z"/></svg>
</template>