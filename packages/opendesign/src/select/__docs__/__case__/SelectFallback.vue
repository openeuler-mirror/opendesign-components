<docs lang="md">
  <!-- zh-CN -->

### 兜底显示与异步加载 ^[1.2.7](primary)

当值不在选项列表中时，`fallbackOption` 可自定义兜底 label 显示。

组件内部维护 `cachedOptionMap`，选项卸载后已选值的 label 仍会保留，适合异步加载场景。

  <!-- en-US -->

### Fallback & Async Loading ^[1.2.7](primary)

When a value is not in the option list, `fallbackOption` can customize the fallback label display.

The component internally maintains a `cachedOptionMap`, preserving labels for selected values even after options unmount, suitable for async loading scenarios.
</docs>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { OForm, OFormItem, OSelect } from '@opensig/opendesign';

/** 同步加载的选项 */
const syncVal = ref(42);
const syncOptions = ref([{ label: 'Known', value: 1 }]);

/** 兜底函数：值不在选项中时显示 */
const fallback = (value: string | number) => ({
  label: `未匹配项 ${value}`,
  value,
});

/** 模拟异步加载 */
const asyncVal = ref('a');
const asyncOptions = ref<Array<{ label: string; value: string }>>([]);

onMounted(() => {
  setTimeout(() => {
    asyncOptions.value = [{ label: '异步加载 A', value: 'a' }];
  }, 500);
});
</script>
<template>
  <OForm layout="v" class="demo-select-fallback">
    <OFormItem label="兜底显示">
      <OSelect v-model="syncVal" :options="syncOptions" :fallback-option="fallback" clearable class="demo-select" />
      <template #extra
        ><u>syncVal: {{ JSON.stringify(syncVal) }}</u></template
      >
    </OFormItem>
    <OFormItem label="异步加载">
      <OSelect
        v-model="asyncVal"
        :options="asyncOptions"
        :fallback-option="(v: string | number) => ({ label: '加载中…', value: v })"
        clearable
        class="demo-select"
      />
      <template #extra
        ><u>asyncVal: {{ JSON.stringify(asyncVal) }}</u></template
      >
    </OFormItem>
  </OForm>
</template>
<style lang="scss">
.demo-select-fallback {
  .demo-select {
    max-width: 320px;
  }
}
</style>
