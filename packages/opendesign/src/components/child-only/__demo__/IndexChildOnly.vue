<script setup lang="ts">
import { OChildOnly } from '../index';
import { OButton } from '../../button';
import '../../button/style';
import { ref, onMounted, ComponentPublicInstance } from 'vue';
import SlotChid from './SlotChild.vue';

const child = ref<ComponentPublicInstance | null>(null);
onMounted(async () => {
  console.log(child.value?.$el);
});
</script>
<template>
  <div class="page-demo">
    <h2>child only</h2>
    <OChildOnly ref="child">
      <!-- 123 -->
      <OButton>button</OButton>
      <div>body</div>
    </OChildOnly>

    <h2>slot</h2>
    <SlotChid>
      <template #head>
        <div>head</div>
      </template>
      <div>body</div>
    </SlotChid>
  </div>
</template>
