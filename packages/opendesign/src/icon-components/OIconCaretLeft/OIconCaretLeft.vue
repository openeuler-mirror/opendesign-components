<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'OIconCaretLeft',
  svgType: 'fill',
  setup() {
    const classnames = ['o-svg-icon', 'o-icon-caret-left', 'type-fill'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path d="m9.461 11.616 4.719-3.932a.5.5 0 0 1 .82.384v7.865a.5.5 0 0 1-.82.384l-4.719-3.932a.5.5 0 0 1 0-.768z"/></svg>
</template>