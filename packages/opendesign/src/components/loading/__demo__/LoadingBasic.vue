<script setup lang="ts">
import { ref } from 'vue';
import { OLoading, vLoading, useLoading } from '../index';
import { OButton } from '../../button';
import '../../button/style';
import { OIconAdd } from '../../icon-svgs';

const show1 = ref(false);
const showLoading1 = () => {
  show1.value = true;
  setTimeout(() => {
    show1.value = false;
  }, 1000);
};

const show2 = ref(false);
const show3 = ref(false);
const show4 = ref(false);

const box1 = ref();
const l1 = useLoading();
const l2 = useLoading(box1, {
  label: 'loading',
  icon: OIconAdd,
  iconRotating: true,
});
const toggleLoading1 = () => {
  l1.toggle(true);
  setTimeout(() => {
    l1.toggle(false);
  }, 1000);
};
const toggleLoading2 = () => {
  l2.toggle();
};
</script>
<template>
  <h4>全局</h4>
  <OButton @click="showLoading1">show1:{{ show1 }}</OButton>
  <OLoading v-model:visible="show1" />
  <h4>局部</h4>
  <OButton @click="show2 = !show2">show2:{{ show2 }}</OButton>
  <section>
    <div class="box">
      show2
      <OLoading v-model:visible="show2" :wrapper="null" />
    </div>
    <div class="box">
      show2
      <OLoading v-model:visible="show2" :wrapper="null">自定义<OIconAdd class="o-rotating" /></OLoading>
    </div>
  </section>
  <h4>指令</h4>
  <OButton @click="show3 = !show3">show3:{{ show3 }}</OButton>
  <OButton v-loading.body="show4" @click="show4 = !show4">show4 body:{{ show4 }}</OButton>
  <section>
    <div v-loading="show3" class="box b1">show3</div>
    <div v-loading.nomask="show3" class="box b2">show3 nomask</div>
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
