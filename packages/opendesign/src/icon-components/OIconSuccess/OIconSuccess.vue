<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'OIconSuccess',
  svgType: 'color',
  setup() {
    const classnames = ['o-svg-icon', 'o-icon-success', 'type-color'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path fill="currentColor" d="M21 12c0 4.971-4.029 9-9 9s-9-4.029-9-9 4.029-9 9-9 9 4.029 9 9z"/><path fill="#fff" d="m16.21 8.679-5.225 5.212-.043.032c-.047.026-.12.016-.169-.032l-2.478-2.465-.076-.064a.6.6 0 0 0-.77.915l2.478 2.465.105.094a1.35 1.35 0 0 0 1.8-.096l5.225-5.212.064-.076a.601.601 0 0 0-.912-.774z"/></svg>
</template>