<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'OIconFile',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-file', 'type-fill'];
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
      <path d="M15.071 2.576c.223 0 .439.077.611.215l.098.09 3.963 4.192a.98.98 0 0 1 .259.546l.008.124v6.786a.7.7 0 0 1-1.394.095l-.006-.095-.001-6.302-2.137.001a1.9 1.9 0 0 1-1.894-1.752l-.006-.148-.001-2.353-8.781.013a.4.4 0 0 0-.392.32l-.008.081v15.233a.4.4 0 0 0 .321.392l.081.008 12.419-.018a.4.4 0 0 0 .392-.32l.008-.081v-2.446a.7.7 0 0 1 1.394-.095l.006.095v2.446c0 .944-.726 1.718-1.651 1.795l-.148.006-12.419.018a1.8 1.8 0 0 1-1.797-1.652l-.006-.148V4.388c0-.944.726-1.718 1.651-1.795l.148-.006 9.283-.013zm.365 12.759a.7.7 0 0 1 .095 1.394l-.095.006H8.563a.7.7 0 0 1-.095-1.394l.095-.006zm0-4.035a.7.7 0 0 1 .095 1.394l-.095.006H8.563a.7.7 0 0 1-.095-1.394l.095-.006zm-3.432-4.035a.7.7 0 0 1 .095 1.394l-.095.006H8.563a.7.7 0 0 1-.095-1.394l.095-.006zm5.58-.437-1.613-1.706.001 1.207a.5.5 0 0 0 .41.492l.09.008z"/>
    </template>
  </svg>
</template>