<script setup lang="ts">
import { ref } from 'vue';
import '../style';
import { useMessage } from '../use-message';

import { OButton } from '../../button';
import '../../button/style';

const target = ref('#msg-target-1');
const message1 = useMessage(target);
const message2 = useMessage();
const openInfo1 = () => {
  if (target.value === '#msg-target-1') {
    target.value = '#msg-target-2';
  } else {
    target.value = '#msg-target-1';
  }
  message1.info({ content: 'info1', duration: 0 });
};
</script>
<template>
  <h4>关闭方法</h4>
  <section>
    <OButton @click="openInfo1">info1</OButton>
    <OButton @click="message1.close()">关闭info1</OButton>
  </section>
  <section>
    <OButton @click="message2.info({ content: 'info2', duration: 0 })">info2</OButton>
    <OButton @click="message2.close()">关闭info2</OButton>
  </section>
  <section>
    <OButton @click="message1.closeAll()">关闭所有 info1</OButton>
    <OButton @click="message2.closeAll()">关闭所有 info2</OButton>
  </section>
  <div class="target-group">
    <div id="msg-target-1"></div>
    <div id="msg-target-2"></div>
  </div>
</template>
<style lang="scss">
.target-group {
  display: flex;
  gap: 12px;
  > div {
    flex: 1;
    height: 200px;
    border: solid 1px red;
  }
}
</style>
