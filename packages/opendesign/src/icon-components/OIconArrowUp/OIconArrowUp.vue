<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'OIconArrowUp',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-arrow-up', 'type-fill'];
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
  <template v-if="isClient">
    <svg viewBox="0 0 24 24" :class="classNames"><path d="m11.978 3.099-.005.002-.084.006a.7.7 0 0 0-.589.597l-.006.095v16.402a.7.7 0 0 0 1.394.095l.006-.095-.001-14.919 5.699 5.698a.7.7 0 0 0 1.064-.903l-.074-.087-6.539-6.539a1.196 1.196 0 0 0-.812-.351l-.037-.001h-.015zm-7.359 7.868a.7.7 0 0 0 .903.073l.087-.074 4.571-4.574a.7.7 0 0 0-.99-.99L4.619 9.976a.7.7 0 0 0 0 .99z"/></svg>
  </template>
</template>