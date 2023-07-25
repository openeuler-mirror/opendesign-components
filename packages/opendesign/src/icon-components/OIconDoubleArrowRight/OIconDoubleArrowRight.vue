<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'OIconDoubleArrowRight',
  svgType: 'fill',
  setup() {
    const classnames = ['o-svg-icon', 'o-icon-double-arrow-right', 'type-fill'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path d="M6.262 5.945a.74.74 0 0 1 1.022.002l4.957 4.948a1.7 1.7 0 0 1-.099 2.296c-.419.419-2.023 2.04-4.811 4.863l-.072.063a.7.7 0 0 1-.918-1.053l4.811-4.863.043-.054a.3.3 0 0 0-.043-.37l-4.89-4.842-.063-.072a.7.7 0 0 1 .063-.918zm5.303 0a.7.7 0 0 1 .99 0l4.89 4.842.099.108c.563.668.567 1.634-.099 2.296-.444.441-2.048 2.062-4.811 4.863l-.072.063a.7.7 0 0 1-.918-1.053l4.811-4.863.043-.054a.3.3 0 0 0-.043-.37l-4.89-4.842-.063-.072a.7.7 0 0 1 .063-.918z"/></svg>
</template>