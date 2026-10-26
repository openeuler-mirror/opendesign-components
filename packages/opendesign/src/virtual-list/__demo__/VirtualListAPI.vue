<script lang="ts" setup>
import { ref, computed } from 'vue';
import { OVirtualList } from '../index';
import '../style';
import { ORadio } from '../../radio';
import '../../radio/style';
import { ORadioGroup } from '../../radio-group';
import '../../radio-group/style';
import { OButton } from '../../button';
import '../../button/style';
import { OInput } from '../../input';
import '../../input/style';
import { OSelect } from '../../select';
import '../../select/style';
import { OOption } from '../../option';
import '../../option/style';

// ============================================================================
// 模式切换
// ============================================================================

/** 布局方向 */
const layout = ref<'vertical' | 'horizontal'>('vertical');
/** 高度模式：fixed=定高 / dynamic=不定高 */
const heightMode = ref<'fixed' | 'dynamic'>('fixed');

const isDynamic = computed(() => heightMode.value === 'dynamic');
const isHorizontal = computed(() => layout.value === 'horizontal');

/** 主轴尺寸术语：垂直=高，水平=宽 */
const sizeTerm = computed(() => (isHorizontal.value ? '宽' : '高'));

/** 切换模式时强制重建组件，确保滚动状态重置 */
const componentKey = computed(() => `${layout.value}-${heightMode.value}`);

// ============================================================================
// 列表数据
// ============================================================================

const list = ref(
  new Array(50).fill(1).map((_, idx) => ({
    id: idx + 1,
    label: idx + 1,
    /** 不定高模式下的随机尺寸（px） */
    size: Math.floor(Math.random() * 80 + 40),
  })),
);

/** 定高模式的项尺寸（垂直=高度，水平=宽度） */
const FIXED_SIZE = 80;
const itemSize = computed(() => (isDynamic.value ? undefined : FIXED_SIZE));
const defaultItemSize = computed(() => (isDynamic.value ? FIXED_SIZE : undefined));

// ============================================================================
// API 参数与调用
// ============================================================================

const defaultStartIndex = 5;
const index = ref(10);
const align = ref<'start' | 'end' | 'center' | 'nearest'>('center');
const behavior = ref<ScrollBehavior>('smooth');
const offsetPx = ref(500);
const virtualRef = ref<InstanceType<typeof OVirtualList>>();

/** scrollToView：按索引滚动到指定项 */
const onScrollToView = () => {
  const to = Math.max(index.value - 1, 0);
  virtualRef.value?.scrollToView(to, align.value, behavior.value);
};

/** scrollToOffset：滚动到指定像素偏移量 */
const onScrollToOffset = () => {
  virtualRef.value?.scrollToOffset(offsetPx.value);
};
</script>

