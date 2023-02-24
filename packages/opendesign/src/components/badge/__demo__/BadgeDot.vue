<script setup lang="ts">
import { OButton } from '../../button';
import '../../button/style';
import { OLink } from '../../link';
import '../../link/style';
import { OBadge } from '../index';

const link = 'www.openeuler.org';
</script>

<template>
  <h4>红点徽章</h4>
  <section>
    <OBadge dot>
      <OButton variant="fill" />
    </OBadge>
    <OBadge dot>
      <OLink :href="link">普通链接</OLink>
    </OBadge>
  </section>
</template>
