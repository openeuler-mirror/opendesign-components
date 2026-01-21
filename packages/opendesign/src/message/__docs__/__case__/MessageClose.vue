<docs lang="md">
<!-- zh-CN -->

#### 关闭消息

每种消息方法都会返回一个用于关闭当前消息的函数，可用于手动关闭

<!-- en-US -->

#### Close Message

Each message method returns a function that can be used to manually close the current message.
</docs>
<script setup lang="ts">
import { shallowReactive, ref } from 'vue';
import { useMessage, OButton } from '@opensig/opendesign';

const count = ref(1);
const message = useMessage();
const messages = shallowReactive<Record<string, () => void>>({});
const addMessage = () => {
  const currentCount = count.value++;
  const close = message.info({
    content: `${currentCount} You can close me by clicking the close button`,
    // 0: The message will not be closed automatically
    duration: 0,
  });
  messages[currentCount] = () => {
    close();
    delete messages[currentCount];
  };
};
</script>
<template>
  <OButton variant="solid" color="primary" @click="addMessage">Show info {{ count }}</OButton>
  <div class="close-btns">
    <OButton v-for="[index, close] in Object.entries(messages)" :key="index" @click="close">Close {{ index }}</OButton>
  </div>
</template>
<style scoped lang="scss">
.close-btns {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}
</style>
