<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'IconX',
  svgType: 'fill',
  setup() {
    const classnames = ['o-icon', 'o-icon-x', 'type-fill'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path d="M19.778 4.222a.75.75 0 0 1 0 1.061L5.282 19.779a.75.75 0 1 1-1.061-1.061L10.939 12 4.221 5.283a.75.75 0 1 1 1.061-1.061L12 10.939l6.718-6.717a.75.75 0 0 1 1.061 0zm0 14.496a.75.75 0 1 1-1.061 1.061l-6.01-6.011 1.06-1.06 6.01 6.01z"/></svg>
</template>