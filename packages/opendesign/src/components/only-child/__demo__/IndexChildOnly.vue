<script setup lang="ts">
import { OChildOnly } from '../index';
import { OButton } from '../../button';
import '../../button/style';
import { ref, onMounted } from 'vue';
import SlotChid from './SlotChild.vue';

const child = ref(null);
const child2 = ref(null);
onMounted(async () => {
  console.log(child.value.$el);
  console.log(child2.value.$el);
});
</script>
<template>
  <div class="page-demo">
    <h2>child only</h2>
    <OChildOnly ref="child">
      123
      <OButton>button</OButton>
      <div>body</div>
    </OChildOnly>

    <h2>slot</h2>
    <OChildOnly ref="child2">
      <!-- 123 -->
      <SlotChid>
        <div>body</div>
      </SlotChid>
    </OChildOnly>
  </div>
</template>
<style lang="scss"></style>
