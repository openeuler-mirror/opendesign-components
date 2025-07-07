<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

let globalId = 0;
export default defineComponent({
  name: 'OIconArrowRight',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-arrow-right', 'type-fill'];
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
      <path d="m20.901 12.022-.002.005-.006.084a.7.7 0 0 1-.597.589l-.095.006H3.799a.7.7 0 0 1-.095-1.394l.095-.006 14.919.001-5.698-5.699a.7.7 0 0 1 .903-1.064l.087.074 6.539 6.539c.225.225.342.517.351.812l.001.037zm-7.868 7.359a.7.7 0 0 1-.073-.903l.074-.087 4.574-4.571a.7.7 0 0 1 .99.99l-4.574 4.571a.7.7 0 0 1-.99 0z"/>
    </template>
  </svg>
</template>