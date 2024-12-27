<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

let globalId = 0;
export default defineComponent({
  name: 'OIconLoading',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-loading', 'type-fill'];
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
      <path d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1m0 2c-4.971 0-9 4.029-9 9s4.029 9 9 9 9-4.029 9-9-4.029-9-9-9" opacity=".15"/><path d="M12 1c6.075 0 11 4.925 11 11a1 1 0 0 1-2 0 9 9 0 0 0-9-9 1 1 0 0 1 0-2"/>
    </template>
  </svg>
</template>