<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'OIconEllipsis',
  svgType: 'fill',
  setup() {
    const classnames = ['o-svg-icon', 'o-icon-ellipsis', 'type-fill'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path d="M12 10.5a1.5 1.5 0 1 1-.001 3.001A1.5 1.5 0 0 1 12 10.5zm-6.485 0a1.5 1.5 0 1 1-.001 3.001 1.5 1.5 0 0 1 .001-3.001zm12.997 0a1.5 1.5 0 1 1-.001 3.001 1.5 1.5 0 0 1 .001-3.001z"/></svg>
</template>