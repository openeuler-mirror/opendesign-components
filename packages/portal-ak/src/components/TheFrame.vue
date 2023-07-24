<script setup lang="ts">
import { computed } from 'vue';

interface PropsT {
  src: string;
}
const props = defineProps<PropsT>();

const src = computed(() => {
  return `${window.location.href.replace(/#\/.*/, '#')}${props.src}`;
});
</script>
<template>
  <div class="the-frame">
    <h3>Pad & Phone</h3>
    <iframe class="the-frame-iframe" :src="src"></iframe>
  </div>
</template>
<style lang="scss" scoped>
.the-frame {
  position: relative;
  width: 100%;
  height: 100%;
}
.the-frame-iframe {
  width: 360px;
  height: 720px;
  display: block;
  margin: 32px auto;
  border: 1px solid #ccc;
  box-shadow: var(--o-shadow-1);
}
</style>
