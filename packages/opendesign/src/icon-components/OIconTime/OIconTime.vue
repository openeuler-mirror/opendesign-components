<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'OIconTime',
  svgType: 'fill',
  setup() {
    const classnames = ['o-svg-icon', 'o-icon-time', 'type-fill'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path d="M12 2.293a9.67 9.67 0 0 1 4.613 1.164.7.7 0 0 1-.667 1.231 8.307 8.307 0 0 0-12.254 7.311 8.307 8.307 0 0 0 8.307 8.307 8.307 8.307 0 0 0 6.208-13.827.7.7 0 1 1 1.046-.93 9.671 9.671 0 0 1 2.453 6.45c0 5.361-4.346 9.707-9.707 9.707s-9.707-4.346-9.707-9.707c0-5.361 4.346-9.707 9.707-9.707zm0 3.375c.354 0 .647.263.694.605l.006.095v5.976l-3.246 3.047a.699.699 0 0 1-1.034-.936l.077-.084 2.804-2.633V6.369c0-.354.263-.647.605-.694l.095-.006z"/></svg>
</template>