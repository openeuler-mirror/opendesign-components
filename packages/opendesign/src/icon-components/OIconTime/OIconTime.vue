<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

let globalId = 0;
export default defineComponent({
  name: 'OIconTime',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-time', 'type-fill'];
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
      <path d="M12 2.293a9.7 9.7 0 0 1 4.613 1.164.7.7 0 0 1-.667 1.231 8.307 8.307 0 0 0-12.254 7.311 8.307 8.307 0 0 0 8.307 8.307 8.307 8.307 0 0 0 6.208-13.827.7.7 0 1 1 1.046-.93 9.67 9.67 0 0 1 2.453 6.45c0 5.361-4.346 9.707-9.707 9.707s-9.707-4.346-9.707-9.707 4.346-9.707 9.707-9.707zm0 3.375c.354 0 .647.263.694.605l.006.095v5.976l-3.246 3.047a.699.699 0 0 1-1.034-.936l.077-.084 2.804-2.633V6.369c0-.354.263-.647.605-.694z"/>
    </template>
  </svg>
</template>