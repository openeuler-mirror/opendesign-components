<docs lang="md">
<!-- zh-CN -->

### 自定义图标

可在 `icon` 插槽中自定义图标

#### 注意事项

##### 1. 图标索引获取

通过 `icon` 插槽的 `index` 属性可获取当前图标索引值，用于：

- 标识图标在评分组件中的位置
- 实现差异化渲染逻辑（如首尾图标特殊样式）

##### 2. 尺寸适配

当修改 `ORate` 的 `size` 属性时，请确保自定义图标能够响应尺寸变化：

```css
.custom-icon {
  /** ORate 组件的 size 属性会修改组件根元素的 font-size 属性值，
      因此可通过 em 相对单位进行图标大小适配 */
  width: 1em;
  height: 1em;
}

.custom-icon-other {
  /** 在不方便使用 em 单位的情况下，可以使用 CSS 变量 */
  width: var(--rate-size);
  height: var(--rate-size);
}
```

##### 3. 选中状态

通过 `icon` 插槽的 `status` 属性可获取当前图标的状态：

- `''`: 未选中
- `'full'`: 选中
- `'half'`: 半选中

自定义图标需要基于这些状态对自身的颜色或形状进行修改。注意：可通过 CSS 变量 `--rate-color-selected` 和 `--rate-color` 分别获取图标选中时的颜色和未选中时的颜色。

<!-- en-US -->

### Custom Icons

Icons can be customized within the `icon` slot.

#### Considerations

##### 1. Icon Index Retrieval

The `index` property of the `icon` slot can be used to retrieve the current icon index value, which is useful for:

- Identifying the position of the icon within the rating component.
- Implementing differentiated rendering logic (e.g., special styles for the first and last icons).

##### 2. Size Adaptation

When modifying the `size` property of `ORate`, ensure that the custom icon can adapt to size changes:

```css
.custom-icon {
  /** The size property of the ORate component modifies the font-size value of the root element,
      so icon size adaptation can be achieved using the em relative unit. */
  width: 1em;
  height: 1em;
}

.custom-icon-other {
  /** When using em units is not convenient, CSS variables can be used instead. */
  width: var(--rate-size);
  height: var(--rate-size);
}
```

##### 3. Selected State

The status property of the icon slot can be used to retrieve the current state of the icon:

- `''`: Not selected
- `'full'`: Selected
- `'half'`: Half-selected

Custom icons should modify their color or shape based on these states.
Note: The selected color and unselected color of the icon can be retrieved via the CSS variables `--rate-color-selected` and `--rate-color`, respectively.
</docs>
<script setup lang="ts">
import { ORate } from '@opensig/opendesign';
</script>

<template>
  <ORate size="large" color="success" allow-half>
    <template #icon>
      <svg viewBox="0 0 24 24" class="custom-icon">
        <ellipse ry="11" rx="11" cy="12" cx="12" fill="currentColor" />
      </svg>
    </template>
  </ORate>
</template>

<style lang="scss" scoped>
.custom-icon {
  width: 1em;
  height: 1em;
}
</style>
