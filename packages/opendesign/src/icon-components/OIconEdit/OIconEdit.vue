<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'OIconEdit',
  svgType: 'fill',
  setup() {
    const classnames = ['o-svg-icon', 'o-icon-edit', 'type-fill'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path d="M20.047 19.523a.7.7 0 0 1 .095 1.394l-.095.006H4.532a.7.7 0 0 1-.095-1.394l.095-.006h15.515zm0-3.167a.7.7 0 0 1 .095 1.394l-.095.006h-6.47a.7.7 0 0 1-.095-1.394l.095-.006h6.47zM12.661 3.721a2.2 2.2 0 0 1 3.111 0l2.118 2.118a2.2 2.2 0 0 1 0 3.111l-8.058 8.058a2.2 2.2 0 0 1-1.489.643l-3.459.105a1 1 0 0 1-1.03-.969v-.03l.105-3.489a2.2 2.2 0 0 1 .643-1.489zm2.121.99a.8.8 0 0 0-1.131 0l-8.058 8.058a.8.8 0 0 0-.234.541l-.092 3.034 3.034-.092a.795.795 0 0 0 .449-.155l.092-.079L16.9 7.96a.8.8 0 0 0 0-1.131z"/></svg>
</template>