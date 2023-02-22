<script setup lang="ts">
import { OButton } from '../../button';
import '../../button/style';
import { OBadge } from '../index';
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <OBadge :value="9" color="primary">
      <OButton variant="fill" />
    </OBadge>
    <OBadge :value="100" color="success">
      <OButton variant="fill" />
    </OBadge>
    <OBadge value="hot" color="warning">
      <OButton variant="fill" />
    </OBadge>
  </section>
</template>
