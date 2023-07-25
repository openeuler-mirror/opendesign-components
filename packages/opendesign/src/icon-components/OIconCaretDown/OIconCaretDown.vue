<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'OIconCaretDown',
  svgType: 'fill',
  setup() {
    const classnames = ['o-svg-icon', 'o-icon-caret-down', 'type-fill'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path d="m12.384 14.539 3.932-4.719a.5.5 0 0 0-.384-.82H8.067a.5.5 0 0 0-.384.82l3.932 4.719a.5.5 0 0 0 .768 0z"/></svg>
</template>