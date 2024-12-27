<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

let globalId = 0;
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
      globalId: globalId++,
    };
  },
});
</script>
<template>
  <svg viewBox="0 0 24 24" :class="classNames">
    <template v-if="isClient">
      <path d="M14.539 11.616 9.82 7.684a.5.5 0 0 0-.82.384v7.865a.5.5 0 0 0 .82.384l4.719-3.932a.5.5 0 0 0 0-.768z"/>
    </template>
  </svg>
</template>