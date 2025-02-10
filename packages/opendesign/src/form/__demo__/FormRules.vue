<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { OForm, OFormItem, FieldResultT } from '../index';
import { RulesT, ValidatorT } from '../types';
import '../../input/style';
import { OInput } from '../../input';
import '../../input-number/style';
import { OInputNumber } from '../../input-number';
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
import '../../radio/style';
import { ORadio } from '../../radio';
import '../../radio-group/style';
import { ORadioGroup } from '../../radio-group';
import '../../upload/style';
import { OUpload, UploadFileT } from '../../upload';
import '../../button/style';
import { OButton } from '../../button';

const options = [
  { label: 'option 1', value: 1 },
  { label: 'option 2', value: 2 },
  { label: 'option 3', value: 3 },
  { label: 'option 4', value: 4 },
];

let formModel = ref({
  a: {
    input1: '',
  },
  inputNumber: 10,
  input2: '123',
  select1: '',
  textarea1: '',
  checkbox: [],
  radio: '',
  uploadList: [],
});

const inputVal: ValidatorT = (value?: string) => {
  if (value === '123') {
    return {
      type: 'danger',
      message: '不能输入123',
    };
  }
  if (value === '') {
    return {
      type: 'danger',
      message: '不能为空',
    };
  }
};
const inputRules1: RulesT[] = [
  {
    triggers: ['change', 'blur'],
    validator: inputVal,
  },
  {
    triggers: ['input'],
    validator: inputVal,
  },
];

const inputRules: RulesT[] = [
  {
    required: true,
    message: 'required message',
    triggers: ['blur', 'change'],
  },
  {
    validator: (value?: string) => {
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

const inputNumberRules: RulesT[] = [
  {
    validator: (value: number) => {
      if (value % 2 === 0) {
        return {
          type: 'danger',
          message: '必须是奇数',
        };
      }
      if (value > 10) {
        return {
          type: 'warning',
          message: '数字建议小于10',
        };
      }
    },
  },
];

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

const radioRules: RulesT[] = [
  {
    required: true,
    message: 'required message',
  },
  {
    validator: (value: number) => {
      if (value < 3) {
        return {
          type: 'warning',
          message: '建议选项小于3',
        };
      }
    },
  },
];
const uploadRules: RulesT[] = [
  {
    required: true,
    message: '请至少上传一个文件',
  },
  {
    validator: (value: UploadFileT[]) => {
      if (value.length <= 2) {
        return {
          type: 'warning',
          message: '建议上传多与2个文件',
        };
      }
    },
  },
];
const onUploadChange = () => {
  console.log(formModel.value.uploadList);
};

const values = computed(() =>
  Object.keys(formModel.value).map((k) => {
    return `${k}: ${JSON.stringify(formModel.value[k as keyof typeof formModel.value])}`;
  })
);
// console.log(values);

const formRef = ref<InstanceType<typeof OForm>>();
const reset = () => {
  formRef.value?.resetFields();
};
const clear = () => {
  formRef.value?.clearValidate();
};

const onFormSubmit = (results: FieldResultT[]) => {
  if (results.find((item) => item?.type === 'danger')) {
    console.error('check failed!');
  } else {
    console.info('check pass!');
  }
};
const changeModel = () => {
  formModel.value = {
    a: {
      input1: '1',
    },
    inputNumber: 21,
    input2: '1234',
    select1: '',
    textarea1: '',
    checkbox: [],
    radio: '',
    uploadList: [],
  };
  formModel.value.select1 = '1';
  formModel.value.textarea1 = '1';
};
</script>
<template>
  <h4>校验</h4>
  <p>{{ formModel }}</p>
  <button @click="changeModel">change</button>
  <section>
    <OForm ref="formRef" class="form" has-required :model="formModel" @submit="onFormSubmit">
      <OFormItem label="必选文本1" required field="input2">
        <OInput v-model="formModel.input2" />
        <template #message="{ type, message }"> type: {{ type }} | message: {{ message.join('|') }} </template>
      </OFormItem>
      <OFormItem label="标题文本1" :rules="inputRules1" field="a.input1">
        <OInput v-model="formModel.a.input1" />
      </OFormItem>
      <OFormItem label="标题文本1" :rules="inputNumberRules" field="inputNumber">
        <OInputNumber v-model="formModel.inputNumber" />
      </OFormItem>
      <OFormItem label="标题文本2" :rules="selectRules" field="select1">
        <OSelect v-model="formModel.select1" clearable>
          <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </OSelect>
      </OFormItem>
      <OFormItem label="标题文本3" :rules="inputRules" field="textarea1">
        <OTextarea v-model="formModel.textarea1" />
      </OFormItem>
      <OFormItem label="标题文本3" :rules="checkboxRules" field="checkbox">
        <OCheckboxGroup v-model="formModel.checkbox">
          <OCheckbox ref="checkBoxRef2" :value="1">选项1</OCheckbox>
          <OCheckbox :value="2">选项2</OCheckbox>
          <OCheckbox :value="3">选项3</OCheckbox>
        </OCheckboxGroup>
      </OFormItem>
      <OFormItem label="标题文本3" :rules="radioRules" field="radio">
        <ORadioGroup v-model="formModel.radio">
          <ORadio ref="ORadioRef2" :value="1">选项1</ORadio>
          <ORadio :value="2">选项2</ORadio>
          <ORadio :value="3">选项3</ORadio>
        </ORadioGroup>
      </OFormItem>
      <OFormItem label="标题文本3" :rules="uploadRules" field="uploadList">
        <OUpload btn-label="上传(单选)" multiple color="normal" variant="solid" @select="onUploadChange" v-model="formModel.uploadList" />
      </OFormItem>
      <div>
        <OButton type="submit">提交</OButton>
        <OButton @click="reset">重置</OButton>
        <OButton @click="clear">清除校验</OButton>
      </div>
      <div class="values">
        <p v-for="item in values" :key="item">{{ item }}</p>
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
