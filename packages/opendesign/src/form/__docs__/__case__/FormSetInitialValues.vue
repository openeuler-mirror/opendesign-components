<docs lang="md">
<!-- zh-CN -->

### 设置初始值

通过 Form 实例的 `setInitialValues(data)` 方法可批量设置表单初始值，同时写入 model 并更新重置基准。调用 `resetFields` 后字段将回退到这些初始值，而非空值。

<!-- en-US -->

### Set Initial Values

Use the Form instance's `setInitialValues(data)` method to batch-set initial values. It writes to the model and updates the reset baseline simultaneously. After calling `resetFields`, fields revert to these initial values instead of empty values.
</docs>

<script setup lang="ts">
import { reactive, useTemplateRef } from 'vue';
import { OForm, OFormItem, OInput, OSelect, OOption, OButton } from '@opensig/opendesign';

const model = reactive({
  name: '',
  city: '',
});

const formInst = useTemplateRef('formRef');

const loadRemoteData = () => {
  formInst.value?.setInitialValues({
    name: 'Alice',
    city: 'shanghai',
  });
};

const reset = () => {
  formInst.value?.resetFields();
};
</script>

<template>
  <OForm ref="formRef" :model="model" has-required label-width="100px">
    <OFormItem label="Name" field="name" required>
      <OInput v-model="model.name" placeholder="Click 'Load' first" />
    </OFormItem>
    <OFormItem label="City" field="city" required>
      <OSelect v-model="model.city" placeholder="Click 'Load' first">
        <OOption label="Beijing" value="beijing" />
        <OOption label="Shanghai" value="shanghai" />
        <OOption label="Guangzhou" value="guangzhou" />
      </OSelect>
    </OFormItem>
    <div>
      <OButton color="primary" variant="solid" @click="loadRemoteData">Load Remote Data</OButton>
      <OButton @click="reset">Reset (to initial values)</OButton>
    </div>
  </OForm>
</template>
