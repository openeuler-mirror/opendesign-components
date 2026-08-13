<docs lang="md">
  <!-- zh-CN -->

### 分词批量创建 ^[NEXT](primary)

通过 `tokenSeparators` 指定分词符，用户在输入框中粘贴或输入分隔符时，自动将分隔出的片段作为新选项批量创建。

- 需同时开启 `allowCreate` 和 `multiple`
- `tokenSeparators` 接收字符串数组，如 `[',', ';']`
- 支持中文逗号 `，` 等多字节分隔符

  <!-- en-US -->

### Token Batch Creation ^[NEXT](primary)

Specify delimiters via `tokenSeparators`. When users type or paste a separator, the split fragments are automatically batch-created as new options.

- Requires both `allowCreate` and `multiple`
- `tokenSeparators` accepts a string array, e.g. `[',', ';']`
- Supports multi-byte separators like `，` (fullwidth comma)
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import { OForm, OFormItem, OSelect } from '@opensig/opendesign';

/** 分词创建：选项列表动态增长 */
const tokenVal = ref<string[]>([]);
const tokenOptions = ref<Array<{ label: string; value: string }>>([]);
</script>
<template>
  <OForm layout="v" class="demo-select-token">
    <OFormItem label="逗号分词">
      <OSelect
        v-model="tokenVal"
        multiple
        allow-create
        :token-separators="[',', '，', ';']"
        :options="tokenOptions"
        placeholder="输入 a,b,c 或 a，b；c 试试"
        class="demo-select"
      />
      <template #extra
        ><u>tokenVal: {{ JSON.stringify(tokenVal) }}</u></template
      >
    </OFormItem>
  </OForm>
</template>
<style lang="scss">
.demo-select-token {
  .demo-select {
    max-width: 320px;
  }
}
</style>
