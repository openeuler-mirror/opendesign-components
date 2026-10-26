<docs lang="md">
<!-- zh-CN -->

### 触发方式

`trigger` 支持 `click`、`click-outclick`、`hover`、`hover-outclick`、`focus`、`contextmenu` 与 `none` 七种触发方式：

- `click`：点击触发元素切换显隐；
- `click-outclick`：点击触发元素显示，点击外部区域隐藏；
- `hover`：悬停显示，移出触发元素与弹层后隐藏（延时可通过 `hoverDelay` 调整）；
- `hover-outclick`：悬停显示，点击外部区域隐藏；
- `focus`：聚焦显示、失焦隐藏，适合输入类触发元素；
- `contextmenu`：右键显示，点击外部区域隐藏；
- `none`：不绑定任何事件，完全通过 `visible` 双向绑定受控。

<!-- en-US -->

### Trigger

`trigger` supports seven modes: `click`, `click-outclick`, `hover`, `hover-outclick`, `focus`, `contextmenu`, and `none`:

- `click`: toggle visibility by clicking the trigger element;
- `click-outclick`: show on trigger click, hide on outside click;
- `hover`: show on hover, hide after leaving both the trigger and the popup (delay adjustable via `hoverDelay`);
- `hover-outclick`: show on hover, hide on outside click;
- `focus`: show on focus and hide on blur, suitable for input-like triggers;
- `contextmenu`: show on right-click, hide on outside click;
- `none`: no event bound, fully controlled via the `visible` two-way binding.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OPopup, OButton, OInput } from '@opensig/opendesign';

const content = '弹层内容文本，用于演示不同触发方式。';
const inputVal = ref('');
const noneTarget = ref();
const noneVisible = ref(false);

/** trigger=none 场景下由外部完全控制显隐 */
const toggleNone = () => {
  noneVisible.value = !noneVisible.value;
};
</script>
<template>
  <div class="demo-popup-triggers">
    <div class="demo-popup-item">
      <OPopup trigger="click" position="bottom" wrap-class="demo-popup-case">
        <div class="demo-popup-panel">{{ content }}</div>
        <template #target>
          <OButton round="pill">click</OButton>
        </template>
      </OPopup>
    </div>
    <div class="demo-popup-item">
      <OPopup trigger="click-outclick" position="bottom" wrap-class="demo-popup-case">
        <div class="demo-popup-panel">{{ content }}</div>
        <template #target>
          <OButton round="pill">click-outclick</OButton>
        </template>
      </OPopup>
    </div>
    <div class="demo-popup-item">
      <OPopup trigger="hover" position="bottom" wrap-class="demo-popup-case">
        <div class="demo-popup-panel">{{ content }}</div>
        <template #target>
          <OButton round="pill">hover</OButton>
        </template>
      </OPopup>
    </div>
    <div class="demo-popup-item">
      <OPopup trigger="hover-outclick" position="bottom" wrap-class="demo-popup-case">
        <div class="demo-popup-panel">{{ content }}</div>
        <template #target>
          <OButton round="pill">hover-outclick</OButton>
        </template>
      </OPopup>
    </div>
    <div class="demo-popup-item">
      <OPopup trigger="focus" position="bottom" :unmount-on-hide="false" wrap-class="demo-popup-case">
        <div class="demo-popup-panel">{{ content }}</div>
        <template #target>
          <OInput v-model="inputVal" placeholder="focus" class="demo-popup-input" />
        </template>
      </OPopup>
    </div>
    <div class="demo-popup-item">
      <OPopup trigger="contextmenu" position="bottom" wrap-class="demo-popup-case">
        <div class="demo-popup-panel">{{ content }}</div>
        <template #target>
          <OButton round="pill">contextmenu（右键）</OButton>
        </template>
      </OPopup>
    </div>
    <div class="demo-popup-item">
      <OButton ref="noneTarget" round="pill" @click="toggleNone">none（受控）</OButton>
      <OPopup v-model:visible="noneVisible" trigger="none" position="bottom" :target="noneTarget" wrap-class="demo-popup-case">
        <div class="demo-popup-panel">{{ content }}</div>
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
</style>
<style lang="scss" scoped>
.demo-popup-triggers {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
}

.demo-popup-item {
  display: flex;
  align-items: center;
}

.demo-popup-input {
  width: 180px;
}
</style>
