<script setup lang="ts">
import { h } from 'vue';

import '../style';
import useMessage from '../use-message';
import { OIconAdd, OIconLoading } from '../../icon-svgs';

import { OButton } from '../../button';
import '../../button/style';

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

const handleInfoBtnClick2 = () => {
  message.open({
    content: '自定义Icon',
    status: 'info',
    icon: OIconAdd,
  });
};

const handleInfoWarningClick2 = () => {
  message.open({
    content: '排队中，请稍后',
    status: 'warning',
    icon: h(OIconLoading, { class: 'o-rotating' }),
  });
};
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <OButton color="primary" @click="handleInfoBtnClick">Info Message</OButton>
    <OButton color="success" @click="handleSuccessBtnClick">Success Message</OButton>
    <OButton color="warning" @click="handleWarningBtnClick">Warning Message</OButton>
    <OButton color="danger" @click="handleDangerBtnClick">Danger Message</OButton>
  </section>

  <h4>自定义Icon</h4>
  <section>
    <OButton color="primary" @click="handleInfoBtnClick2">自定义Icon</OButton>
    <OButton color="warning" @click="handleInfoWarningClick2">loading</OButton>
  </section>
</template>
