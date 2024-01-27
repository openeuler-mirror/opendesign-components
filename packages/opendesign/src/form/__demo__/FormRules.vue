<script setup lang="ts">
import { OForm, OFormItem } from '../index';
import { RulesT } from '../types';
import { ref } from 'vue';
import '../../input/style';
import { OInput } from '../../input';
import '../../select/style';
import { OSelect } from '../../select';
import '../../option/style';
import { OOption } from '../../option';
import '../../textarea/style';
import { OTextarea } from '../../textarea';
import '../../checkbox/style';
import { OCheckbox } from '../../checkbox';
import '../../checkbox-group/style';
import { OCheckboxGroup } from '../../checkbox-group';

const textValue = ref('');
const options = [
  { label: 'option 1', value: 1 },
  { label: 'option 2', value: 2 },
  { label: 'option 3', value: 3 },
  { label: 'option 4', value: 4 },
];

const submit = () => {
  console.log('submit');
};

const inputRules: RulesT[] = [
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
          message: '需要小于10数字',
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
const selectRules: RulesT[] = [
  {
    required: true,
    message: 'required message',
  },
  {
    validator: (value?: any) => {
      if (value !== 1) {
        return {
          type: value > 3 ? 'success' : 'warning',
          message: '建议大于3',
        };
      } else {
        return {
          type: 'danger',
          message: '不能小于2',
        };
      }
    },
  },
];

const checkBoxVal = [1];
const checkboxRules: RulesT[] = [
  {
    required: true,
    message: 'required message',
  },
  {
    validator: (value?: any[]) => {
      if (!value?.includes(1)) {
        return {
          type: 'danger',
          message: '1必选',
        };
      }
      if (!value?.includes(2)) {
        return {
          type: 'warning',
          message: '建议选择2',
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
      <OFormItem label="标题文本1" :rules="inputRules">
        <OInput />
      </OFormItem>
      <OFormItem label="标题文本1" required>
        <OInput />
        <template #message="{ type, message }"> type: {{ type }} <br />message: {{ message.join('|') }} </template>
      </OFormItem>
      <OFormItem label="标题文本2" :rules="selectRules">
        <OSelect clearable>
          <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </OSelect>
      </OFormItem>
      <OFormItem label="标题文本3" :rules="inputRules">
        <OTextarea v-model="textValue" />
      </OFormItem>
      <OFormItem label="标题文本3" :rules="checkboxRules">
        <OCheckboxGroup v-model="checkBoxVal">
          <OCheckbox ref="checkBoxRef2" :value="1">选项1</OCheckbox>
          <OCheckbox :value="2">选项2</OCheckbox>
          <OCheckbox :value="3">选项3</OCheckbox>
        </OCheckboxGroup>
      </OFormItem>
      <div>
        <button @click="submit">提交</button>
      </div>
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
