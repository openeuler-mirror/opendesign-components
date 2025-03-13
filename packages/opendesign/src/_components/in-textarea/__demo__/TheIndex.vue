<script setup lang="ts">
import '../style';
import { InTextarea } from '../index';
import { ref } from 'vue';

const inputVal = ref('1234');

const printEvent = (evt: string, v?: string) => {
  console.log(`[${evt}]`, v ?? '', 'value:', inputVal.value);
};

const maxLength = ref(20);
const minLength = ref(10);
const toggle = () => {
  maxLength.value = 10;
  minLength.value = 4;
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

const onChange = (v: string) => {
  inputVal.value = v;
};
</script>

<template>
  <div class="page-demo">
    <h3>Basic</h3>
    <div>value: {{ inputVal }}</div>
    <button @click="toggle">change</button>
    <button @click="toggleType">change type</button>
    <div class="block">
      <p>defaultValue: 你好</p>
      <InTextarea
        class="test-input"
        default-value="你好"
        @clear="() => printEvent('clear')"
        @blur="() => printEvent('blur')"
        @change="onChange"
        @input="() => printEvent('input')"
        @focus="() => printEvent('focus')"
        @press-enter="() => printEvent('press-enter')"
        clearable
        resize="both"
      />
    </div>
    <div class="block">
      <p>max: {{ maxLength }}; min: {{ minLength }} input-on-outlimit: false</p>
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
        :max-length="maxLength"
        :min-length="minLength"
        :input-on-outlimit="false"
        resize="both"
      >
        <template #suffix>
          <button @click="click">123</button>
        </template>
      </InTextarea>
    </div>
    <section block>
      <p>auto width:</p>
      <InTextarea class="test-input" :type="type" v-model="inputVal" auto-size clearable>
        <template #prefix>
          <button @click="click">#prefix</button>
        </template>
        <template #suffix>
          <button @click="click">#suffix</button>
        </template>
      </InTextarea>
    </section>
    <section block>
      <p>auto width: max-width: 300px;min-height: 100px; max-height: 200px</p>
      <InTextarea class="test-input" :type="type" v-model="inputVal" auto-size style="max-width: 300px; min-height: 100px; max-height: 200px" clearable>
        <template #suffix>
          <button @click="click">123</button>
        </template>
      </InTextarea>
    </section>
    <section block>
      <p>auto width: min-width: 100px;min-height: 150px</p>
      <InTextarea class="test-input" :type="type" v-model="inputVal" auto-size style="min-width: 100px; min-height: 60px; min-height: 150px" clearable />
    </section>
  </div>
</template>
<style lang="scss" scoped>
.test-input {
  border: 1px solid blue;
  box-sizing: border-box;
}
.frame {
  width: 240px;
}
</style>
