<docs lang="md">
<!-- zh-CN -->

### 表单校验

表单校验用于验证用户输入的数据是否符合要求。可通过 OFormItem 的 `rules` 属性或 OForm 的全局 `rules` 属性配置校验规则。

#### 使用方法

- 通过 `OForm` 组件的 `model` 参数指定要校验的表单数据。
- 通过 `OFormItem` 组件的 `field` 参数指定要校验的字段名，可以是带点的嵌套字段名（如：`a.b.c`），暂不支持数组索引。
- 通过 `OFormItem` 组件的 `rules` 属性指定要校验的规则，或通过 `OForm` 的 `rules` 属性按字段名全局配置（FormItem 局部 `rules` 优先）。

#### 校验规则类型

**必填校验 `RequiredRuleT`**：验证字段是否已经填写

> 注：当 `OFormItem` 组件的 `required` 属性为 true 时，`OForm` 组件会自动添加必填校验规则。

```ts
type RequiredRuleT = {
  required: boolean;
  /** 错误提示 */
  message?: string;
  /** 触发器：默认为 change 事件 */
  triggers?: TriggerT | TriggerT[];
};
type TriggerT = 'change' | 'input' | 'blur' | 'focus';
```

**类型校验 `TypeRuleT`**：验证字段值是否为指定类型

```ts
type TypeRuleT = {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  message?: string;
  triggers?: TriggerT | TriggerT[];
};
```

**自定义校验 `ValidatorRuleT`**：通过函数进行复杂的自定义校验

```ts
type ValidatorRuleT = {
  triggers?: TriggerT | TriggerT[];
  /** 自定义校验函数 */
  validator?: ValidatorT;
};
type ValidatorT = (value: any) => ValidatorResultT | void;
/** 校验结果 */
type ValidatorResultT = {
  type: 'danger' | 'warning' | 'success';
  message?: string;
};
```

**自定义校验返回结果**

- danger: 校验失败，阻止表单提交，显示第一个错误提示
- warning: 警告信息，显示所有的警告提示
- success: 校验通过，不显示信息
- 无返回值: 同 success

当同一字段配置多个校验规则时：

- danger 类型会阻断后续校验规则的执行
- warning 和 success 类型不会阻断后续校验
- 每次校验都会重置之前的校验结果
  如果需要在多个事件中触发校验，请确保规则配置了所有相关触发事件

  ```js
  const badRules = [
    { triggers: 'change' },
    // ❌ 错误示例：第一个rule的change事件会重置第二个rule校验结果
    { triggers: 'input' },
  ];

  const goodRules = [
    { triggers: 'change' },
    // ✅ 正确示例：确保所有相关事件都能触发校验
    { triggers: ['input', 'change'] },
  ];
  ```

#### 手动校验

可通过 `OForm` 组件实例的 `validate` 方法校验表单数据，或使用 `validateField(field)` 校验指定字段。注意：

1. 若未传入 `trigger` 参数，则使用 `defaultTrigger` 属性定义的事件进行校验；
2. 若未定义 `defaultTrigger`，则使用 `change` 事件进行校验；
3. 若无 `change` 触发的校验规则，则使用 `rules` 中第一个校验规则的第一个触发事件进行校验。

#### 提交

当 `OForm` 子元素中具有 `type="submit"` 的 `<button>` 时，点击可触发提交事件。若定义了校验规则，则提交前 `OForm` 会自动执行 `validate` 函数（trigger 取值同上），在校验通过后再触发表单提交事件。

<!-- en-US -->

### Form Validation

Form validation is used to verify whether user-input data meets the required criteria.
Validation rules can be configured via the `rules` property of `OFormItem` or the global `rules` property of `OForm`.

#### Usage

- Use the `model` parameter of the `OForm` component to specify the form data to be validated.
- Use the `field` parameter of the `OFormItem` component to specify the field name to validate.
  This can be a dotted nested field name (e.g., `a.b.c`), but array indices are not currently supported.
- Use the `rules` property of the `OFormItem` component to define validation rules, or use the `rules` property of `OForm` for global configuration by field name (FormItem local `rules` take priority).

#### Validation Rule Types

**Required Rule `RequiredRuleT`**: Validates whether a field has been filled.

> Note: When the `required` property of the `OFormItem` component is set to `true`, the `OForm` component automatically adds a required validation rule.

```ts
type RequiredRuleT = {
  required: boolean;
  /** Error message */
  message?: string;
  /** Trigger: Default is the 'change' event */
  triggers?: TriggerT | TriggerT[];
};
type TriggerT = 'change' | 'input' | 'blur' | 'focus';
```

**Type Rule `TypeRuleT`**: Validates whether the field value is of the specified type.

```ts
type TypeRuleT = {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  message?: string;
  triggers?: TriggerT | TriggerT[];
};
```

