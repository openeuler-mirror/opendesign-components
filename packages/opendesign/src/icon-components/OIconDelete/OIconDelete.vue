<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'OIconDelete',
  svgType: 'fill',
  setup() {
    const classnames = ['o-svg-icon', 'o-icon-delete', 'type-fill'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path d="M19.154 5.295a.7.7 0 0 1 .095 1.394l-.095.006-12.201-.001.001 12.413c0 .17.12.311.28.344l.071.007h9.39a.35.35 0 0 0 .344-.28l.007-.071V8.637a.7.7 0 0 1 1.394-.095l.006.095v10.47c0 .919-.708 1.672-1.608 1.745l-.144.006h-9.39a1.751 1.751 0 0 1-1.745-1.608l-.006-.144-.001-12.413-.707.001A.7.7 0 0 1 4.75 5.3l.095-.006h14.308zm-9.143 4.449c.354 0 .647.263.694.605l.006.095v5.68a.7.7 0 0 1-1.394.095l-.006-.095v-5.68a.7.7 0 0 1 .7-.7zm3.942 0c.354 0 .647.263.694.605l.006.095v5.68a.7.7 0 0 1-1.394.095l-.006-.095v-5.68a.7.7 0 0 1 .7-.7zm-.301-6.555a.7.7 0 0 1 .095 1.394l-.095.006H9.68a.7.7 0 0 1-.095-1.394l.095-.006h3.972z"/></svg>
</template>