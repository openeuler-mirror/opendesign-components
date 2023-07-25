<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'OIconChevronDown',
  svgType: 'fill',
  setup() {
    const classnames = ['o-svg-icon', 'o-icon-chevron-down', 'type-fill'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path d="M5.759 8.873a.7.7 0 0 1 .918-.063l.072.063 5.016 5.016a.3.3 0 0 0 .37.043l.054-.043 5.062-5.062a.7.7 0 0 1 1.053.918l-.063.072-5.062 5.062a1.7 1.7 0 0 1-2.296.099l-.108-.099-5.016-5.016a.7.7 0 0 1 0-.99z"/></svg>
</template>