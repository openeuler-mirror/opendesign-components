<script setup lang="ts">
import { reactive, ref } from 'vue';
import { OIntersectionObserver } from '../index';
import { OButton } from '../../button';
import '../../button/style';

const content = ref('');

const rlt = reactive({
  visible1: true,
  visible2: true,
});
const onIntersection = (isEnter: boolean, en: IntersectionObserverEntry) => {
  if (isEnter) {
    content.value = en.target.innerHTML;
  } else {
    content.value = '';
  }
};

const toggle = (key: 'visible1' | 'visible2') => {
  rlt[key] = !rlt[key];
};
</script>
<template>
  <h4>resize observer</h4>

  <div class="tip" @click="toggle('visible2')">enter into view: {{ content }}</div>
  <div class="wrap">
    <OIntersectionObserver @intersection="(isEnter:boolean, en) => onIntersection(isEnter, en)">
      <div v-if="rlt.visible1" class="content" :name="content">first row</div>
      <p v-else class="content">changed: first row</p>
      <div @click="toggle('visible1')">toggle</div>
    </OIntersectionObserver>
    <OIntersectionObserver @intersection="(isEnter:boolean, en) => onIntersection(isEnter, en)">
      <OButton v-if="rlt.visible2" @click="toggle('visible2')"> toggle btn</OButton>
    </OIntersectionObserver>
  </div>
</template>
<style lang="scss" scoped>
.content {
  display: inline-block;
}
.tip {
  position: sticky;
  top: 100px;
  margin: 16px 0 32px;
}
.wrap {
  height: 200vh;
  margin-top: 100vh;
}
</style>
