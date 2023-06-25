<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'OIconDanger',
  svgType: 'color',
  setup() {
    const classnames = ['o-svg-icon', 'o-icon-danger', 'type-color'];
    return {
      classnames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classnames"><path fill="currentColor" d="M21 12c0 4.971-4.029 9-9 9s-9-4.029-9-9 4.029-9 9-9 9 4.029 9 9z"/><path fill="#fff" d="M12.989 12.989a.601.601 0 0 1 .766-.069l.083.069 2.271 2.271.032.035a.599.599 0 0 1-.765.902l-.084-.06-.035-.032-2.268-2.268a.6.6 0 0 1-.113-.689l.049-.084.064-.076zM7.895 7.895a.6.6 0 0 1 .727-.094l.086.062.035.032L12 11.151l3.257-3.256a.601.601 0 0 1 .674-.122l.091.052.083.069a.601.601 0 0 1 .092.73l-.06.084-.032.035-7.362 7.362a.601.601 0 0 1-.941-.73l.06-.084.032-.035 3.256-3.258-3.291-3.294a.599.599 0 0 1 .035-.81z"/></svg>
</template>