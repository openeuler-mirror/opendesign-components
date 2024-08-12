<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'OIconDoubleArrowUp',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-double-arrow-up', 'type-fill'];
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
      <path d="M18.055 17.738a.74.74 0 0 0-.002-1.022l-4.948-4.957a1.7 1.7 0 0 0-2.296.099q-.628.629-4.863 4.811l-.063.072a.7.7 0 0 0 1.053.918l4.863-4.811.054-.043a.3.3 0 0 1 .37.043l4.842 4.89.072.063a.7.7 0 0 0 .918-.063m0-5.303a.7.7 0 0 0 0-.99l-4.842-4.89-.108-.099c-.668-.563-1.634-.567-2.296.099q-.662.666-4.863 4.811l-.063.072a.7.7 0 0 0 1.053.918l4.863-4.811.054-.043a.3.3 0 0 1 .37.043l4.842 4.89.072.063a.7.7 0 0 0 .918-.063"/>
    </template>
  </svg>
</template>