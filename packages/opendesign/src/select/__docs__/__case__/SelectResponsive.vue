<docs lang="md">
  <!-- zh-CN -->

### 标签溢出自适应 ^[1.2.7](primary)

多选模式下选项过多时，`maxTagCount` 控制标签的折叠行为：

- **数字模式**（`number`）：固定显示前 N 个标签，超出折叠为 `+N...`，不随容器宽度变化
- **响应式模式**（`'responsive'`）：通过 `ResizeObserver` 监听容器宽度，动态计算可容纳的标签数量——容器变窄时自动折叠，变宽时自动展开

折叠的标签可通过 `+N...` 弹出层查看。`foldLabel` 可自定义折叠文案。

> SSR 环境下保守渲染全部标签，客户端 hydration 后按实际宽度计算折叠。

下方拖动滑块改变容器宽度，对比两种模式的差异。

  <!-- en-US -->

### Tag Overflow Adaptation ^[1.2.7](primary)

When too many tags overflow in multiple mode, `maxTagCount` controls folding behavior:

- **Number mode** (`number`): fixed display of first N tags, excess folded as `+N...`, does not change with container width
- **Responsive mode** (`'responsive'`): uses `ResizeObserver` to monitor container width, dynamically calculating visible tag count — auto-folds when narrowing, auto-expands when widening

Folded tags are viewable via `+N...` popover. `foldLabel` customizes the fold text.

> In SSR environments, all tags are conservatively rendered; recalculation happens after client hydration.

Drag the slider below to change container width and compare the two modes.
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { OForm, OFormItem, OSelect, OSlider } from '@opensig/opendesign';

/** 选项数据 */
const options = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Angular', value: 'angular' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Solid', value: 'solid' },
  { label: 'Preact', value: 'preact' },
  { label: 'Qwik', value: 'qwik' },
  { label: 'Lit', value: 'lit' },
  { label: 'Ember', value: 'ember' },
  { label: 'Alpine', value: 'alpine' },
];

/** 预选 8 个值，触发折叠 */
const val = ref(['vue', 'react', 'angular', 'svelte', 'solid', 'preact', 'qwik', 'lit']);

/** 容器宽度（滑块控制） */
const containerWidth = ref(360);
</script>

<template>
  <OForm layout="v" class="demo-select-responsive">
    <OFormItem label="容器宽度">
      <OSlider v-model="containerWidth" :min="200" :max="560" :step="20" :show-input-controls="false" unit="px" show-input class="demo-slider" />
    </OFormItem>
    <OFormItem label="responsive">
      <OSelect v-model="val" :options="options" multiple max-tag-count="responsive" clearable :style="{ width: containerWidth + 'px' }" />
      <template #extra>
        <u>val（{{ val.length }} 项）: {{ JSON.stringify(val) }}</u>
      </template>
    </OFormItem>
    <OFormItem label="固定 3 个">
      <OSelect v-model="val" :options="options" multiple :max-tag-count="3" clearable :style="{ width: containerWidth + 'px' }" />
      <template #extra>
        <u>val（{{ val.length }} 项）: {{ JSON.stringify(val) }}</u>
      </template>
    </OFormItem>
  </OForm>
</template>
<style lang="scss">
.demo-select-responsive {
  .demo-slider {
    max-width: 500px;
  }
}
</style>
