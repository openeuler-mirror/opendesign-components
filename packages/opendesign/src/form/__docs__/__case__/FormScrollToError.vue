<docs lang="md">
<!-- zh-CN -->

### 校验失败滚动与 trigger 校验

- `scrollToError`：设为 `true` 后，表单提交校验失败时自动滚动到首个错误项
- `scrollToField(field, options?)`：手动滚动到指定字段
- `validate(field?, trigger?)` / `validateField(field, trigger?)`：支持传入 `trigger` 参数，仅校验该触发类型对应的规则

<!-- en-US -->

### Scroll on Validation Error & Trigger Validation

- `scrollToError`: When set to `true`, auto-scrolls to the first error item on failed submission validation
- `scrollToField(field, options?)`: Manually scroll to a specific field
- `validate(field?, trigger?)` / `validateField(field, trigger?)`: Supports a `trigger` parameter to validate only rules for that trigger type
</docs>

<script setup lang="ts">
import { reactive, useTemplateRef } from 'vue';
import { OForm, OFormItem, OInput, OButton, OScroller, type RulesT, type FieldResultT } from '@opensig/opendesign';

const model = reactive({
  name1: '',
  email1: '',
  phone1: '',
  address: '',
  company: '',
  department: '',
  position: '',
  remark: '',
});

const formInst = useTemplateRef('formRef');

const nameRules: RulesT[] = [
  { required: true, message: 'Name is required', triggers: 'blur' },
  {
    triggers: ['input', 'change'],
    validator: (v: string) => {
      if (v && v.length < 3) return { type: 'warning', message: 'Name too short' };
    },
  },
];

const emailRules: RulesT[] = [{ required: true, message: 'Email is required', triggers: 'blur' }];

const phoneRules: RulesT[] = [{ required: true, message: 'Phone is required', triggers: 'change' }];

const positionRules: RulesT[] = [{ required: true, message: 'Position is required', triggers: 'blur' }];

const onSubmit = (results: FieldResultT[]) => {
  if (results.find((r) => r?.type === 'danger')) {
    console.warn('Validation failed');
  } else {
    console.info('Validation passed');
  }
};

const validateBlurOnly = () => {
  formInst.value?.validate(undefined, 'blur');
};

const scrollToPhone = () => {
  formInst.value?.scrollToField('phone1');
};
</script>

<template>
  <OScroller style="max-height: 300px" show-type="always">
    <OForm ref="formRef" :model="model" has-required label-width="100px" style="padding-left: 16px" scroll-to-error @submit="onSubmit">
      <OFormItem label="Name" field="name1" required :rules="nameRules">
        <OInput v-model="model.name1" placeholder="blur rule + input rule" />
      </OFormItem>
      <OFormItem label="Email" field="email1" required :rules="emailRules">
        <OInput v-model="model.email1" placeholder="blur rule only" />
      </OFormItem>
      <OFormItem label="Phone" field="phone1" required :rules="phoneRules">
        <OInput v-model="model.phone1" placeholder="change rule only" />
      </OFormItem>
      <OFormItem label="Address" field="address">
        <OInput v-model="model.address" />
      </OFormItem>
      <OFormItem label="Company" field="company">
        <OInput v-model="model.company" />
      </OFormItem>
      <OFormItem label="Department" field="department">
        <OInput v-model="model.department" />
      </OFormItem>
      <OFormItem label="Position" field="position" required :rules="positionRules">
        <OInput v-model="model.position" />
      </OFormItem>
      <OFormItem label="Remark" field="remark">
        <OInput v-model="model.remark" />
      </OFormItem>
      <div>
        <OButton type="submit" color="primary" variant="solid">Submit</OButton>
        <OButton @click="validateBlurOnly">Validate blur only</OButton>
        <OButton @click="scrollToPhone">Scroll to Phone</OButton>
      </div>
    </OForm>
  </OScroller>
</template>
