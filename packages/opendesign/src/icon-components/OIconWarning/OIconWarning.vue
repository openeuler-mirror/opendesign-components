<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'OIconWarning',
  svgType: 'color',
  setup() {
    const classnames = ['o-svg-icon', 'o-icon-warning', 'type-color'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path fill="currentColor" d="M21 12c0 4.971-4.029 9-9 9s-9-4.029-9-9 4.029-9 9-9 9 4.029 9 9z"/><path fill="#fff" d="M12 13.621a.433.433 0 0 1-.432-.404l-.367-5.441-.002-.054c0-.408.306-.745.701-.795l.1-.006.054.002c.441.03.775.412.745.853l-.367 5.441a.433.433 0 0 1-.432.404zm0 3.15a1.1 1.1 0 1 1-.001-2.199A1.1 1.1 0 0 1 12 16.771z"/></svg>
</template>