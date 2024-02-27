<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'OIconRefresh',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-refresh', 'type-fill'];
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
    <svg viewBox="0 0 24 24" :class="classNames"><path d="M14.802 2.836a9.535 9.535 0 0 1 3.928 2.341l-.001-1.251c0-.354.263-.647.605-.694l.095-.006c.354 0 .647.263.694.605l.006.095v2.653a.951.951 0 0 1-.839.944l-.111.006h-2.653a.7.7 0 0 1-.095-1.394l.095-.006 1.174-.001A8.171 8.171 0 0 0 4.189 9.601a8.172 8.172 0 1 0 15.751.432.7.7 0 0 1 1.359-.337A9.572 9.572 0 0 1 9.205 21.143 9.572 9.572 0 0 1 2.85 9.19a9.572 9.572 0 0 1 11.953-6.355z"/></svg>
  </template>
</template>