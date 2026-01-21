<docs lang="md">
<!-- zh-CN -->

#### 运营下拉按钮

- **配置方式**：需同时传递两个参数
  `color="brand"`（标识颜色为主题色） + `variant="solid"`（实心样式）

<!-- en-US -->

#### Operational Dropdown Buttons

- **Configuration Method**: Requires passing two parameters simultaneously:
  `color="brand"` (indicates the color as the theme color) + `variant="solid"` (solid style).
</docs>
<script setup lang="ts">
import { reactive } from 'vue';
import { ODropdown, ODropdownItem, OButton, OIconChevronDown, type SizeT, type PopupTriggerT } from '@opensig/opendesign';
interface ListT {
  size: SizeT;
  visible: boolean;
  forbid: boolean;
  trigger: PopupTriggerT;
}
const list = reactive<Array<ListT>>([
  {
    size: 'large',
    visible: false,
    forbid: false,
    trigger: 'click-outclick',
  },
  {
    size: 'medium',
    visible: false,
    forbid: false,
    trigger: 'click-outclick',
  },
  {
    size: 'small',
    visible: false,
    forbid: true,
    trigger: 'none',
  },
]);
const options = [
  { label: '选项一', value: 'opt1' },
  { label: '选项二', value: 'opt2' },
  { label: '选项三', value: 'opt3' },
];
</script>
<template>
  <div class="row">
    <template v-for="(item, idx) in list" :key="idx">
      <ODropdown v-model:visible="item.visible" :trigger="item.trigger" :size="item.size" class="o-dropdown-btn-wrap">
        <OButton color="brand" variant="solid" round="pill" :size="item.size" :disabled="item.forbid">
          下拉按钮
          <template #suffix>
            <OIconChevronDown class="icon" :class="{ active: item.visible }" />
          </template>
        </OButton>
        <template #dropdown>
          <ODropdownItem v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            {{ item.label }}
          </ODropdownItem>
        </template>
      </ODropdown>
    </template>
  </div>
</template>
<style scoped lang="scss">
.icon {
  transform: rotate(0);
  transition: all 0.2s linear;
}
.active {
  transform: rotate(180deg);
  transition: all 0.2s linear;
}
</style>
