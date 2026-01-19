<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

let globalId = 0;
export default defineComponent({
  name: 'OIconSun',
  svgType: 'color',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-sun', 'type-color'];
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
  <svg fill="none" viewBox="0 0 16 16" :class="classNames">
    <template v-if="isClient">
      <circle cx="8.001" cy="8" r="2.667" fill="currentColor"/><circle cx="8.001" cy="8" r="2.667" fill="currentColor"/><path fill="currentColor" stroke="currentColor" stroke-linecap="round" d="M8 2.462v.8m-.02 9.455v.8m5.538-5.518h-.8M3.262 7.98h-.8m9.437 3.919-.566-.566M4.566 4.566 4 4m0 7.899.566-.566m6.767-6.767L11.9 4"/>
    </template>
  </svg>
</template>