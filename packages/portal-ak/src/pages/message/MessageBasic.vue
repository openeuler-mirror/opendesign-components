<script setup lang="ts">
import { OButton, useMessage } from '@opendesign-src/index';

const message = useMessage();

const handleInfoBtnClick = () => {
  message.info({
    content: '用于表示普通操作信息提示，3秒后消失',
  });
};

const handleSuccessBtnClick = () => {
  message.success({
    content: '用于表示操作顺利达成，3秒后消失',
  });
};

const handleWarningBtnClick = () => {
  message.warning({
    content: '用于表示操作引起一定后果，3秒后消失',
  });
};

const handleDangerBtnClick = () => {
  message.danger({
    content: '用于表示操作引起严重的后果，3秒后消失',
  });
};

const handleLoadingBtnClick = () => {
  message.show({
    content: '排队中，请稍后',
    status: 'loading',
  });
};

const handleInfoBtnClick2 = () => {
  message.info({
    content: '用于表示普通操作信息提示，3秒后消失',
    position: 'bottom',
  });
};

const handleSuccessBtnClick2 = () => {
  message.success({
    content: '用于表示操作顺利达成，3秒后消失',
    position: 'bottom',
  });
};

const handleWarningBtnClick2 = () => {
  message.warning({
    content: '用于表示操作引起一定后果，3秒后消失',
    position: 'bottom',
  });
};

const handleDangerBtnClick2 = () => {
  message.danger({
    content: '用于表示操作引起严重的后果，3秒后消失',
    position: 'bottom',
  });
};

const handleLoadingBtnClick2 = () => {
  message.show({
    content: '排队中，请稍后',
    status: 'loading',
    position: 'bottom',
  });
};
</script>

<template>
  <h3>基础用法</h3>
  <section>
    <OButton color="primary" @click="handleInfoBtnClick">Info Message</OButton>
    <OButton color="success" @click="handleSuccessBtnClick">Success Message</OButton>
    <OButton color="warning" @click="handleWarningBtnClick">Warning Message</OButton>
    <OButton color="danger" @click="handleDangerBtnClick">Danger Message</OButton>
    <OButton color="primary" @click="handleLoadingBtnClick">Loading Message</OButton>
  </section>

  <h3>底部弹出</h3>
  <section>
    <OButton color="primary" @click="handleInfoBtnClick2">Info Message</OButton>
    <OButton color="success" @click="handleSuccessBtnClick2">Success Message</OButton>
    <OButton color="warning" @click="handleWarningBtnClick2">Warning Message</OButton>
    <OButton color="danger" @click="handleDangerBtnClick2">Danger Message</OButton>
    <OButton color="primary" @click="handleLoadingBtnClick2">Loading Message</OButton>
  </section>
</template>
