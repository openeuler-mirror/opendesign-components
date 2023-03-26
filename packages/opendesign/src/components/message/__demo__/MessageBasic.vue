<script setup lang="ts">
import '../style';
import useMessage from '../use-message';

import { OButton } from '../../button';
import '../../button/style';

const message = useMessage();

const handleNormalBtnClick = () => {
  message.normal({
    content: '用于表示普通操作信息提示，3秒后消失',
  });
};

const handlePrimaryBtnClick = () => {
  message.primary({
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
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <OButton color="normal" @click="handleNormalBtnClick">Info Message</OButton>
    <OButton color="primary" @click="handlePrimaryBtnClick">Primary Message</OButton>
    <OButton color="success" @click="handleSuccessBtnClick">Success Message</OButton>
    <OButton color="warning" @click="handleWarningBtnClick">Warning Message</OButton>
    <OButton color="danger" @click="handleDangerBtnClick">Danger Message</OButton>
  </section>
</template>
