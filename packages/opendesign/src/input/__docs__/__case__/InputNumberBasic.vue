<docs lang="md">
  <!-- zh-CN -->

#### 数字输入框

  <!-- en-US -->

#### Digital input box
</docs>
<script setup lang="ts">
import { ref, computed } from 'vue';
import { OInputNumber, isNumber, OIconDanger } from '@opensig/opendesign';

const inputVal = ref();
const placeholder = '1~100';

const color = computed(() => {
  const v = Number(inputVal.value);
  if (inputVal.value === undefined || (isNumber(v) && v >= 1 && v <= 100)) {
    return 'normal';
  }
  return 'danger';
});
</script>
<template>
  <div class="demo-input-number-wrap">
    <div class="demo-top">
      <OInputNumber v-model="inputVal" :color="color" :placeholder="placeholder" controls="none" class="demo-input-number" />
      <span class="input-unit"> Mbite </span>
    </div>
    <div v-if="color === 'danger'" class="demo-bottom">
      <OIconDanger class="demo-error-icon" />
      <span class="demo-error-text"> 请输入正确内容 </span>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.demo-input-number {
  --_input-text-align: center;
  max-width: 82px;

  &.o_box-outline.o_box-danger {
    --_box-bd-color: var(--o-color-danger1);
    --_box-bd-color-hover: var(--o-color-danger2);
  }
}
.input-unit {
  margin-left: 8px;
  color: var(--o-color-info1);
}

.demo-bottom {
  display: flex;
  align-items: center;
  padding-left: 16px;
  margin-top: 8px;
  font-size: 12px;
  line-height: 18px;
  color: var(--o-color-danger1);

  .demo-error-icon {
    margin-right: 4px;
    font-size: 16px;
  }
}
</style>
