<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'OIconDoubleArrowDown',
  svgType: 'fill',
  setup() {
    const classnames = ['o-svg-icon', 'o-icon-double-arrow-down', 'type-fill'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path d="M18.055 6.262a.74.74 0 0 1-.002 1.022l-4.948 4.957a1.7 1.7 0 0 1-2.296-.099c-.419-.419-2.04-2.023-4.863-4.811l-.063-.072a.7.7 0 0 1 1.053-.918l4.863 4.811.054.043a.3.3 0 0 0 .37-.043l4.842-4.89.072-.063a.7.7 0 0 1 .918.063zm0 5.303a.7.7 0 0 1 0 .99l-4.842 4.89-.108.099c-.668.563-1.634.567-2.296-.099-.441-.444-2.062-2.048-4.863-4.811l-.063-.072a.7.7 0 0 1 1.053-.918l4.863 4.811.054.043a.3.3 0 0 0 .37-.043l4.842-4.89.072-.063a.7.7 0 0 1 .918.063z"/></svg>
</template>