<template>
  <h4>API 调用</h4>

  <!-- 模式切换器：布局方向 × 高度模式 -->
  <div class="mode-switch">
    <div class="mode-group">
      <span class="mode-label">布局方向</span>
      <ORadioGroup v-model="layout">
        <ORadio value="vertical">垂直</ORadio>
        <ORadio value="horizontal">水平</ORadio>
      </ORadioGroup>
    </div>
    <div class="mode-group">
      <span class="mode-label">{{ isHorizontal ? '宽度模式' : '高度模式' }}</span>
      <ORadioGroup v-model="heightMode">
        <ORadio value="fixed">定{{ sizeTerm }}</ORadio>
        <ORadio value="dynamic">不定{{ sizeTerm }}</ORadio>
      </ORadioGroup>
    </div>
  </div>

  <!-- scrollToView 演示 -->
  <h5>scrollToView —— 按索引滚动到指定项</h5>
  <div class="api-controls">
    <OInput v-model.number="index" only-numeric-input placeholder="索引" style="width: 80px" />
    <OSelect v-model="align" style="width: 100px">
      <OOption label="start" value="start" />
      <OOption label="end" value="end" />
      <OOption label="center" value="center" />
      <OOption label="nearest" value="nearest" />
    </OSelect>
    <OSelect v-model="behavior" style="width: 100px">
      <OOption label="instant" value="instant" />
      <OOption label="smooth" value="smooth" />
    </OSelect>
    <OButton variant="solid" color="brand" @click="onScrollToView">滚动到</OButton>
  </div>

  <!-- scrollToOffset 演示 -->
  <h5>scrollToOffset —— 滚动到指定像素偏移量</h5>
  <div class="api-controls">
    <OInput v-model.number="offsetPx" only-numeric-input placeholder="偏移量(px)" style="width: 80px" />
    <OButton variant="solid" color="brand" @click="onScrollToOffset">滚动到偏移</OButton>
  </div>

  <!-- 虚拟列表——通过 :key 切换模式时强制重建 -->
  <OVirtualList
    :key="componentKey"
    ref="virtualRef"
    :default-start-index="defaultStartIndex"
    :item-size="itemSize"
    :default-item-size="defaultItemSize"
    :list="list"
    :layout="layout"
    :class="['container', { 'container-h': isHorizontal }]"
  >
    <template #default="{ item, index }">
      <div
        :class="[`item-${(index % 8) + 1}`, 'section', { 'section-h': isHorizontal }]"
        :style="isDynamic ? { [isHorizontal ? 'width' : 'height']: item.size + 'px' } : undefined"
      >
        <span>{{ isHorizontal ? 'Col' : 'Row' }}:</span>
        <span>{{ item.label }}</span>
        <span>——</span>
        <span>{{ isDynamic ? `${item.size}px` : `id:${item.id}` }}</span>
      </div>
    </template>
  </OVirtualList>

  <!-- 当前模式说明 -->
  <p class="mode-hint">
    <span
      >当前为<strong>{{ isHorizontal ? '水平' : '垂直' }}{{ isDynamic ? '不定' : '定' }}{{ sizeTerm }}模式</strong>。</span
    >
    <span v-if="isDynamic"
      >项尺寸运行时测量，<code>scrollToView</code> 的 <code>behavior</code> 将被强制为 <code>instant</code>（smooth 无法精准对齐未测量项）；目标项未测量时会先以
      start 对齐触发渲染，测量后通过"二次逼近"机制重新滚动到目标位置。</span
    >
    <span v-else>项尺寸已知，两个 API 均完全支持，<code>behavior</code> 可选 smooth / instant，对齐精准。</span>
    <span v-if="isHorizontal"> 横向模式下，所有 API 通过轴选择器自动适配水平滚动轴。</span>
  </p>
</template>

<style lang="scss" scoped>
@use 'sass:list';
// 交叉色板：8 色系交叉取浅色（1-2 级），避免同色系连续
$demo-bg:
  rgb(var(--o-deepblue-1)), rgb(var(--o-yellow-2)), rgb(var(--o-purple-1)), rgb(var(--o-cyan-2)), rgb(var(--o-pink-1)), rgb(var(--o-blue-2)),
  rgb(var(--o-rosyred-1)), rgb(var(--o-lime-2));

.mode-switch {
  display: flex;
  gap: var(--o-gap-3);
  margin-bottom: var(--o-gap-3);
}

.mode-group {
  display: flex;
  align-items: center;
  gap: var(--o-gap-1);
}

.mode-label {
  color: var(--o-color-info2);
}

.api-controls {
  display: flex;
  align-items: center;
  gap: var(--o-gap-2);
  margin-bottom: var(--o-gap-3);
}

.container {
  width: 400px;
  height: 300px;
  border: 2px solid var(--o-color-control4);
  box-sizing: border-box;
  display: flex;
}

/* 水平模式：矮容器，卡片轮播风格 */
.container-h {
  width: 100%;
  height: 120px;
}

.section {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

/* 水平模式：项内容垂直排列，卡片风格 */
.section-h {
  flex-direction: column;
  gap: var(--o-gap-1);
  border-radius: var(--o-radius_control-s);
}

.mode-hint {
  margin-top: var(--o-gap-2);
  font-size: var(--o-font_size-tip2);
  line-height: var(--o-line_height-tip2);
  color: var(--o-color-info3);

  code {
    background-color: var(--o-color-fill2);
    padding: 0 4px;
    border-radius: var(--o-radius_control-s);
  }
}

@for $i from 1 through 8 {
  .item-#{$i} {
    background-color: list.nth($demo-bg, $i);
  }
}
</style>
