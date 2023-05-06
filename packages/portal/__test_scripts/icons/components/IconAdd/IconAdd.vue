<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'IconAdd',
  svgType: 'fill',
  setup() {
    const classnames = ['o-icon', 'o-icon-add', 'type-fill'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path d="M12.125 2.15a.6.6 0 0 1 .592.503l.008.097v18.5a.6.6 0 0 1-1.192.097l-.008-.097v-8.426l-8.775.001a.7.7 0 0 1-.095-1.394l.095-.006 8.775-.001V2.75a.6.6 0 0 1 .6-.6zm9.125 9.375a.6.6 0 0 1 .097 1.192l-.097.008-7.25-.001v-1.199h7.25z"/></svg>
</template>