<script setup lang="ts">
import { ref } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { OLink } from '../../link';
import '../../link/style';
import { OIconChevronRight } from '../../icon-components';
import { OToast, useToast } from '../index';

const wrapRef = ref();

const { show: showToast, close } = useToast();
const { show: showToast1 } = useToast(wrapRef);

const handleClick = () => {
  showToast({
    long: true,
    content: '在自定义目标元素内居中对齐',
  });
};

const handleClick1 = () => {
  showToast1({
    duration: 5000,
    position: 'center',
    targetOffset: 16,
    content: '在自定义目标元素内居中对齐',
  });
};
</script>

<template>
  <h4>基础用法</h4>
  <section>
    <OToast message="toast提示" />
    <OToast>
      <span style="margin-right: 6px"> toast提示 </span>
      <OLink color="normal" style="--o-color-link1: var(--o-color-info1-inverse)">
        文字按钮
        <template #suffix><OIconChevronRight /> </template> </OLink
    ></OToast>
  </section>

  <h4>函数式用法</h4>
  <section>
    <OButton @click="handleClick" color="primary" variant="solid">showToast</OButton>
  </section>

  <h4>自定义target</h4>
  <section>
    <div ref="wrapRef" class="toast-wrap">
      <OButton @click="handleClick1" color="primary" variant="solid">showToast1</OButton>
    </div>
  </section>

  <h4>手动关闭</h4>
  <section>
    <div ref="wrapRef" class="toast-wrap">
      <OButton @click="handleClick" color="primary" variant="solid">showToast</OButton>
      <OButton @click="close" color="primary" variant="solid">closeToast</OButton>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.toast-wrap {
  display: flex;
  padding: 16px;
  & > * {
    margin-right: 8px;
  }
}
</style>
