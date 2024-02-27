<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'OIconInfo',
  svgType: 'color',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-info', 'type-color'];
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
    <svg viewBox="0 0 24 24" :class="classNames"><path fill="currentColor" d="M21 12c0 4.971-4.029 9-9 9s-9-4.029-9-9 4.029-9 9-9 9 4.029 9 9z"/><path fill="#fff" d="M12 10.433a.6.6 0 0 0-.6.6v5.5l.008.099a.6.6 0 0 0 1.192-.099v-5.5l-.008-.099a.602.602 0 0 0-.592-.501zM12 7.3a1.1 1.1 0 1 0-.001 2.199A1.1 1.1 0 0 0 12 7.3z"/></svg>
  </template>
</template>