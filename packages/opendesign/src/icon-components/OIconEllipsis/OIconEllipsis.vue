<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'OIconEllipsis',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-ellipsis', 'type-fill'];
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
    <svg viewBox="0 0 24 24" :class="classNames"><path d="M12 10.5a1.5 1.5 0 1 1-.001 3.001A1.5 1.5 0 0 1 12 10.5zm-6.485 0a1.5 1.5 0 1 1-.001 3.001 1.5 1.5 0 0 1 .001-3.001zm12.997 0a1.5 1.5 0 1 1-.001 3.001 1.5 1.5 0 0 1 .001-3.001z"/></svg>
  </template>
</template>