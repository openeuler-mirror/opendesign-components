<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'OIconClose',
  svgType: 'fill',
  setup() {
    const classnames = ['o-svg-icon', 'o-icon-close', 'type-fill'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path d="M18.528 5.472a.7.7 0 0 1 .074.903l-.074.087L12.988 12l.006.006-.989.989-.006-.006-5.538 5.54a.7.7 0 0 1-1.064-.903l.074-.087L11.009 12 5.471 6.462l-.074-.087a.7.7 0 0 1 .977-.977l.087.074 5.538 5.539 5.539-5.539a.7.7 0 0 1 .99 0zm-3.977 8.089 3.978 3.978.074.087a.7.7 0 0 1-.977.977l-.087-.074-3.978-3.978a.7.7 0 0 1 .99-.99z"/></svg>
</template>