**Custom Validation Rule `ValidatorRuleT`**: Performs complex custom validation via a function.

```ts
type ValidatorRuleT = {
  triggers?: TriggerT | TriggerT[];
  /** Custom validation function */
  validator?: ValidatorT;
};
type ValidatorT = (value: any) => ValidatorResultT | void;
/** Validation result */
type ValidatorResultT = {
  type: 'danger' | 'warning' | 'success';
  message?: string;
};
```

**Custom Validation Return Results**

- `danger`: Validation fails, prevents form submission, and displays the first error message.
- `warning`: Warning message, displays all warning messages.
- `success`: Validation passes, no message is displayed.
- No return value: Same as `success`.

When multiple validation rules are configured for the same field:

- `danger` type will block the execution of subsequent validation rules.
- `warning` and `success` types do not block subsequent validations.
- Each validation resets previous validation results.
  If validation needs to be triggered by multiple events, ensure that the rules are configured with all relevant trigger events:

  ```js
  const badRules = [
    { triggers: 'change' },
    // ❌ Bad example: The 'change' event of the first rule resets the validation result of the second rule
    { triggers: 'input' },
  ];

  const goodRules = [
    { triggers: 'change' },
    // ✅ Good example: Ensure all relevant events can trigger validation.
    { triggers: ['input', 'change'] },
  ];
  ```

#### Manual Validation

Use the `validate` method of the `OForm` component instance to validate all form data, or `validateField(field)` to validate specific fields. Note:

1. If no `trigger` parameter is provided, the event defined by the `defaultTrigger` property is used for validation.
2. If `defaultTrigger` is not defined, the `change` event is used for validation.
3. If there are no validation rules triggered by `change`, the first trigger event of the first rule in `rules` is used for validation.

#### Submission

When an `<button>` with `type="submit"` exists within the `OForm` child elements, clicking it triggers the submission event.
If validation rules are defined, `OForm` automatically executes the `validate` function before submission (using the same trigger selection logic as above).
The form submission event is only triggered after validation passes.
</docs>

<script setup lang="ts">
import { reactive, useTemplateRef } from 'vue';
import {
  OForm,
  OFormItem,
  OInput,
  OInputNumber,
  OTextarea,
  OSelect,
  OOption,
  OCheckbox,
  OCheckboxGroup,
  ORadio,
  ORadioGroup,
  OUpload,
  ODatePicker,
  OTimePicker,
  OIpInput,
  OCascaderV2,
  OSwitch,
  OButton,
  type FieldResultT,
  type RulesT,
  type UploadFileT,
} from '@opensig/opendesign';

const formModel = reactive({
  name: '',
  age: undefined as number | undefined,
  remark: '',
  city: '',
  task: [] as string[],
  gender: '',
  uploadList: [] as UploadFileT[],
  birthDate: undefined as number | undefined,
  workTime: undefined as string | undefined,
  ip: '',
  region: [] as Array<string | number>,
  pwd: '',
  pwdAgain: '',
  active: false,
});

const cityOptions = [
  { label: 'Beijing', value: 'beijing' },
  { label: 'Shanghai', value: 'shanghai' },
  { label: 'Shenzhen', value: 'shenzhen' },
];

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
];

const regionOptions = [
  {
    value: 'beijing',
    label: 'Beijing',
    children: [
      { value: 'haidian', label: 'Haidian' },
      { value: 'chaoyang', label: 'Chaoyang' },
    ],
  },
  { value: 'shanghai', label: 'Shanghai', children: [{ value: 'pudong', label: 'Pudong' }] },
];

const formInst = useTemplateRef('formRef');

const reset = () => {
  formInst.value?.resetFields();
};

const clear = () => {
  formInst.value?.clearValidate();
};

const nameRules: RulesT[] = [
  {
    triggers: ['input', 'change'],
    validator: (value: string) => {
      if (value.length < 5) {
        return { type: 'warning', message: 'The length of your name is too short.' };
      }
      return { type: 'success', message: 'The length of your name is OK.' };
    },
  },
  {
    triggers: ['input', 'change'],
    validator: (value: string) => {
      if (value.length > 10) {
        return { type: 'warning', message: 'The length of your name is too long.' };
      }
    },
  },
];

const ageRules: RulesT[] = [
  { required: true, message: 'Age is required', triggers: 'change' },
  {
    triggers: 'change',
    validator: (value: number) => {
      if (value < 18) return { type: 'danger', message: 'Must be at least 18 years old.' };
      if (value > 120) return { type: 'danger', message: 'Age seems unrealistic.' };
    },
  },
];

const remarkRules: RulesT[] = [
  { required: true, message: 'Remark is required', triggers: 'blur' },
  {
    triggers: ['input', 'change'],
    validator: (value: string) => {
      if (value.length > 100) return { type: 'warning', message: 'Remark is too long (max 100).' };
    },
  },
];

