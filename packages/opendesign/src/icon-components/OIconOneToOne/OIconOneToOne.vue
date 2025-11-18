<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

let globalId = 0;
export default defineComponent({
  name: 'OIconOneToOne',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-one-to-one', 'type-fill'];
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
      <path fill-opacity=".8" fill-rule="evenodd" d="M8.58 8.5c-.24.24-.53.47-.88.68-.36.2-.69.33-1 .41v1.14c.64-.19 1.17-.47 1.59-.85v5.62h1.15v-7zM15.68 8.5c-.24.24-.53.47-.89.68-.35.2-.68.33-1 .41v1.14c.65-.19 1.18-.47 1.6-.85v5.62h1.15v-7z" class="one-to-one_svg__路径"/><circle cx="12.1" cy="10.2" r=".7" fill-opacity=".8" class="one-to-one_svg__椭圆 one-to-one_svg__122"/><circle cx="12.1" cy="13.7" r=".7" fill-opacity=".8" class="one-to-one_svg__椭圆 one-to-one_svg__123"/><path fill-opacity=".8" fill-rule="evenodd" d="M18.79 3c1.05 0 1.9.85 1.9 1.9v9.12c0 .39-.31.7-.69.7-.39 0-.71-.31-.71-.7V4.9c0-.28-.22-.5-.5-.5H5.19c-.27 0-.5.22-.5.5v13.6c0 .27.23.5.5.5h13.6c.28 0 .5-.23.5-.5v-2.13c0-.38.32-.7.71-.7a.7.7 0 0 1 .69.7v2.13c0 1.04-.85 1.9-1.9 1.9H5.19c-1.04 0-1.9-.86-1.9-1.9V4.9c0-1.05.86-1.9 1.9-1.9z" class="one-to-one_svg__路径"/>
    </template>
  </svg>
</template>