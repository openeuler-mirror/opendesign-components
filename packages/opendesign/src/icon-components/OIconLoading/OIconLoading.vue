<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'OIconLoading',
  svgType: 'fill',
  setup() {
    const classnames = ['o-svg-icon', 'o-icon-loading', 'type-fill'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1zm0 2c-4.971 0-9 4.029-9 9s4.029 9 9 9 9-4.029 9-9-4.029-9-9-9z" opacity=".15"/><path d="M12 1c6.075 0 11 4.925 11 11a1 1 0 0 1-2 0 9 9 0 0 0-9-9 1 1 0 0 1 0-2z"/></svg>
</template>