const cityRules: RulesT[] = [{ required: true, message: 'Please select a city', triggers: 'change' }];

const taskRules: RulesT[] = [{ required: true, message: 'Please select a task', triggers: 'change' }];

const genderRules: RulesT[] = [{ required: true, message: 'Please select gender', triggers: 'change' }];

const uploadRules: RulesT[] = [
  {
    validator: (value: Array<any>) => {
      if (value.length < 2) {
        return { type: 'warning', message: 'Suggestion: upload more files.' };
      }
    },
  },
];

const birthDateRules: RulesT[] = [{ required: true, message: 'Please select a date', triggers: 'change' }];

const workTimeRules: RulesT[] = [{ required: true, message: 'Please select a time', triggers: 'change' }];

const regionRules: RulesT[] = [{ required: true, message: 'Please select a region', triggers: 'change' }];

const pwdRules: RulesT[] = [{ required: true, message: 'Password is required', triggers: 'blur' }];

const pwdAgainRules: RulesT[] = [
  { required: true, message: 'Please confirm password', triggers: 'blur' },
  {
    triggers: 'blur',
    validator: (value: string) => {
      if (value !== formModel.pwd) {
        return { type: 'danger', message: 'The two passwords do not match.' };
      }
    },
  },
];

const activeRules: RulesT[] = [
  {
    triggers: 'change',
    validator: (value: boolean) => {
      if (!value) return { type: 'danger', message: 'Please agree to the terms.' };
    },
  },
];

const onFormSubmit = (results: FieldResultT[]) => {
  if (results.find((item) => item?.type === 'danger')) {
    console.error('check failed!');
  } else {
    console.info('check pass!');
  }
};
</script>
<template>
  <OForm ref="formRef" class="form" has-required :model="formModel" clearable size="medium" @submit="onFormSubmit">
    <OFormItem label="Name" required field="name" :rules="nameRules">
      <OInput v-model="formModel.name" />
    </OFormItem>
    <OFormItem label="Age" required field="age" :rules="ageRules">
      <OInputNumber v-model="formModel.age" :min="0" :max="150" />
    </OFormItem>
    <OFormItem label="Remark" required field="remark" :rules="remarkRules">
      <OTextarea v-model="formModel.remark" placeholder="Max 100 characters" />
    </OFormItem>
    <OFormItem label="City" required field="city" :rules="cityRules">
      <OSelect v-model="formModel.city" placeholder="Please select">
        <OOption v-for="item in cityOptions" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </OFormItem>
    <OFormItem label="Task" required field="task" :rules="taskRules">
      <OCheckboxGroup v-model="formModel.task">
        <OCheckbox :value="2">Task 1</OCheckbox>
        <OCheckbox :value="3">Task 2</OCheckbox>
      </OCheckboxGroup>
    </OFormItem>
    <OFormItem label="Gender" required field="gender" :rules="genderRules">
      <ORadioGroup v-model="formModel.gender">
        <ORadio v-for="item in genderOptions" :key="item.value" :value="item.value">{{ item.label }}</ORadio>
      </ORadioGroup>
    </OFormItem>
    <OFormItem label="UploadList" required :rules="uploadRules" field="uploadList">
      <OUpload v-model="formModel.uploadList" btn-label="Upload" multiple color="normal" variant="solid" />
    </OFormItem>
    <OFormItem label="Birth Date" required field="birthDate" :rules="birthDateRules">
      <ODatePicker v-model="formModel.birthDate" />
    </OFormItem>
    <OFormItem label="Work Time" required field="workTime" :rules="workTimeRules">
      <OTimePicker v-model="formModel.workTime" />
    </OFormItem>
    <OFormItem label="Region" required field="region" :rules="regionRules">
      <OCascaderV2 v-model="formModel.region" :options="regionOptions" placeholder="Please select" />
    </OFormItem>
    <OFormItem label="Password" required field="pwd" :rules="pwdRules">
      <OInput v-model="formModel.pwd" type="password" />
    </OFormItem>
    <OFormItem label="Password Again" required field="pwdAgain" :rules="pwdAgainRules">
      <OInput v-model="formModel.pwdAgain" type="password" />
    </OFormItem>
    <OFormItem label="Agreement" required field="active" :rules="activeRules">
      <OSwitch v-model="formModel.active" />
      <span style="margin-left: 8px; color: var(--o-color-info3); font-size: 12px">I agree to the terms</span>
    </OFormItem>
    <div>
      <OButton type="submit">Submit</OButton>
      <OButton @click="reset">Reset</OButton>
      <OButton @click="clear">RestValidate</OButton>
    </div>
  </OForm>
</template>
