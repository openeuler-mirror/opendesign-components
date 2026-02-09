<docs lang="md">
<!-- zh-CN -->

### 函数式用法

通过调用 `useToast` 函数实现，可传入 `target` 参数，用于指定 `toast` 显示在哪个元素附近；

可以通过 `duration` 属性控制 `toast` 持续显示的时间，如果不传，当未传递 `long` 属性时，默认持续时间为2000ms，设置 `long` 为真值时，默认持续时间为3500ms；

可以通过 `content` 属性控制 `toast` 显示的内容，支持 `string`、`VNode`、`Component` 形式；

可以通过 `position` 属性控制 `toast` 出现的位置，包括 `top` 、`center` 、`bottom`，默认为 `bottom`；

可以通过 `targetAlign` 设置 `toast` 与目标元素的对齐方式，支持 `center`（居中）、`left` （左对齐）、`right`（右对齐）；
可以通过 `targetOffset` 设置 `toast` 与目标元素之间的距离，注意：当 `targetAlign` 为 `center` 时，该属性不会生效；

注意：仅当指定了 `target` 元素时，`targetAlign`、`targetOffset` 才会生效。

<!-- en-US -->

This is achieved by calling the `useToast` function, and a `target` parameter can be passed in to specify where the `toast` should be displayed relative to which element.

The `duration` attribute can be used to control the duration for which the `toast` remains displayed. If not specified, when the `long` attribute is not passed, the default duration is 2000ms. When the `long` attribute is set to true, the default duration is 3500ms.

The content displayed by the `toast` can be controlled through the `content` attribute, and it supports the forms of `string`, `VNode`, and `Component`.

The position of the `toast` can be controlled through the `position` attribute, including `top`, `center` and `bottom`. The default position is `bottom`.

The `targetAlign` property can be used to set the alignment of the `toast` with the target element, and it supports `center` (centered), `left` (left-aligned), and `right` (right-aligned).

The `targetOffset` property can be used to set the distance between the `toast` and the target element. Note: when `targetAlign` is `center`, this property will not take effect.

Note: The `targetAlign` and `targetOffset` settings will only take effect when the `target` element is specified.

### Functional usage
</docs>
<script setup lang="ts">
import { h } from 'vue';
import { OButton, useToast, OLink, OIconChevronRight } from '@opensig/opendesign';

const { show: showToast } = useToast();

const handleClick = () => {
  showToast({
    long: true,
    content: () => [
      h(
        'span',
        {
          style: {
            marginRight: '6px',
          },
        },
        'toast提示',
      ),
      h(
        OLink,
        {
          color: 'normal',
          style: {
            flexShrink: 0,
            '--o-color-link1': 'var(--o-color-info1-inverse)',
          },
        },
        {
          default: () => '文字按钮',
          suffix: () => h(OIconChevronRight),
        },
      ),
    ],
  });
};
</script>
<template>
  <OButton @click="handleClick" color="primary" variant="solid">showToast</OButton>
</template>
