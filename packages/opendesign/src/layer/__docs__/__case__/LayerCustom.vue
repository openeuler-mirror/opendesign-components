<docs lang="md">
<!-- zh-CN -->

### 自定义关闭按钮

可以通过 `close` 插槽自定义按钮，或完全自定义关闭按钮（通过双向绑定属性 `visible` 实现开关）

<!-- en-US -->

### Custom Close Button

The close button can be customized through the `close` slot,
or fully replaced by custom implementations using the `visible` two-way binding property for toggling.
</docs>
<script lang="ts" setup>
import { ref } from 'vue';
import { OIconClose, OIconEyeOff, OLayer, OButton } from '@opensig/opendesign';

const firstLayerVisible = ref(false);
const handleFirstLayerOpen = () => {
  firstLayerVisible.value = true;
};

const secondLayerVisible = ref(true);
const handleSecondLayerClose = () => {
  secondLayerVisible.value = false;
};
const handleSecondLayerOpen = () => {
  secondLayerVisible.value = true;
};
</script>
<template>
  <div class="layer-doc-custom">
    <!-- first layer -->
    <OButton @click="handleFirstLayerOpen">Open First</OButton>
    <OLayer v-model:visible="firstLayerVisible" :mask-close="false" button-close :wrapper="null">
      <template #close>
        <div class="first-close">
          <OIconEyeOff />
        </div>
      </template>
      <div class="layer-doc-custom-main">
        <h2>First Layer</h2>
        <p>this is content this is content this is content this is content this is content this is content this is content this is content</p>
      </div>
    </OLayer>
    <!-- second layer -->
    <OButton @click="handleSecondLayerOpen">Open Second</OButton>
    <OLayer v-model:visible="secondLayerVisible" :mask-close="false" :wrapper="null">
      <div class="layer-doc-custom-main second-layer">
        <h2>Second Layer</h2>
        <p>this is content this is content this is content this is content this is content this is content this is content this is content</p>
        <OIconClose class="layer-doc-custom-close" @click="handleSecondLayerClose" />
      </div>
    </OLayer>
  </div>
</template>
<style lang="scss" scoped>
.layer-doc-custom {
  height: 300px;
  display: flex;
  gap: 12px;
  position: relative;
}
.layer-doc-custom-main {
  padding: 24px;
  background-color: var(--o-color-control-light);
}
.first-close {
  font-size: var(--o-icon_size-m);
  color: var(--o-color-info1-inverse);
  background-color: var(--o-color-mask1);
  border-radius: 50%;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.second-layer {
  position: relative;
}
.layer-doc-custom-close {
  position: absolute;
  top: 0px;
  right: -24px;
  cursor: pointer;
  font-size: var(--o-icon_size-l);
  color: var(--o-color-info1-inverse);
  transform: translateX(100%);
  transition: transform var(--o-duration-m1) var(--o-easing-standard-in);
  @media (hover: hover) {
    &:hover {
      transform: translateX(100%) rotate(180deg);
    }
  }
}
</style>
