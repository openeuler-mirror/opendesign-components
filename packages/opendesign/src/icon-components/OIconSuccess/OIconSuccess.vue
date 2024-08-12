<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'OIconSuccess',
  svgType: 'color',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-success', 'type-color'];
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
      <path fill="currentColor" d="M21 12c0 4.971-4.029 9-9 9s-9-4.029-9-9 4.029-9 9-9 9 4.029 9 9"/><path fill="#fff" d="m16.21 8.679-5.225 5.212-.043.032c-.047.026-.12.016-.169-.032l-2.478-2.465-.076-.064a.6.6 0 0 0-.77.915l2.478 2.465.105.094a1.35 1.35 0 0 0 1.8-.096l5.225-5.212.064-.076a.601.601 0 0 0-.912-.774z"/>
    </template>
  </svg>
</template>