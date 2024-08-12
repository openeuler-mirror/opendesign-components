<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'OIconArrowDown',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-arrow-down', 'type-fill'];
    const isClient = ref(false);
    onMounted(() => {
      isClient.value = true;
    });
    return {
      isClient,
      classNames,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classNames">
    <template v-if="isClient">
      <path d="m11.978 20.901-.005-.002-.084-.006a.7.7 0 0 1-.589-.597l-.006-.095V3.799a.7.7 0 0 1 1.394-.095l.006.095-.001 14.919 5.699-5.698a.7.7 0 0 1 1.064.903l-.074.087-6.539 6.539a1.2 1.2 0 0 1-.812.351l-.037.001zm-7.359-7.868a.7.7 0 0 1 .903-.073l.087.074 4.571 4.574a.7.7 0 0 1-.99.99l-4.571-4.574a.7.7 0 0 1 0-.99z"/>
    </template>
  </svg>
</template>