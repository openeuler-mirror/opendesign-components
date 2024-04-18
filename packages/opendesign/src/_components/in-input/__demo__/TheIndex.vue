<script setup lang="ts">
import '../style';
import InInput from '../InInput.vue';
import { ref, watchEffect } from 'vue';
const inputVal = ref('123');
watchEffect(() => {
  console.log('inputVal changed:', inputVal.value);
});
const onInput = (e: Event) => {
  console.log('onInput:', e);
};
const onChange = (value: string) => {
  console.log('onChange:', value);
};
const onfocus = (e: Event) => {
  console.log('onfocus:', e);
};
const onBlur = (e: Event) => {
  console.log('onBlur:', e);
};
const onClear = () => {
  console.log('onClear');
};
const onPressEnter = (e: Event) => {
  console.log('onPressEnter:', e);
};

const disabled = ref(false);
const toggleDisabled = () => {
  disabled.value = !disabled.value;
};

const type = ref<'text' | 'password'>('text');
const toggleType = () => {
  type.value = type.value === 'text' ? 'password' : 'text';
};
</script>

<template>
  <div class="page-demo">
    <h3>Basic</h3>
    <button @click="toggleDisabled">change disabled</button>
    <button @click="toggleType">change type</button>
    <section class="frame">
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
      <InInput
        class="test-input"
        :type="type"
        v-model="inputVal"
        @input="onInput"
        @focus="onfocus"
        @blur="onBlur"
        @clear="onClear"
        @change="onChange"
        @press-enter="onPressEnter"
        :disabled="disabled"
        clearable
      />
    </section>
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
