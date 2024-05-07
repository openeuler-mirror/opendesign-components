<script setup lang="ts">
import '../style';
import { InTextarea } from '../index';
import { ref, watchEffect } from 'vue';
const inputVal = ref('123');

const printEvent = (evt: string, v?: string) => {
  console.log(`[${evt}]`, v ?? '', 'value:', inputVal.value);
};

const disabled = ref(false);
const toggleDisabled = () => {
  disabled.value = !disabled.value;
};

const type = ref<'text' | 'password'>('text');
const toggleType = () => {
  type.value = type.value === 'text' ? 'password' : 'text';
};

const validate = (value: string): boolean => {
  return Boolean(value.length % 2);
};
const click = () => {
  alert(123);
};
</script>

<template>
  <div class="page-demo">
    <h3>Basic</h3>
    <div>value: {{ inputVal }}</div>
    <button @click="toggleDisabled">change disabled</button>
    <button @click="toggleType">change type</button>
    <section>
      <InTextarea
        class="test-input"
        v-model="inputVal"
        :validate="validate"
        @clear="() => printEvent('clear')"
        @blur="() => printEvent('blur')"
        @change="(v) => printEvent('change', v)"
        @input="() => printEvent('input')"
        @focus="() => printEvent('focus')"
        @press-enter="() => printEvent('press-enter')"
        clearable
        :max-length="20"
      >
        <template #suffix>
          <button @click="click">123</button>
        </template>
      </InTextarea>
    </section>
    <section>
      auto width:
      <InTextarea class="test-input" :type="type" v-model="inputVal" auto-size clearable />
    </section>
    <section>
      auto width: max-width: 300px
      <InTextarea class="test-input" :type="type" v-model="inputVal" auto-size style="max-width: 300px; min-height: 100px" clearable />
    </section>
    <section>
      auto width: min-width: 100px
      <InTextarea class="test-input" :type="type" v-model="inputVal" auto-size style="min-width: 100px; min-height: 60px" clearable />
    </section>
  </div>
</template>
<style lang="scss" scoped>
.test-input {
  border: 1px solid blue;
  // height: 32px;
  // padding: 4px 8px;
  box-sizing: border-box;
  // line-height: 22px;
}
.frame {
  width: 240px;
}
</style>
