<docs lang="md">
<!-- zh-CN -->

### 函数式调用

通过 `useImageViewer` Composable 可在 `setup` 中命令式地管理图片预览，无需在模板中声明 `OImageViewer`。返回的句柄包含 `visible` 响应式 ref 与 `open` / `close` / `unmount` 方法，调用方既可直接调用方法，也可通过 `visible.value` 双向控制。在 `setup` 等效应作用域内调用时，宿主作用域销毁会自动调用 `unmount()` 释放挂载实例；**<u>若在作用域外（如事件回调、工具函数中）调用，则需调用方在不再需要时手动调用 `unmount()` 以释放 DOM 并避免内存泄漏</u>**。

入参支持 `MaybeRefOrGetter`——`previewList` / `currentIndex` 等值 props 可传 `ref` / `getter` / 原始值，源变化时正在显示的预览会响应式同步。事件回调为普通函数，在事件触发时直接调用。

下方示例模拟了异步请求数据的典型场景：`previewList` 初始为空数组，点击"请求数据"后通过 mock 接口填充 `imgList` ref，随后即可打开预览。由于传入的是 `ref` 而非静态值，数据到达后打开的预览会自动呈现最新内容。

函数式场景下 `layerOptions` 默认为 `{ mask: true, maskClose: false, buttonClose: true, wrapper: null }`，与组件场景一致，可通过传入 `layerOptions` 覆盖。支持全部组件 props（`visible` 除外，由 hook 内部维护）及事件回调（`onClose` / `onSwitch` / `onRotate` / `onZoomDrag` / `onError`）。

`autoDestroyOnClose` 控制关闭时是否自动销毁挂载实例：`true` 时 `close()` 卸载实例并释放 DOM，下次 `open()` 重新挂载；`false` 时仅切换 `visible`，保留实例以便复用。默认值在 effect scope 内为 `false`，作用域外为 `true`。

<!-- en-US -->

### Functional API

Use the `useImageViewer` composable to imperatively manage image preview from `setup` — no need to declare `OImageViewer` in the template. The returned handle exposes a `visible` reactive ref alongside `open` / `close` / `unmount` methods; callers may invoke the methods directly or toggle `visible.value` for bidirectional control. When called within an effect scope such as `setup`, the host scope's disposal automatically invokes `unmount()` to release the mounted instance. **<u>When called outside an effect scope (e.g., in an event handler or utility function), the caller must manually invoke `unmount()` once the preview is no longer needed to release the DOM and avoid memory leaks.</u>**

Options accept `MaybeRefOrGetter` — value props like `previewList` / `currentIndex` accept `ref` / `getter` / raw values, and changes to reactive sources are reflected live in the open preview. Event callbacks are plain functions, invoked directly when events fire.

The example below simulates a typical async-data scenario: `previewList` starts as an empty array. Click "Fetch Data" to populate the `imgList` ref via a mock API, then open the preview. Because a `ref` is passed instead of a static value, the open preview reflects the latest content once data arrives.

In functional mode, `layerOptions` defaults to `{ mask: true, maskClose: false, buttonClose: true, wrapper: null }`, matching the component scenario. Override via the `layerOptions` option. Supports all component props (except `visible`, managed internally) and event callbacks (`onClose` / `onSwitch` / `onRotate` / `onZoomDrag` / `onError`).

`autoDestroyOnClose` controls whether the mounted instance is automatically destroyed on close: when `true`, `close()` unmounts the instance and releases the DOM — the next `open()` re-mounts; when `false`, it only toggles `visible`, keeping the instance for reuse. Defaults to `false` within an effect scope and `true` outside.
</docs>

<script setup lang="ts">
import { ref } from 'vue';
import { OButton, useImageViewer } from '@opensig/opendesign';

/** 预览图片地址列表，初始为空，由 mock 接口异步填充 */
const imgList = ref<string[]>([]);

/** 数据请求状态 */
const loading = ref(false);

/** mock 接口返回的图片池 */
const MOCK_IMAGES = [
  'https://www.openeuler.org/img/banners/20230418-odd.png',
  'https://www.hiascend.com/p/resource/202511/75b8f0b96d9645b4bd0533782f4b2213.JPG',
  'https://www.hiascend.com/error',
];

/**
 * 模拟异步请求图片数据
 * @description 通过 setTimeout 模拟网络延迟，延迟结束后将 mock 数据写入 `imgList`。
 * 由于 `imgList` 是 ref 且已透传给 `useImageViewer`，数据到达后正在显示的预览会响应式更新。
 */
const fetchImages = (): Promise<void> => {
  loading.value = true;
  return new Promise((resolve) => {
    setTimeout(() => {
      imgList.value = [...MOCK_IMAGES];
      loading.value = false;
      resolve();
    }, 800);
  });
};

const { visible, open, close } = useImageViewer({
  previewList: imgList,
  currentIndex: 0,
  zoomRate: 1.1,
  minScale: 0.6,
  maxScale: 5,
  showProgress: true,
  toolbar: ['zoomOut', 'zoomIn', 'reset', 'rotateLeft', 'rotateRight'],
  onClose: () => console.log('closed'),
});
</script>

<template>
  <div class="demo-wrap">
    <OButton color="primary" variant="solid" :loading="loading" @click="fetchImages">
      {{ loading ? '请求中…' : '请求数据' }}
    </OButton>
    <OButton class="demo-btn" color="primary" variant="solid" @click="open"> 函数式打开预览 </OButton>
    <OButton class="demo-btn close" v-if="visible" color="primary" variant="solid" @click="close">手动关闭</OButton>
  </div>
</template>

<style lang="scss" scoped>
.demo-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}

.demo-btn {
  margin-left: 12px;

  &.close {
    z-index: 9999;
    position: fixed;
    right: 40px;
    bottom: 40px;
  }
}
</style>
