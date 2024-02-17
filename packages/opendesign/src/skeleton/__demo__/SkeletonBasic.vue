<script setup lang="ts">
import { OSkeleton, OSkeletonText, OSkeletonAvatar, OSkeletonFigure } from '../index';
</script>

<template>
  <h4>段落</h4>
  <section>
    <OSkeleton />
  </section>
  <section>
    <OSkeleton :rows="5" />
  </section>
  <section>
    <OSkeleton>
      <template #template>
        <OSkeletonText :rows="5" />
      </template>
    </OSkeleton>
  </section>

  <h4>头像</h4>
  <section :style="{ display: 'flex' }">
    <OSkeleton>
      <template #template>
        <OSkeletonAvatar size="mini" />
      </template>
    </OSkeleton>

    <OSkeleton>
      <template #template>
        <OSkeletonAvatar size="small" />
      </template>
    </OSkeleton>

    <OSkeleton>
      <template #template>
        <OSkeletonAvatar />
      </template>
    </OSkeleton>

    <OSkeleton>
      <template #template>
        <OSkeletonAvatar size="large" />
      </template>
    </OSkeleton>
  </section>

  <h4>图片</h4>
  <section :style="{ display: 'flex' }">
    <OSkeleton>
      <template #template>
        <OSkeletonFigure />
      </template>
    </OSkeleton>
  </section>

  <h4>组合使用</h4>
  <section>
    <OSkeleton>
      <template #template>
        <OSkeletonAvatar />
        <OSkeletonText :rows="3" :style="{ 'margin-top': '24px' }" />
      </template>
    </OSkeleton>
  </section>
</template>

<style lang="scss" scoped>
section {
  display: block;
  background-color: var(--o-color-fill2);
}
</style>
