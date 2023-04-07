<script setup lang="ts">
import { ref } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { OLayer } from '../index';

const show1 = ref(true);

const toggle1 = (show?: boolean) => {
  if (show === undefined) {
    show1.value = !show1.value;
  } else {
    show1.value = show;
  }
};
const show2 = ref(false);
const toggle2 = (show?: boolean) => {
  if (show === undefined) {
    show2.value = !show2.value;
  } else {
    show2.value = show;
  }
};
const onChane = (v: boolean) => {
  console.log('dialog change', v);
};
</script>
<template>
  <h4>基本</h4>
  <section class="wrap">
    <OButton @click="toggle1(true)">Open</OButton>
    <OLayer v-model:visible="show1" :unmount-on-hide="false" @change="onChane">
      <div class="box">
        <h2>title</h2>
        <p>this is content this is content this is content this is content this is content this is content this is content this is content</p>
        <OButton @click="toggle1()">Close</OButton>
      </div>
    </OLayer>

    <OButton @click="toggle2(true)">Open unmount-on-hide</OButton>
    <OLayer v-model:visible="show2" :unmount-on-hide="true" @change="onChane">
      <div class="box">
        <h2>title</h2>
        <p>this is content this is content this is content this is content this is content this is content this is content this is content</p>
        <OButton @click="toggle2()">Close</OButton>
      </div>
    </OLayer>
  </section>
</template>
<style lang="scss">
.box {
  padding: 24px;
  background-color: var(--o-color-control-light);
}
.wrap {
  height: 200vh;
  align-items: flex-start;
}
</style>
