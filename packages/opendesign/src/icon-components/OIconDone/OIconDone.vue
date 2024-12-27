<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

let globalId = 0;
export default defineComponent({
  name: 'OIconDone',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-done', 'type-fill'];
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
      <path d="M20.402 5.956a.7.7 0 0 1 1.063.904l-.074.087L10.9 17.412a1.45 1.45 0 0 1-1.936.101l-.11-.099-5.231-5.202a.7.7 0 0 1 .9-1.066l.087.074 5.231 5.202a.05.05 0 0 0 .048.013l.023-.013z"/>
    </template>
  </svg>
</template>