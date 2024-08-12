<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'OIconMinus',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-minus', 'type-fill'];
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
      <path d="m3.608 11.321.114-.009 16.555-.024a.7.7 0 0 1 .116 1.391l-.114.009-16.555.024a.7.7 0 0 1-.116-1.391"/>
    </template>
  </svg>
</template>