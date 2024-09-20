<script setup lang="ts">
import { ref } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { OPopup } from '../index';

const content = 'this is popup content';
const btn1 = ref(null);
const btn2 = ref(null);
const visible = ref(false);

const change = () => {
  visible.value = !visible.value;
};
</script>
<template>
  <h4>popup visible</h4>
  <section>
    <div class="row">visible: {{ visible }}</div>
    <OButton class="btn" @click="change">change visible</OButton>

    <div class="row">
      <OButton ref="btn1" class="btn">Button</OButton>
      <OPopup v-model:visible="visible" position="tl" :target="btn1" trigger="click-outclick">
        <div class="popup-box">TL {{ content }}</div>
      </OPopup>
      <OButton ref="btn2" class="btn"> TOP </OButton>
      <OPopup :visible="visible" position="bottom" :target="btn2" trigger="none">
        <div class="popup-box">TL {{ content }}</div>
      </OPopup>
    </div>
  </section>
</template>
<style lang="scss" scoped>
.row {
  justify-content: space-between;
}
</style>
