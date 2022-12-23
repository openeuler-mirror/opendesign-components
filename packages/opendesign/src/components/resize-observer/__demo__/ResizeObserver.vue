<script setup lang="ts">
import { ref } from 'vue';
import { ResizeObserver } from '../index';
import { OButton } from '../../button';
import '../../button/style';

const content = ref('content text: ');
let cnt = 1;
const changeFn = () => {
  cnt++;
  content.value += `-${cnt} `;
};

const onResize = () => {
  console.log('resized');
};
</script>
<template>
  <h4>resize observer</h4>

  <ResizeObserver @resize="onResize">
    <div class="content" @click="changeFn">
      {{ content }}
    </div>
  </ResizeObserver>
  <div style="margin-top: 30px"></div>
  <ResizeObserver @resize="onResize">
    <OButton @click="changeFn">
      {{ content }}
    </OButton>
  </ResizeObserver>
</template>
<style lang="scss" scoped>
.content {
  display: inline-block;
}
</style>
