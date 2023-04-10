<script setup lang="ts">
import { OButton } from '../../button';
import '../../button/style';
import { IconAdd } from '../../icon';
import { OBadge } from '../index';
</script>

<template>
  <h4>自定义徽章内容</h4>
  <section>
    <OBadge color="danger">
      <OButton variant="solid" />
      <template #content>
        <IconAdd />
      </template>
    </OBadge>
  </section>
</template>
