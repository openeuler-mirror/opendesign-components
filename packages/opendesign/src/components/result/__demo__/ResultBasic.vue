<script setup lang="ts">
import { OButton } from '../../button';
import '../../button/style';
import { OResult } from '../index';
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <OResult title="操作错误" description="请修改配置项" status="info" style="flex: 1" />
    <OResult title="操作错误" description="请修改配置项" status="success" style="flex: 1">
      <template #extra>
        <OButton>返回</OButton>
      </template>
    </OResult>
    <OResult title="操作错误" description="请修改配置项" status="warning" style="flex: 1">
      <template #extra>
        <OButton>返回</OButton>
      </template>
    </OResult>
    <OResult title="操作错误" description="请修改配置项" status="danger" style="flex: 1">
      <template #extra>
        <OButton>返回</OButton>
      </template>
    </OResult>

    <OResult title="操作错误" description="请修改配置项" style="flex: 1" />
    <OResult title="操作错误" style="flex: 1" />
    <OResult description="请修改配置项" style="flex: 1" />
  </section>
</template>
