<docs lang="md">
<!-- zh-CN -->

### 弹出位置与锚点

`position` 支持 12 个弹出位置：`top` / `tl` / `tr`（上方）、`bottom` / `bl` / `br`（下方）、`left` / `lt` / `lb`（左侧）、`right` / `rt` / `rb`（右侧）。

开启 `anchor` 后会在弹层边缘计算锚点位置，锚点内容通过 `#anchor` 插槽自定义；`offset` 控制弹层与触发元素的距离，`adaptive` 开启时弹层超出视口会自动翻转方向。

<!-- en-US -->

### Position and Anchor

`position` supports 12 placements: `top` / `tl` / `tr` (above), `bottom` / `bl` / `br` (below), `left` / `lt` / `lb` (left), and `right` / `rt` / `rb` (right).

When `anchor` is enabled, an anchor point is calculated on the popup edge and customized via the `#anchor` slot. `offset` controls the distance between the popup and the trigger; with `adaptive` enabled, the popup flips automatically when it would overflow the viewport.
</docs>
<script setup lang="ts">
import { OPopup, OButton } from '@opensig/opendesign';
import { PopupPositionTypes } from '@opensig/opendesign';

const positions = PopupPositionTypes;
</script>
<template>
  <div class="demo-popup-positions">
    <div v-for="p in positions" :key="p" class="demo-popup-item">
      <OPopup :position="p" trigger="click" anchor :offset="8" wrap-class="demo-popup-case">
        <div class="demo-popup-panel">position: {{ p }}</div>
        <template #anchor>
          <div class="demo-popup-arrow"></div>
        </template>
        <template #target>
          <OButton round="pill">{{ p }}</OButton>
        </template>
      </OPopup>
    </div>
  </div>
</template>
<style lang="scss">
// 弹层内容 Teleport 到 body，需通过 wrapClass 提供非 scoped 的外观定制
.demo-popup-case {
  --popup-bg-color: var(--o-color-fill2);
  --popup-shadow: var(--o-shadow-1);
  --popup-radius: var(--o-radius_control-s);
  --popup-bd: 1px solid var(--o-color-control4);
  --popup-padding: 8px 12px;

  color: var(--o-color-info1);
  font-size: var(--o-font_size-tip1);
  line-height: var(--o-line_height-tip1);
}

// 锚点箭头：8px 方块裁出对角，随 position 旋转指向触发元素
.demo-popup-arrow {
  width: 8px;
  height: 8px;
  background-color: var(--popup-bg-color);
  border: var(--popup-bd);
  border-bottom: none;
  border-right: none;
  border-top-left-radius: 2px;
}

.o-popup-pos-left,
.o-popup-pos-lb,
.o-popup-pos-lt {
  .demo-popup-arrow {
    transform: translate(50%, -50%) rotate(135deg);
  }
}

.o-popup-pos-top,
.o-popup-pos-tl,
.o-popup-pos-tr {
  .demo-popup-arrow {
    transform: translate(-50%, 50%) rotate(225deg);
  }
}

.o-popup-pos-right,
.o-popup-pos-rt,
.o-popup-pos-rb {
  .demo-popup-arrow {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
}

.o-popup-pos-bottom,
.o-popup-pos-bl,
.o-popup-pos-br {
  .demo-popup-arrow {
    transform: translate(-50%, -50%) rotate(45deg);
  }
}
</style>
<style lang="scss" scoped>
.demo-popup-positions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.demo-popup-item {
  display: flex;
}
</style>
