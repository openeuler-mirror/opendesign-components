<script setup lang="ts">
import '../style';
import InInput from '../InInput.vue';
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
</script>

<template>
  <div class="page-demo">
    <h3>Basic</h3>
    <div>value: {{ inputVal }}</div>
    <button @click="toggleDisabled">change disabled</button>
    <button @click="toggleType">change type</button>
    <section>
      <InInput
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
        :max-length="8"
        :min-length="4"
        :input-on-outlimit="false"
      />
    </section>
    <section>
      auto width:
      <InInput class="test-input" :type="type" v-model="inputVal" auto-width :max-length="8" clearable />
    </section>
    <section>
      auto width: max-width: 300px
      <InInput class="test-input" :type="type" v-model="inputVal" auto-width style="max-width: 300px" />
    </section>
    <section>
      auto width: min-width: 100px
      <InInput class="test-input" :type="type" v-model="inputVal" auto-width style="min-width: 100px" />
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
