<script setup lang="ts">
import { reactive, ref } from 'vue';
import { ResizeObserver } from '../index';
import { OButton } from '../../button';
import '../../button/style';

const content = ref('content text: ');
let cnt = 1;
const changeFn = () => {
  cnt++;
  content.value += `-${cnt} `;
};

const rlt = reactive({
  size1: {
    width: 0,
    height: 0,
  },
  size2: {
    width: 0,
    height: 0,
  },
  visible1: true,
  visible2: true,
});

const onResize = (entry: ResizeObserverEntry, size: 'size1' | 'size2') => {
  rlt[size].width = entry.contentRect.width;
  rlt[size].height = entry.contentRect.height;
};

const toggle = (key: 'visible1' | 'visible2') => {
  rlt[key] = !rlt[key];
};
</script>
<template>
  <h4>resize observer</h4>

  <ResizeObserver @resize="(en) => onResize(en, 'size1')">
    <div v-if="rlt.visible1" class="content" :name="content" @click="changeFn">
      {{ content }}
    </div>
    <div v-else class="content" @click="changeFn">changed: {{ content }}</div>
    <div @click="toggle('visible1')">toggle</div>
  </ResizeObserver>
  <div class="tip">width: {{ rlt.size1.width }}; height: {{ rlt.size1.height }}</div>

  <ResizeObserver @resize="(en) => onResize(en, 'size2')">
    <OButton v-if="rlt.visible2" @click="changeFn">
      {{ content }}
    </OButton>
    <div @click="toggle('visible2')">toggle</div>
  </ResizeObserver>
  <div class="tip">width: {{ rlt.size2.width }}; height: {{ rlt.size2.height }}</div>
</template>
<style lang="scss" scoped>
.content {
  display: inline-block;
}
.tip {
  margin: 16px 0 32px;
}
</style>
