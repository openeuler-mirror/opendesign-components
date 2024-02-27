<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'OIconCaretRight',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-caret-right', 'type-fill'];
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
    <svg viewBox="0 0 24 24" :class="classNames"><path d="M14.539 11.616 9.82 7.684a.5.5 0 0 0-.82.384v7.865a.5.5 0 0 0 .82.384l4.719-3.932a.5.5 0 0 0 0-.768z"/></svg>
  </template>
</template>