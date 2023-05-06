<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'IconAlert',
  svgType: 'fill',
  setup() {
    const classnames = ['o-icon', 'o-icon-alert', 'type-fill'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path d="M12.522 3.134c.176.096.32.239.418.413l8.925 15.875c.288.513.101 1.16-.418 1.445-.16.088-.339.134-.522.134H3.076a1.069 1.069 0 0 1-1.075-1.063c0-.181.047-.358.135-.516l8.925-15.875a1.082 1.082 0 0 1 1.462-.413zm-.518 13.821a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6zm-.009-8.139a.6.6 0 0 0-.6.6v6l.008.097a.6.6 0 0 0 1.192-.097v-6l-.008-.097a.6.6 0 0 0-.592-.503z"/></svg>
</template>