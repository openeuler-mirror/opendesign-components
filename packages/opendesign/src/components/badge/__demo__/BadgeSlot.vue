<script setup lang="ts">
import { OButton } from '../../button';
import '../../button/style';
import { IconAdd } from '../../icons';
import { OBadge } from '../index';
</script>

<template>
  <h4>自定义徽章内容</h4>
  <section>
    <OBadge>
      <OButton variant="fill" />
      <template #content> <IconAdd /></template>
    </OBadge>
  </section>
</template>
