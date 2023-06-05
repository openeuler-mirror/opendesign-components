<script setup lang="ts">
import { h } from 'vue';

import '../style';
import useMessage from '../use-message';
import { OIconAdd } from '../../icon-components';

import { OButton } from '../../button';
import '../../button/style';

const message = useMessage();

const handleClick1 = () => {
  message.show({
    content: h('strong', ['这是自定义', h('i', 'content')]),
    status: 'info',
  });
};

const handleClick2 = () => {
  message.show({
    content: OIconAdd,
    status: 'info',
  });
};
</script>

<template>
  <h4>自定义Content</h4>
  <section>
    <OButton color="primary" @click="handleClick1">自定义Content1</OButton>
    <OButton color="primary" @click="handleClick2">自定义Content2</OButton>
  </section>
</template>
