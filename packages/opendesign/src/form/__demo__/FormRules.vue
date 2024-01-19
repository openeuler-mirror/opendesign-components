<script setup lang="ts">
import { OForm, OFormItem } from '../index';
import '../../input/style';
import { OInput } from '../../input';
import '../../select/style';
import { OSelect } from '../../select';
import '../../option/style';
import { OOption } from '../../option';
import '../../textarea/style';
import { OTextarea } from '../../textarea';
import { RulesT } from '../types';
import { ref } from 'vue';

const textValue = ref('');
const options = [
  { label: 'option 1', value: 'opt1' },
  { label: 'long long long long long long long long long long long long text option 2', value: 'opt2' },
  { label: 'option 3', value: 'opt3' },
  { label: 'option 4', value: 'opt4' },
];

const rules: RulesT[] = [
  {
    required: true,
    message: 'required message',
  },
  {
    validator: (value?: any) => {
      if (value === '123') {
        return {
          type: 'danger',
          message: '不能输入123',
        };
      }
    },
  },
  {
    validator: (value?: any) => {
      if (isNaN(Number(value))) {
        return {
          type: 'danger',
          message: '需要输入数字',
        };
      }
    },
  },

  {
    validator: (value?: any) => {
      const n = Number(value);
      if (n > 10) {
        return {
          type: 'warning',
          message: '需要大于10数字',
        };
      }
    },
  },
  {
    validator: (value?: any) => {
      const n = Number(value);
      if (n % 2 !== 0) {
        return {
          type: 'warning',
          message: '需要输入偶数',
        };
      }
    },
  },
];
</script>
<template>
  <h4>校验</h4>

  <section>
    <OForm class="form" has-required>
      <OFormItem label="标题文本1" :rules="rules">
        <OInput />
      </OFormItem>
      <OFormItem label="标题文本1" :rules="rules">
        <OInput />
        <template #message="{ type, message }"> type: {{ type }} <br />message: {{ message.join('|') }} </template>
      </OFormItem>
      <OFormItem label="标题文本2">
        <OSelect>
          <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </OSelect>
      </OFormItem>
      <OFormItem label="标题文本3">
        <OTextarea v-model="textValue" />
      </OFormItem>
    </OForm>
  </section>
</template>
<style lang="scss">
.form {
  width: 100%;
}
.link {
  cursor: pointer;
  color: var(--o-color-success1);
  &.current {
    color: var(--o-color-danger1);
  }
}
</style>
