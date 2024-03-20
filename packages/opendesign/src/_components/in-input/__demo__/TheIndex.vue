<script setup lang="ts">
import '../style';
import InInput from '../InInput.vue';
import { ref, watchEffect } from 'vue';
const inputVal = ref('123');
watchEffect(() => {
  console.log('inputVal:', inputVal.value);
});
const onInput = (value: string, e: Event) => {
  console.log('onInput:', value, e);
};
const onChange = (value: string) => {
  console.log('onChange:', value);
};
const onfocus = (value: string, e: Event) => {
  console.log('onfocus:', value, e);
};
const onBlur = (value: string, e: Event) => {
  console.log('onBlur:', value, e);
};
const onClear = () => {
  console.log('onClear:');
};
const onPressEnter = (value: string, e: Event) => {
  console.log('onPressEnter:', value, e);
};
</script>

<template>
  <div class="page-demo">
    <h3>Basic</h3>
    <div class="frame">
      <InInput
        class="test-input"
        v-model="inputVal"
        @input="onInput"
        @focus="onfocus"
        @blur="onBlur"
        @clear="onClear"
        @change="onChange"
        @press-enter="onPressEnter"
        clearable
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
.test-input {
  border: 1px solid blue;
  height: 32px;
  padding: 4px 8px;
  box-sizing: border-box;
  line-height: 24px;
}
.frame {
  width: 240px;
}
</style>
