<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'OIconSearch',
  svgType: 'fill',
  setup() {
    const classnames = ['o-svg-icon', 'o-icon-search', 'type-fill'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path d="m17.549 16.523.087.074 2.76 2.754a.7.7 0 0 1-.902 1.065l-.087-.074-2.76-2.754a.7.7 0 0 1 .902-1.065zM10.821 3.454a7.423 7.423 0 1 1 0 14.846 7.423 7.423 0 0 1 0-14.846zm0 1.4a6.023 6.023 0 1 0 0 12.046 6.023 6.023 0 0 0 0-12.046z"/></svg>
</template>