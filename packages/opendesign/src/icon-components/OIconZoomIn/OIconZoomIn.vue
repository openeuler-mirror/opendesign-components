<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

let globalId = 0;
export default defineComponent({
  name: 'OIconZoomIn',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-zoom-in', 'type-fill'];
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
      <path fill-opacity=".8" fill-rule="evenodd" d="M18.138 6.023a8.7 8.7 0 0 1 1.037 2 8.6 8.6 0 0 1 .515 3.417 8.6 8.6 0 0 1-.806 3.236 8.7 8.7 0 0 1-1.256 1.962l3.835 3.834c.197.274.246.744 0 .99a.7.7 0 0 1-.904.074l-3.92-3.908a8.6 8.6 0 0 1-2.664 1.547 8.6 8.6 0 0 1-3.417.515 8.6 8.6 0 0 1-3.235-.806 8.7 8.7 0 0 1-2.698-1.96 8.65 8.65 0 0 1-1.801-2.95 8.643 8.643 0 0 1-.516-3.416 8.7 8.7 0 0 1 .223-1.563q.204-.858.584-1.672a8.7 8.7 0 0 1 1.96-2.698 8.65 8.65 0 0 1 2.949-1.801 8.7 8.7 0 0 1 2.264-.498A8.705 8.705 0 0 1 15.7 3.678c.33.212.423.637.211.967a.693.693 0 0 1-.966.212A7.4 7.4 0 0 0 12.28 3.81a7.2 7.2 0 0 0-2.558 0q-.62.11-1.22.329a7.246 7.246 0 0 0-2.474 1.51 7.3 7.3 0 0 0-1.646 2.264 7.3 7.3 0 0 0-.676 2.716 7.2 7.2 0 0 0 .433 2.866q.284.78.722 1.46.345.54.788 1.014a7.3 7.3 0 0 0 3.683 2.139 7.28 7.28 0 0 0 4.163-.25q.78-.285 1.46-.722.54-.346 1.014-.789a7.3 7.3 0 0 0 1.646-2.264 7.2 7.2 0 0 0 .676-2.715 7.2 7.2 0 0 0-.433-2.866 7.3 7.3 0 0 0-.87-1.68.693.693 0 0 1 .175-.975.693.693 0 0 1 .974.175" class="zoom-in_svg__合并"/><path fill-opacity=".8" fill-rule="evenodd" d="M11 15.8a.7.7 0 0 0 .7-.7v-3.3H15a.7.7 0 1 0 0-1.4h-3.3V7.1a.7.7 0 0 0-1.4 0v3.3H7a.7.7 0 0 0 0 1.4h3.3v3.3a.7.7 0 0 0 .7.7" class="zoom-in_svg__合并"/>
    </template>
  </svg>
</template>