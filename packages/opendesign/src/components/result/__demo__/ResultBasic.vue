<script setup lang="ts">
import { OButton } from '../../button';
import '../../button/style';
import { OResult } from '../index';
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <OResult title="操作错误" description="请修改配置项" status="danger">
      <template #extra>
        <OButton>返回</OButton>
      </template>
    </OResult>
  </section>
</template>
