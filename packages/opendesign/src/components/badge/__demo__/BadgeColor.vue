<script setup lang="ts">
import { OButton } from '../../button';
import '../../button/style';
import { OBadge } from '../index';
</script>

<template>
  <h4>不同颜色</h4>
  <section>
    <OBadge :value="9" color="primary">
      <OButton variant="solid" />
    </OBadge>
    <OBadge :value="100" color="success">
      <OButton variant="solid" />
    </OBadge>
    <OBadge value="hot" color="warning">
      <OButton variant="solid" />
    </OBadge>
    <OBadge value="hot" color="danger">
      <OButton variant="solid" />
    </OBadge>
  </section>
</template>

<style lang="scss" scoped>
.o-badge + .o-badge {
  margin-left: 20px;
}
</style>
