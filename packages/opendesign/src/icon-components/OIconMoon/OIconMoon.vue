<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

let globalId = 0;
export default defineComponent({
  name: 'OIconMoon',
  svgType: 'color',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-moon', 'type-color'];
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
      <path fill="currentColor" fill-rule="evenodd" d="M6.6 12.828q.418.072.85.072a4.95 4.95 0 0 0 2.72-.813 4.98 4.98 0 0 0 2.112-3.058q.117-.526.117-1.079a4.95 4.95 0 0 0-.388-1.927A4.9 4.9 0 0 0 10.95 4.45 4.93 4.93 0 0 0 7.45 3a5 5 0 0 0-1.108.125.43.43 0 0 0-.28.199.45.45 0 0 0 .129.612 3.14 3.14 0 0 1 1.144 3.84 3.147 3.147 0 0 1-3.763 1.806.43.43 0 0 0-.342.04.44.44 0 0 0-.213.27.46.46 0 0 0 .034.33 5 5 0 0 0 .764 1.089 5 5 0 0 0 1.025.846 4.9 4.9 0 0 0 1.76.67"/>
    </template>
  </svg>
</template>