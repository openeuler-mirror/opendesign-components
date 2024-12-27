<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

let globalId = 0;
export default defineComponent({
  name: 'OIconCaretLeft',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-caret-left', 'type-fill'];
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
      <path d="m9.461 11.616 4.719-3.932a.5.5 0 0 1 .82.384v7.865a.5.5 0 0 1-.82.384l-4.719-3.932a.5.5 0 0 1 0-.768z"/>
    </template>
  </svg>
</template>