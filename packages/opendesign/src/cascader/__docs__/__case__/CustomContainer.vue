<docs lang="md">
<!-- zh-CN -->
### 自定义级联选择器

使用更底层的 `OCascaderPanel` 组件（配合 `OSelect` 组件），可以实现更复杂的交互效果。

<!-- en-US -->
### Custom Cascader

By using the lower-level `OCascaderPanel` component (in combination with the `OSelect` component), more complex interactive effects can be achieved.

</docs>
<script lang="ts" setup>
import { ref } from 'vue';
import { OCascaderPanel, OSelect, OTag, ODivider} from '@opensig/opendesign';

const options = [
  {
    label: 'Option 1',
    value: '1',
    children: [
      {
        label: 'Sub-option 1-1',
        value: '1-1',
        children: [
          {
            label: 'Sub-option 1-1-1',
            value: '1-1-1',
          },
          {
            label: 'Sub-option 1-1-2',
            value: '1-1-2',
          },
        ],
      },
      {
        label: 'Sub-option 1-2',
        value: '1-2',
      },
    ],
  },
  {
    label: 'Option 2',
    value: '2',
    children: [
      {
        label: 'Sub-option 2.1',
        value: '2.1',
      },
      {
        label: 'Sub-option 2.2',
        value: '2.2',
      },
    ],
  },
];
const cascaderValue = ref('1-1-2');
const hotOption = [
  {
    label: 'Sub-option 1-1-2',
    value: '1-1-2',
  },
  {
    label: 'Sub-option 1-2',
    value: '1-2',
  },
  {
    label: 'Sub-option 2.1',
    value: '2.1',
  },
];
const selectHotOption = (val: string) => {
  const option = hotOption.find((item) => item.value === val);
  if (option) {
    cascaderValue.value = option.value;
  }
};
</script>

<template>
  <OSelect v-model="cascaderValue">
    <div class="cascader-wrapper">
      <div>Suggested options:</div>
      <div class="hot-option">
        <OTag v-for="item in hotOption" :key="item.value" class="tag" @click="selectHotOption(item.value)">{{ item.label }}</OTag>
      </div>
      <ODivider class="divider" />
      <!-- Current `OCascaderPanel` controlled mode has issues, need to use `key` to force re-render, otherwise data won't update -->
      <OCascaderPanel v-model="cascaderValue" :key="cascaderValue" :options="options" class="cascader-panel" />
    </div>
  </OSelect>
</template>
<style lang="scss" scoped>
.cascader-wrapper {
  position: relative;
}
.hot-option {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}
.tag {
  cursor: pointer;
}
.divider {
  --o-divider-gap: 4px;
}
</style>