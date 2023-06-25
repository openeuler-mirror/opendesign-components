<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'OIconArrowDown',
  svgType: 'fill',
  setup() {
    const classnames = ['o-svg-icon', 'o-icon-arrow-down', 'type-fill'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path d="m11.978 20.901-.005-.002-.084-.006a.7.7 0 0 1-.589-.597l-.006-.095V3.799a.7.7 0 0 1 1.394-.095l.006.095-.001 14.919 5.699-5.698a.7.7 0 0 1 1.064.903l-.074.087-6.539 6.539a1.196 1.196 0 0 1-.812.351l-.037.001h-.015zm-7.359-7.868a.7.7 0 0 1 .903-.073l.087.074 4.571 4.574a.7.7 0 0 1-.99.99l-4.571-4.574a.7.7 0 0 1 0-.99z"/></svg>
</template>