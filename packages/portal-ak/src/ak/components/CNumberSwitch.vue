<script setup lang="ts">
import { onUnmounted, onMounted, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    speed?: number;
  }>(),
  {
    speed: 100,
  }
);

const isOne = ref(false);
let timer = 0;
onMounted(() => {
  timer = window.setInterval(() => {
    const r = Math.random();
    isOne.value = r > 0.5;
  }, props.speed);
});

onUnmounted(() => {
  clearInterval(timer);
  timer = 0;
});
</script>
<template>
  <div class="c-number-switch">
    <svg v-show="!isOne" viewBox="0 0 21 32">
      <path
        d="M11.771 0c4.545 0 8.229 3.907 8.229 8.727v14.545c0 4.82-3.684 8.727-8.229 8.727h-2.743c-4.545 0-8.229-3.907-8.229-8.727v-14.545c0-4.82 3.684-8.727 8.229-8.727h2.743zM11.771 5.818h-2.743c-1.446 0-2.631 1.187-2.735 2.692l-0.008 0.217v14.545c0 1.534 1.119 2.79 2.538 2.901l0.205 0.008h2.743c1.446 0 2.631-1.187 2.735-2.692l0.008-0.217v-14.545c0-1.534-1.119-2.79-2.538-2.901l-0.205-0.008z"
      />
    </svg>
    <svg v-show="isOne" viewBox="0 0 21 32">
      <path
        d="M14.514 0.723l0.001 30.477c0 0.442-0.358 0.8-0.8 0.8 0 0 0 0-0-0h-3.886c-0.442 0-0.8-0.358-0.8-0.8v-23.347l-4.502 1.451c-0.38 0.122-0.787-0.086-0.909-0.466-0.023-0.072-0.035-0.146-0.035-0.222v-4.681c0-0.593 0.363-1.126 0.914-1.344l6.18-2.44c0.253-0.1 0.524-0.151 0.796-0.151h2.318c0.399 0 0.723 0.324 0.723 0.723z"
      />
    </svg>
  </div>
</template>
<style lang="scss">
.c-number-switch {
  position: relative;
  width: var(--number-size, 32px);
  height: var(--number-size, 32px);
  display: flex;
  align-items: center;
  justify-content: center;
  > svg {
    width: 100%;
    position: absolute;
    fill: currentColor;
  }
}
</style>
