<docs lang="md">
<!-- zh-CN -->

### 非模态引导

设置 `:mask="false"` 关闭遮罩层，引导卡片浮于页面之上，用户可自由操作页面其他区域。

<!-- en-US -->

### Non-modal Tour

Set `:mask="false"` to disable the mask layer. The guide card floats above the page, allowing users to freely interact with other areas.
</docs>
<script setup lang="ts">
import { ref } from 'vue';

const show = ref(false);
</script>
<template>
  <div class="demo-tour-non-modal-doc">
    <OButton @click="show = true">开启非模态引导</OButton>

    <div class="demo-tour-targets">
      <div id="non-modal-step1" class="demo-block">
        <p>信息面板</p>
        <p>用户可自由操作页面其他区域。</p>
      </div>
      <div id="non-modal-step2" class="demo-block">
        <p>操作面板</p>
        <p>引导卡片以主色突出显示。</p>
      </div>
    </div>

    <OTour v-model:visible="show" :mask="false">
      <OTourStep target="#non-modal-step1" img="/card-cover.jpg" title="信息面板" detail="此面板展示关键信息，引导卡片以主色背景突出显示。" />
      <OTourStep target="#non-modal-step2" title="操作面板" detail="此面板用于执行操作，非模态模式下用户可继续操作页面。" />
    </OTour>
  </div>
</template>
<style lang="scss" scoped>
.demo-tour-targets {
  display: flex;
  gap: 16px;
  margin-top: 16px;
}

.demo-block {
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
