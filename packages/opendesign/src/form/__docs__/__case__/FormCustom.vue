<docs lang="md">
<!-- zh-CN -->

### 插槽

- `label`: 自定义标签内容
- `symbol`: 自定义必填符号
- `message`: 自定义验证信息
- `extra`: 自定义额外信息

<!-- en-US -->

### Slots

- `label`: Customize the label content
- `symbol`: Customize the required symbol
- `message`: Customize the validation message
- `extra`: Customize the extra information
</docs>

<script setup lang="ts">
import { reactive } from 'vue';
import { OForm, OFormItem, OInput, OButton, OIconInfo, OIconStar, type RulesT } from '@opensig/opendesign';

const model = reactive({
  password: '',
});

const rules: RulesT[] = [
  {
    required: true,
    message: 'Please input your password',
  },
  {
    validator: (value: string) => {
      if (value.length < 6) {
        return {
          type: 'warning',
          message: 'The length of your name is too short.',
        };
      }
      if (value.length > 15) {
        return {
          type: 'warning',
          message: 'The length of your name is too long.',
        };
      }
    },
    triggers: ['input', 'change'],
  },
  {
    validator: (value: string) => {
      if (!/[0-9]/.test(value)) {
        return {
          type: 'warning',
          message: 'The password must contain at least one number.',
        };
      }
    },
    triggers: ['input', 'change'],
  },
];
</script>

<template>
  <OForm :model="model" has-required>
    <OFormItem label="Password" required field="password" :rules="rules">
      <OInput v-model="model.password" placeholder="Enter your login password" type="password" />
      <!-- Custom required symbol -->
      <template #symbol><OIconStar /></template>
      <!-- Custom label -->
      <template #label>
        <span class="label">Password</span>
        <DocIconPwd class="icon-pwd" />
      </template>
      <!-- Custom validation message -->
      <template #message="{ message }">
        <ul class="message">
          <li v-for="(item, index) in message" :key="index">{{ item }}</li>
        </ul>
      </template>
      <!-- Custom extra message -->
      <template #extra> <OIconInfo class="icon-info" />The password must contain at least one number </template>
    </OFormItem>
    <OButton type="submit" color="primary" variant="solid">Submit</OButton>
  </OForm>
</template>
<style scoped lang="scss">
.icon-pwd {
  margin-left: 8px;
}
.icon-info {
  margin-right: 8px;
  font-size: 16px;
  vertical-align: -0.25em;
}
.message {
  list-style-position: inside;
  list-style-type: circle;
  padding-inline-start: 0;
}
</style>
