<script setup lang="ts">
import { h } from 'vue';

import '../style';
import { useMessage } from '../use-message';
import { OIconAdd, OIconEyeOff } from '../../icon-components';

import { OButton } from '../../button';
import '../../button/style';

const message = useMessage();

const handleClick1 = () => {
  message.show({
    content: '自定义Icon1',
    status: 'info',
    icon: OIconAdd,
  });
};

const handleClick2 = () => {
  message.show({
    content: '自定义Icon2',
    status: 'info',
    icon: h(OIconEyeOff, { class: 'o-rotating' }),
  });
};
</script>

<template>
  <h4>自定义Icon</h4>
  <section>
    <OButton color="primary" @click="handleClick1">自定义Icon1</OButton>
    <OButton color="primary" @click="handleClick2">自定义Icon2</OButton>
  </section>
</template>
