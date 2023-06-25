<script setup lang="ts">
import { OButton } from '../../button';
import '../../button/style';
import { OBadge } from '../index';
</script>

<template>
  <h4>徽章位置偏移</h4>
  <section>
    <OBadge :value="9" :offset="[5, 10]" color="danger">
      <OButton variant="solid" />
    </OBadge>
    <OBadge :value="9" :offset="[5, 20]" color="danger">
      <OButton variant="solid" />
    </OBadge>
    <OBadge :value="9" :offset="['50%', '20%']" color="danger">
      <OButton variant="solid" />
    </OBadge>
  </section>
</template>

<style scoped>
.o-badge + .o-badge {
  margin-left: 20px;
}
</style>
