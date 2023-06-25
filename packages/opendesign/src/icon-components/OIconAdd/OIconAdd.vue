<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'OIconAdd',
  svgType: 'fill',
  setup() {
    const classnames = ['o-svg-icon', 'o-icon-add', 'type-fill'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path d="m3.608 11.302.114-.009 7.583-.011.012-7.58a.7.7 0 0 1 1.391-.112l.009.114-.024 16.555a.7.7 0 0 1-1.391.112l-.009-.114.01-7.574-7.579.01-.114-.009a.7.7 0 0 1-.002-1.382zm11.294-.026 5.374-.007.114.009a.7.7 0 0 1 .002 1.382l-.114.009-5.378.007a.699.699 0 0 1-.69-.584l-.009-.115c0-.387.314-.7.701-.701z"/></svg>
</template>