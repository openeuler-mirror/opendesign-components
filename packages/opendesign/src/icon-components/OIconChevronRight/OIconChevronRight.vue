<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'OIconChevronRight',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-chevron-right', 'type-fill'];
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
    <svg viewBox="0 0 24 24" :class="classNames"><path d="M9.246 5.764a.7.7 0 0 0-.063.918l.063.072 5.016 5.016a.3.3 0 0 1 .043.37l-.043.054L9.2 17.256a.7.7 0 0 0 .918 1.053l.072-.063 5.062-5.062a1.7 1.7 0 0 0 .099-2.296l-.099-.108-5.016-5.016a.7.7 0 0 0-.99 0z"/></svg>
  </template>
</template>