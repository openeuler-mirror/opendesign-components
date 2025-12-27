<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

let globalId = 0;
export default defineComponent({
  name: 'OIconChevronDownBold',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-chevron-down-bold', 'type-fill'];
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
      <path d="m18.214 9.877-.03.032-4.95 4.95a1.75 1.75 0 0 1-2.432.042l-.043-.042-4.95-4.95a.75.75 0 0 1-.216-.461l-.003-.046v-.046a.75.75 0 0 1 1.248-.538l.032.03 4.596 4.597a.75.75 0 0 0 1.029.03l.032-.03 4.596-4.596a.75.75 0 0 1 1.28.51v.046a.75.75 0 0 1-.189.472"/>
    </template>
  </svg>
</template>