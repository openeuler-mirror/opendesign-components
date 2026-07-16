<docs lang="md">
<!-- zh-CN -->

### defaultStartIndex 精准定位 ^[NEXT](primary)

展示 `defaultStartIndex` 在不同高度模式下的初始定位行为：

- **定高模式**：项尺寸已知，偏移量计算精准，`defaultStartIndex` 指向的项一次性到达视口顶部。
- **不定高模式**：组件先用 `defaultItemSize` 估算总高度并滚动到估算位置，随后通过 `ResizeObserver` 测量可见项的真实高度、更新 `contentSize` 和 `maxScroll`，再通过"初始重定位"机制逐步修正到精准位置。当估算偏移与实际偏移差值收敛至 1px 以内或达到最大重试次数时停止。

<!-- en-US -->

### defaultStartIndex Precision ^[NEXT](primary)

Demonstrates the initial positioning behavior of `defaultStartIndex` under different height modes:

- **Fixed-height mode**: Item sizes are known, offset is calculated precisely, and the target item reaches the top of the viewport in a single step.
- **Dynamic-height mode**: The component first estimates total height using `defaultItemSize` and scrolls to the estimated position, then measures real heights of visible items via `ResizeObserver`, updates `contentSize` and `maxScroll`, and iteratively corrects to the precise position via an "initial re-scroll" mechanism. The process stops when the estimated offset converges within 1px of the actual offset or the maximum retry count is reached.
</docs>

<script lang="ts" setup>
import { ref } from 'vue';
import { OVirtualList, RenderIndexInfo } from '@opensig/opendesign';

// ============================================================================
// 场景一：不定高 · 项数较少 · defaultStartIndex 指向接近底部时被提前 clamp
// ============================================================================

/**
 * 小数据集——12 项，定高 60px（对照组）
 *
 * - 总高度 = 12 × 60 = 720px
 * - 容器 300px → maxScroll = 420px
 * - 索引 6 偏移 = 6 × 60 = 360px < 420px → 目标项可到顶
 */
const smallFixedList = ref(
  new Array(12).fill(1).map((_, idx) => ({
    id: idx + 1,
    label: `项 ${idx + 1}`,
  })),
);

/**
 * 小数据集——12 项，不定高（50/70px 交替，均 > defaultItemSize=40）
 *
 * - 实际总高度 = (50+70) × 6 = 720px
 * - 估算总高度 = 12 × 40 = 480px（低估 240px）
 * - 容器 300px → 实际 maxScroll = 420px，估算 maxScroll = 180px
 * - 索引 6 实际偏移 = (50+70) × 3 = 360px < 420px（本可到顶）
 * - 索引 6 估算偏移 = 6 × 40 = 240px > 180px → 被 clamp 到 180px
 * - 容器停在 180px，但实际 maxScroll 为 420px，剩余 240px 滚动空间
 * - 目标项实际在 360px 处 > 180px（滚动位置）→ 未到顶
 */
const smallDynamicList = ref(
  new Array(12).fill(1).map((_, idx) => ({
    id: idx + 1,
    label: `项 ${idx + 1}`,
    height: idx % 2 === 0 ? 50 : 70,
  })),
);

// ============================================================================
// 场景二：不定高模式，项数较多，估算偏移与实际偏移差异大
// ============================================================================

/** 大数据集——50 项，不定高，高度差异明显 */
const largeDynamicList = ref(
  new Array(50).fill(1).map((_, idx) => ({
    id: idx + 1,
    label: `项 ${idx + 1}`,
    height: (idx % 8) * 15 + 30,
  })),
);

// ============================================================================
// 通用
// ============================================================================

const onRenderChange = (params: RenderIndexInfo) => {
  console.log('render-change:', params);
};
</script>

<template>
  <div>
    <!-- ==================================================================== -->
    <!-- 场景一：不定高 · 项数较少 · defaultStartIndex 通过重定位修正到精准位置  -->
    <!-- ==================================================================== -->
    <h4>场景一：不定高 · 12 项 · defaultStartIndex=11（接近底部，重定位后精准到位）</h4>

    <div class="row">
      <div class="col">
        <h5>不定高 · defaultItemSize=40 · defaultStartIndex=11</h5>
        <OVirtualList
          :default-start-index="11"
          :default-item-size="40"
          :list="smallDynamicList"
          :scrollbar="{ showType: 'always' }"
          class="container"
          @render-change="onRenderChange"
        >
          <template #default="{ item, index }">
            <div :class="`item-${(index % 8) + 1}`" :style="{ height: item.height + 'px' }" class="section">
              <span>{{ item.label }}</span>
              <span class="tag">idx={{ index }} · h={{ item.height }}</span>
            </div>
          </template>
        </OVirtualList>
      </div>
    </div>

    <!-- ==================================================================== -->
    <!-- 场景二：不定高模式，项数较多，估算偏移与实际偏移差异大                  -->
    <!-- ==================================================================== -->
    <h4>场景二：不定高模式 · 50 项 · 高度差异明显</h4>

    <div class="row">
      <div class="col">
        <h5>不定高 · defaultStartIndex=25</h5>
        <OVirtualList
          :default-start-index="48"
          :default-item-size="80"
          :list="largeDynamicList"
          :scrollbar="{ showType: 'always' }"
          class="container"
          @render-change="onRenderChange"
        >
          <template #default="{ item, index }">
            <div :class="`item-${(index % 8) + 1}`" :style="{ height: item.height + 'px' }" class="section">
              <span>{{ item.label }}</span>
              <span class="tag">idx={{ index }} · h={{ item.height }}</span>
            </div>
          </template>
        </OVirtualList>
      </div>

      <div class="col">
        <h5>定高 · defaultStartIndex=25（对照组）</h5>
        <OVirtualList
          :default-start-index="48"
          :item-size="80"
          :list="largeDynamicList"
          :scrollbar="{ showType: 'always' }"
          class="container"
          @render-change="onRenderChange"
        >
          <template #default="{ item, index }">
            <div :class="`item-${(index % 8) + 1}`" class="section">
              <span>{{ item.label }}</span>
              <span class="tag">idx={{ index }}</span>
            </div>
          </template>
        </OVirtualList>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:list';
// 交叉色板：8 色系交叉取浅色（1-2 级），避免同色系连续
$demo-bg:
  rgb(var(--o-deepblue-1)), rgb(var(--o-yellow-2)), rgb(var(--o-purple-1)), rgb(var(--o-cyan-2)), rgb(var(--o-pink-1)), rgb(var(--o-blue-2)),
  rgb(var(--o-rosyred-1)), rgb(var(--o-lime-2));

.row {
  display: flex;
  gap: var(--o-gap-3);
  margin-bottom: var(--o-gap-3);
}

.col {
  flex: 1;
  min-width: 0;
}

.container {
  width: 100%;
  height: 170px;
  border: 2px solid var(--o-color-control4);
  box-sizing: border-box;
  display: flex;
}

.section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--o-gap-2);
}

.tag {
  font-size: var(--o-font_size-tip2);
  line-height: var(--o-line_height-tip2);
  color: var(--o-color-info3);
}

.hint {
  font-size: var(--o-font_size-tip2);
  line-height: var(--o-line_height-tip2);
  color: var(--o-color-info3);
  margin-bottom: var(--o-gap-1);
}

@for $i from 1 through 8 {
  .item-#{$i} {
    background-color: list.nth($demo-bg, $i);
  }
}
</style>
