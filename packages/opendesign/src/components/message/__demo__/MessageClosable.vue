<script setup lang="ts">
import { ref } from 'vue';

import '../style';
import useMessage from '../use-message';
import OMessage from '../OMessage.vue';

import { OButton } from '../../button';
import '../../button/style';

const message = useMessage();

const msg = ref<InstanceType<typeof OMessage> | null>(null);

const handleCloseAll = () => {
  message.closeAll();
};

const handleClosePrev = () => {
  msg.value?.close();
};

const handleInfoBtnClick = () => {
  msg.value = message.info({
    content: '用于表示普通操作信息提示，3秒后消失',
    closable: true,
  });
  debugger;
};

const handleSuccessBtnClick = () => {
  message.success({
    content: '用于表示操作顺利达成，3秒后消失',
    closable: true,
  });
};

const handleWarningBtnClick = () => {
  message.warning({
    content: '用于表示操作引起一定后果，3秒后消失',
    closable: true,
  });
};

const handleDangerBtnClick = () => {
  message.danger({
    content: '用于表示操作引起严重的后果，3秒后消失',
    closable: true,
  });
};

const handleLoadingBtnClick = () => {
  message.open({
    content: '排队中，请稍后',
    status: 'loading',
    closable: true,
  });
};
</script>

<template>
  <h4>可关闭Message</h4>
  <section>
    <OButton color="danger" @click="handleCloseAll">关闭所有</OButton>
    <OButton color="danger" @click="handleClosePrev">关闭上一条</OButton>
    <OButton color="primary" @click="handleInfoBtnClick">Info Message</OButton>
    <OButton color="success" @click="handleSuccessBtnClick">Success Message</OButton>
    <OButton color="warning" @click="handleWarningBtnClick">Warning Message</OButton>
    <OButton color="danger" @click="handleDangerBtnClick">Danger Message</OButton>
    <OButton color="primary" @click="handleLoadingBtnClick">Loading Message</OButton>
  </section>
</template>
