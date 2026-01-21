<docs lang="md">
<!-- zh-CN -->

#### 单选框组

在 `ORadio` 数量较多的情况下，可以通过 `ORadioGroup` 统一管理单选框的状态，比如：

1. 将所有 `ORadio` 的双向绑定委托给 `ORadioGroup`
2. `disabled` 属性控制所有的单选框是否禁用
3. `direction` 属性控制多选框组内多选框的排列方向

<!-- en-US -->

#### Radio Group

When there are a large number of `ORdio`, the status of the radio boxes can be uniformly managed through `ORadioGroup`, for example:

1. Delegate all the two-way bindings of `ORadio` to `ORadioGroup`.
2. The `disabled` attribute controls whether all radio boxes are disabled.
3. The `direction` attribute controls the arrangement direction of the multiple-choice boxes within a multiple-choice box group.
</docs>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { ORadio, ORadioGroup, OSwitch, type DirectionT } from '@opensig/opendesign';

const radioVal = ref('');
const switchVal1 = ref(false);
const switchVal2 = ref(false);

const direction = computed<DirectionT>(() => {
  if (switchVal1.value) {
    return 'v';
  }
  return 'h';
});
</script>
<template>
  <div class="demo-radio-group-wrap">
    <div class="switch-operation">
      <span class="operation-des">切换排布方向</span>
      <OSwitch v-model="switchVal1" />
    </div>
    <div class="switch-operation">
      <span class="operation-des">切换禁用状态</span>
      <OSwitch v-model="switchVal2" />
    </div>
    <ORadioGroup v-model="radioVal" :disabled="switchVal2" :direction="direction">
      <ORadio value="peach">选项1</ORadio>
      <ORadio value="watermelon">选项2</ORadio>
      <ORadio value="pear">选项3</ORadio>
    </ORadioGroup>
    <div class="radio-val">Selected：{{ radioVal }}</div>
  </div>
</template>
<style lang="scss">
.demo-radio-group-wrap {
  .switch-operation {
    display: flex;
    align-items: center;
    margin-bottom: 12px;
  }
  .operation-des {
    margin-right: 12px;
  }
  .radio-val {
    margin-top: 12px;
  }
}
</style>
