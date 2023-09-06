<script setup lang="ts">
import { OButton } from '../../button';
import '../../button/style';
import { ODivider } from '../../divider';
import '../../divider/style';
import { OResult } from '../index';
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <OResult title="操作错误" description="请修改配置项" status="info" />
    <ODivider />
    <OResult title="操作错误" description="请修改配置项" status="success">
      <template #extra>
        <OButton>返回</OButton>
      </template>
    </OResult>
    <ODivider />
    <OResult title="操作错误" description="请修改配置项" status="warning">
      <template #extra>
        <OButton>返回</OButton>
      </template>
    </OResult>
    <ODivider />
    <OResult title="操作错误" description="请修改配置项" status="danger">
      <template #extra>
        <OButton>返回</OButton>
      </template>
    </OResult>
    <ODivider />
    <OResult title="操作错误" description="请修改配置项" />
    <ODivider />
    <OResult title="操作错误" />
    <ODivider />
    <OResult description="请修改配置项" />
  </section>
</template>

<style lang="scss" scoped>
section {
  flex-direction: column;
}
</style>
