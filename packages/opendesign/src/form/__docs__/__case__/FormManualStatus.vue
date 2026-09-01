<docs lang="md">
<!-- zh-CN -->

### 手动控制校验状态

通过 FormItem 的 `error` 和 `validateStatus` 属性可手动设置校验状态，适用于服务端校验等场景。

- `error`：设置后立即显示错误状态和错误消息
- `validateStatus`：手动设置校验状态（`'danger'`/`'warning'`/`'success'`/`'validating'`）
- `requiredIcon`：设为 `true` 时 `required` 仅展示必填星号，不触发默认 required 校验
- `showMessage`：单独控制是否显示校验消息，未设置时继承 Form 的 `showMessage`

<!-- en-US -->

### Manual Validation Status Control

Manually set validation status via FormItem's `error` and `validateStatus` props, suitable for server-side validation scenarios.

- `error`: Sets error status and message immediately
- `validateStatus`: Manually set validation status (`'danger'`/`'warning'`/`'success'`/`'validating'`)
- `requiredIcon`: When `true`, `required` only shows asterisk without triggering default required validation
- `showMessage`: Controls whether to show validation messages individually, inherits Form's `showMessage` when unset
</docs>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { OForm, OFormItem, OInput, OButton, ORadioGroup, ORadio } from '@opensig/opendesign';

const formRef = ref<InstanceType<typeof OForm>>();

const model = reactive({
  username: '',
  nickname: '',
  errorField: '',
  status: '',
  requiredIconField: '',
});

const serverError = ref('');
const isChecking = ref(false);
const showMessageForNickname = ref(true);
const showError = ref(false);
const useRequiredIcon = ref(false);
const manualStatus = ref<'' | 'success' | 'warning' | 'danger' | 'validating'>('');

const handleValidate = async () => {
  await formRef.value?.validate();
  isChecking.value = true;
  serverError.value = '';
  await new Promise((r) => setTimeout(r, 1000));
  if (model.username === 'admin') {
    serverError.value = 'Username "admin" is already taken';
  }
  isChecking.value = false;
};
</script>

<template>
  <OForm ref="formRef" :model="model" has-required label-width="100px" :show-message="true">
    <OFormItem label="Username" field="username" required :error="serverError" :validate-status="isChecking ? 'validating' : undefined">
      <OInput id="username-input" v-model="model.username" placeholder="Try 'admin' to see error" />
    </OFormItem>
    <OFormItem label="Nickname" field="nickname" required :show-message="showMessageForNickname">
      <OInput id="nickname-input" v-model="model.nickname" placeholder="Toggle showMessage below" />
      <template #extra>
        <label style="font-size: 12px; display: flex; align-items: center; gap: 4px; margin-top: 4px">
          <input type="checkbox" v-model="showMessageForNickname" />
          showMessage
        </label>
      </template>
    </OFormItem>
    <OFormItem label="Error" field="errorField" :error="showError ? 'This field has an error' : ''">
      <OInput v-model="model.errorField" placeholder="error demo" />
      <template #extra>
        <label style="font-size: 12px; display: flex; align-items: center; gap: 4px; margin-top: 4px">
          <input type="checkbox" v-model="showError" />
          error
        </label>
      </template>
    </OFormItem>
    <OFormItem label="Status" field="status" :validate-status="manualStatus">
      <OInput v-model="model.status" placeholder="validateStatus demo" />
    </OFormItem>
    <div style="margin-bottom: 12px">
      <span style="font-size: var(--o-font_size-tip2); color: var(--o-color-info3); margin-right: 8px">validateStatus:</span>
      <ORadioGroup v-model="manualStatus">
        <ORadio value="">none</ORadio>
        <ORadio value="success">success</ORadio>
        <ORadio value="warning">warning</ORadio>
        <ORadio value="danger">danger</ORadio>
        <ORadio value="validating">validating</ORadio>
      </ORadioGroup>
    </div>
    <OFormItem label="ReqIcon" field="requiredIconField" required :required-icon="useRequiredIcon">
      <OInput v-model="model.requiredIconField" placeholder="required + requiredIcon toggle" />
      <template #extra>
        <label style="font-size: 12px; display: flex; align-items: center; gap: 4px; margin-top: 4px">
          <input type="checkbox" v-model="useRequiredIcon" />
          requiredIcon {{ useRequiredIcon ? '(only icon, no validation)' : '(icon + validation)' }}
        </label>
      </template>
    </OFormItem>
    <div>
      <OButton color="primary" variant="solid" :disabled="isChecking" @click="handleValidate">
        {{ isChecking ? 'Checking...' : 'Validate All' }}
      </OButton>
    </div>
  </OForm>
</template>
