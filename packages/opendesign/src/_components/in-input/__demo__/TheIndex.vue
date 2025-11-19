<script setup lang="ts">
import '../style';
import InInput from '../InInput.vue';
import { ref } from 'vue';

const inputVal = ref('124567123');

const printEvent = (evt: string, v?: string) => {
  console.log(`[${evt}]`, v ?? '', 'inputVal:', inputVal.value);
};

const disabled = ref(false);
const maxLength = ref(6);
const minLength = ref(2);
const toggle = () => {
  disabled.value = !disabled.value;
  maxLength.value = 5;
  minLength.value = 2;
};

const type = ref<'text' | 'password'>('text');
const toggleType = () => {
  type.value = type.value === 'text' ? 'password' : 'text';
};

const validate = (value: string): boolean => {
  return !(value.length % 2);
};

const onUpdate = (val: string) => {
  inputVal.value = val;
  console.log('onUpdate', val);
};

const format = (val: string) => {
  return `￥${val.replace(/\B(?=(\d{1})+(?!\d))/g, ',')}`;
};

const valueOnInvalidChange = (currentValue: string, lastValid: string) => {
  console.log('valueOnInvalidChange:', currentValue, lastValid);
  return lastValid || currentValue;
};

const onChange = (currentValue: string, lastValue: string) => {
  console.log('change:', currentValue, lastValue);
  inputVal.value = currentValue;
};

const count = ref(1);
window.setInterval(() => {
  count.value++;
}, 1000);
</script>

<template>
  <div class="page-demo">
    <h3>Basic</h3>
    <div>value: {{ inputVal }}</div>
    <button @click="toggle">change</button>
    <button @click="toggleType">change type</button>
    <section>
      defaultValue: {{ inputVal }}; format
      <InInput
        input-id="123"
        class="test-input"
        :default-value="inputVal"
        :validate="validate"
        @clear="() => printEvent('clear')"
        @blur="() => printEvent('blur')"
        @change="onChange"
        @input="(e:Event, value:string) => printEvent('input', value)"
        @focus="() => printEvent('focus')"
        @press-enter="() => printEvent('press-enter')"
        clearable
        :format="format"
        :valueOnInvalidChange="valueOnInvalidChange"
        :input-on-outlimit="false"
        show-length="auto"
        :max-length="maxLength"
        :min-length="minLength"
      />
    </section>
    <section>
      max: {{ maxLength }}; min: {{ minLength }} input-on-outlimit: false
      <InInput
        input-id="1234"
        class="test-input"
        :model-value="inputVal"
        @update:model-value="onUpdate"
        :validate="validate"
        @clear="() => printEvent('clear')"
        @blur="() => printEvent('blur')"
        @change="(v:string) => printEvent('change', v)"
        @input="(_e:Event, v:string) => printEvent('input', v)"
        @focus="() => printEvent('focus')"
        @press-enter="() => printEvent('press-enter')"
        clearable
        :max-length="maxLength"
        :min-length="minLength"
        :input-on-outlimit="false"
      />
    </section>
    <section>
      auto width; max: 8;
      <InInput class="test-input" :type="type" v-model="inputVal" auto-width :max-length="8" clearable/>
    </section>
    <section>
      auto width: max-width: 300px
      <InInput class="test-input" :type="type" v-model="inputVal" auto-width style="max-width: 300px" show-length="always"/>
    </section>
    <section>
      auto width: min-width: 100px
      <InInput class="test-input" :type="type" v-model="inputVal" auto-width style="min-width: 100px" />
    </section>
    <section>
      {{ inputVal }}
      <InInput class="test-input" v-model="inputVal" :max-length="12">
        <template #suffix>
          <div>{{ count }}</div>
        </template>
        <template #length="{length}"><b>{{ length }}</b></template>
      </InInput>
    </section>
  </div>
</template>
<style lang="scss" scoped>
.test-input {
  border: 1px solid blue;
  height: 32px;
  padding: 4px 8px;
  box-sizing: border-box;
  line-height: 22px;
}
.frame {
  width: 240px;
}
</style>
