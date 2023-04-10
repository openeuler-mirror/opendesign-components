<script setup lang="ts">
import { ref } from 'vue';
import { OLoading, vLoading, useLoading } from '../index';
import { OButton } from '../../button';
import '../../button/style';
import { IconAdd } from '../../icon';

const show1 = ref(false);
const showLoading1 = () => {
  show1.value = true;
  setTimeout(() => {
    show1.value = false;
  }, 1000);
};

const show2 = ref(false);
const show3 = ref(false);

const box1 = ref();
const l1 = useLoading();
const l2 = useLoading(box1, undefined);
const toggleLoading1 = () => {
  l1.show();
  setTimeout(() => {
    l1.hide();
  }, 1000);
};
const toggleLoading2 = () => {
  l2.show();
};
</script>
<template>
  <h4>全局</h4>
  <OButton @click="showLoading1">show1:{{ show1 }}</OButton>
  <OLoading v-model:visible="show1" to-body />
  <h4>局部</h4>
  <OButton @click="show2 = !show2">show2:{{ show2 }}</OButton>
  <section>
    <div class="box">
      show2
      <OLoading v-model:visible="show2" />
    </div>
    <div class="box">
      show2
      <OLoading v-model:visible="show2">自定义<IconAdd class="o-rotating" /></OLoading>
    </div>
  </section>
  <h4>指令</h4>
  <OButton @click="show3 = !show3">show3:{{ show3 }}</OButton>
  <section>
    <div v-loading="show3" class="box">show3</div>
    <div class="box">
      show3
      <OLoading v-model:visible="show3">自定义<IconAdd class="o-rotating" /></OLoading>
    </div>
  </section>
  <h4>服务</h4>
  <OButton @click="toggleLoading1">service to body</OButton>
  <OButton @click="toggleLoading2">service to box</OButton>
  <section>
    <div id="box1" ref="box1" class="box">box</div>
  </section>
</template>
<style lang="scss">
.box {
  width: 500px;
  height: 300px;
  background-color: #edf;
  position: relative;
}
</style>
