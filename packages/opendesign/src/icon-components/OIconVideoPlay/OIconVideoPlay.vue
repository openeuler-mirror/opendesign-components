<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'OIconVideoPlay',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-video-play', 'type-fill'];
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
      <path d="M21.386 14.373 6.645 22.506c-1.607.887-3.659.354-4.582-1.19a3.13 3.13 0 0 1-.446-1.606V3.444C1.617 1.663 3.12.22 4.973.22c.587 0 1.163.148 1.671.428l14.741 8.133c1.607.887 2.162 2.858 1.239 4.402a3.3 3.3 0 0 1-1.239 1.19z"/>
    </template>
  </svg>
</template>