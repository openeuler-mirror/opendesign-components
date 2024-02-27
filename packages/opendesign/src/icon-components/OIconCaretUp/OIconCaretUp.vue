<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'OIconCaretUp',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-caret-up', 'type-fill'];
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
    <svg viewBox="0 0 24 24" :class="classNames"><path d="m12.384 9.461 3.932 4.719a.5.5 0 0 1-.384.82H8.067a.5.5 0 0 1-.384-.82l3.932-4.719a.5.5 0 0 1 .768 0z"/></svg>
  </template>
</template>