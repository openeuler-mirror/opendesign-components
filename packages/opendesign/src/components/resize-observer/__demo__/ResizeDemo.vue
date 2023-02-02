<script setup lang="ts">
import { reactive, ref } from 'vue';
import { OResizeObserver } from '../index';
import { OButton } from '../../button';
import '../../button/style';

const content = ref('content text: ');
const listener = ref(true);
let cnt = 1;
const changeFn = () => {
  cnt++;
  content.value += `-${cnt} `;
  listener.value = cnt !== 3;
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

const onResize = (entry: ResizeObserverEntry, isfirst: boolean, size: 'size1' | 'size2') => {
  console.log('onResize', isfirst, entry.target);

  rlt[size].width = entry.contentRect.width;
  rlt[size].height = entry.contentRect.height;
};

const toggle = (key: 'visible1' | 'visible2') => {
  rlt[key] = !rlt[key];
};
</script>
<template>
  <h4>resize observer</h4>

  <OResizeObserver @resize="(en, isfirst) => onResize(en, isfirst, 'size1')">
    <div v-if="rlt.visible1" class="content" :name="content" @click="changeFn">
      {{ content }}
    </div>
    <p v-else class="content" @click="changeFn">changed: {{ content }}</p>
    <div @click="toggle('visible1')">toggle</div>
  </OResizeObserver>
  <div class="tip">width: {{ rlt.size1.width }}; height: {{ rlt.size1.height }}</div>

  <OResizeObserver @resize="(en, isfirst) => onResize(en, isfirst, 'size2')">
    <OButton v-if="rlt.visible2" @click="changeFn">
      {{ content }}
    </OButton>
    <div @click="toggle('visible2')">toggle</div>
  </OResizeObserver>
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
