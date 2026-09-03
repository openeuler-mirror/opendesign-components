<script setup lang="ts">
import { ref } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { OTour, OTourStep } from '../index';

const show = ref(false);
const target1 = ref<HTMLElement>();
const target2 = ref<HTMLElement>();
</script>
<template>
  <div class="demo-tour-non-modal">
    <OButton @click="show = true">非模态引导</OButton>

    <div class="demo-tour-targets">
      <div ref="target1" class="demo-block">
        <h3>信息面板</h3>
        <p>用户可自由操作页面其他区域。</p>
      </div>
      <div ref="target2" class="demo-block">
        <h3>操作面板</h3>
        <p>引导卡片以主色突出显示。</p>
      </div>
    </div>

    <OTour v-model:visible="show" :mask="false" type="primary">
      <OTourStep :target="target1" title="信息面板" detail="此面板展示关键信息，引导卡片以主色背景突出显示。" />
      <OTourStep :target="target2" title="操作面板" detail="此面板用于执行操作，非模态模式下用户可继续操作页面。" />
    </OTour>
  </div>
</template>
<style lang="scss" scoped>
.demo-tour-non-modal {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.demo-tour-targets {
  display: flex;
  gap: 16px;
}

.demo-block {
  flex: 1;
  padding: 16px;
  border: 1px solid var(--o-color-control4);
  border-radius: var(--o-radius_control-m);
  background: var(--o-color-fill1);

  h3 {
    margin: 0 0 8px;
    font-size: var(--o-font_size-h4);
    color: var(--o-color-info1);
  }

  p {
    margin: 0;
    font-size: var(--o-font_size-text1);
    color: var(--o-color-info2);
  }
}
</style>
