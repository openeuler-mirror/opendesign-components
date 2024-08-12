<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'OIconChevronUp',
  svgType: 'fill',
  setup() {
    const classNames = ['o-svg-icon', 'o-icon-chevron-up', 'type-fill'];
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
      <path d="M5.759 15.127a.7.7 0 0 0 .918.063l.072-.063 5.016-5.016a.3.3 0 0 1 .37-.043l.054.043 5.062 5.062a.7.7 0 0 0 1.053-.918l-.063-.072-5.062-5.062a1.7 1.7 0 0 0-2.296-.099l-.108.099-5.016 5.016a.7.7 0 0 0 0 .99"/>
    </template>
  </svg>
</template>