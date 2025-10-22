<docs lang="md">
<!-- zh-CN -->

### 指令

可通过 `v-loading` 指令来使用 OLoading 组件。

- value
  - `true` 显示
  - `false` 隐藏
  - `LoadingPropsT` 配置 OLoading 属性
- modifiers
  - `body` 是否挂载到 body 上
  - `nomask` 不显示遮罩

可通过 `setVLoadingOption` 方法来设置全局的 OLoading 属性，这通常在配置全局主题时使用。

<!-- en-US -->

### Directive

The `OLoading` component can be used via the `v-loading` directive.

- value
  - `true`: Show
  - `false`: Hide
  - `LoadingPropsT`: Configure OLoading properties
- modifiers
  - `body`: Whether to mount to the body
  - `nomask`: Do not display the mask

Use the `setVLoadingOption` method to set global OLoading properties, which is typically used when configuring the global theme.
</docs>
<script setup lang="ts">
import { ref, reactive, markRaw } from 'vue';
import { vLoading, setVLoadingOption, OButton, OIconMinus, type LoadingPropsT } from '@opensig/opendesign';

setVLoadingOption({ label: 'v-loading...' });

const bodyVisible = ref(false);
const loadingProps = reactive<Partial<LoadingPropsT>>({
  icon: markRaw(OIconMinus),
  iconRotating: true,
  visible: true,
  label: 'props loading...',
});
const handleBodyBtnClick = () => {
  bodyVisible.value = true;
  setTimeout(() => {
    bodyVisible.value = false;
  }, 3000);
};
</script>
<template>
  <!-- The loading mount to body -->
  <OButton v-loading.body="bodyVisible" @click="handleBodyBtnClick" class="btn">Body loading</OButton>
  <OButton @click="loadingProps.visible = !loadingProps.visible" class="btn">Container loading - {{ loadingProps.visible }}</OButton>
  <OButton :disabled="!loadingProps.visible" @click="loadingProps.label = `${loadingProps.label} 1`" class="btn">change Container label</OButton>
  <!-- The loading mount to container -->
  <div v-loading="loadingProps" class="container"></div>
</template>
<style scoped lang="scss">
.btn + .btn {
  margin-left: 12px;
}
.container {
  height: 100px;
  max-width: 200px;
  background-color: pink;
  position: relative;
  margin-top: 20px;
}
</style>
