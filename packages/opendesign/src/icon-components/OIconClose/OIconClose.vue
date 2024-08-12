<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'OIconClose',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-close', 'type-fill'];
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
      <path d="M18.528 5.472a.7.7 0 0 1 .074.903l-.074.087L12.988 12l.006.006-.989.989-.006-.006-5.538 5.54a.7.7 0 0 1-1.064-.903l.074-.087L11.009 12 5.471 6.462l-.074-.087a.7.7 0 0 1 .977-.977l.087.074 5.538 5.539 5.539-5.539a.7.7 0 0 1 .99 0m-3.977 8.089 3.978 3.978.074.087a.7.7 0 0 1-.977.977l-.087-.074-3.978-3.978a.7.7 0 0 1 .99-.99"/>
    </template>
  </svg>
</template>