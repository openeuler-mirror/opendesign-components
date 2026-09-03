<script setup lang="ts">
import { ref } from 'vue';
import { OButton } from '../../button';
import '../../button/style';
import { OTour, OTourStep } from '../index';

const show = ref(false);
const step1Target = ref<HTMLElement>();
const step2Target = ref<HTMLElement>();
const step3Target = ref<HTMLElement>();
</script>
<template>
  <div class="demo-tour-basic">
    <OButton @click="show = true">开始漫游引导</OButton>

    <div class="demo-tour-targets">
      <div ref="step1Target" class="demo-block">
        <h3>功能区域一</h3>
        <p>这是第一个需要引导的功能区域，用户可以在此查看基础信息。</p>
      </div>
      <div ref="step2Target" class="demo-block">
        <h3>功能区域二</h3>
        <p>这是第二个功能区域，用户可以在此进行数据操作。</p>
      </div>
      <div ref="step3Target" class="demo-block">
        <h3>功能区域三</h3>
        <p>这是第三个功能区域，用户可以在此完成最终配置。</p>
      </div>
    </div>

    <OTour v-model:visible="show" :current="0">
      <OTourStep :target="step1Target" title="欢迎使用漫游引导" detail="这里是功能区域一，您可以在该区域查看系统的基础信息与运行状态。" />
      <OTourStep :target="step2Target" title="数据操作" detail="这里是功能区域二，您可以在此对数据进行增删改查操作。" />
      <OTourStep :target="step3Target" title="完成配置" detail="这里是功能区域三，完成所有配置后即可开始使用系统。" />
    </OTour>
  </div>
</template>
<style lang="scss" scoped>
.demo-tour-basic {
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
