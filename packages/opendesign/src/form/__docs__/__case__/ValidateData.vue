<docs lang="md">
<!-- zh-CN -->

### 表单校验

表单校验用于验证用户输入的数据是否符合要求。通过 OFormItem 组件的 rules 属性配置校验规则。

#### 使用方法

- 通过 `OFrom` 组件的 `model` 参数指定要校验的表单数据。
- 通过 `OFromItem` 组件的 `field` 参数指定要校验的字段名，可以是带点的嵌套字段名（如：`a.b.c`），暂不支持数组索引。
- 通过 `OFromItem` 组件的 `rules` 属性指定要校验的规则。

#### 校验规则类型

**必填校验 `RequiredRuleT`**：验证字段是否已经填写

> 注：当 `OFromItem` 组件的 `required` 属性为 true 时，`OFrom` 组件会自动添加必填校验规则。

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

可通过 `OForm` 组件实例的 `validate` 方法校验表单数据。注意：

1. 若未传入 `trigger` 参数，则使用 `defaultTrigger` 属性定义的事件进行校验；
2. 若未定义 `defaultTrigger`，则使用 `change` 事件进行校验；
3. 若无 `change` 触发的校验规则，则使用 `rules` 中第一个校验规则的第一个触发事件进行校验。

#### 提交

当 `OForm` 子元素中具有 `type="submit"` 的 `<button>` 时，点击可触发提交事件。若定义了校验规则，则提交前 `OForm` 会自动执行 `validate` 函数（trigger 取值同上），在校验通过后再触发表单提交事件。

<!-- en-US -->

### Form Validation

Form validation is used to verify whether user-input data meets the required criteria.
Validation rules are configured via the `rules` property of the `OFormItem` component.

#### Usage

- Use the `model` parameter of the `OForm` component to specify the form data to be validated.
- Use the `field` parameter of the `OFormItem` component to specify the field name to validate.
  This can be a dotted nested field name (e.g., `a.b.c`), but array indices are not currently supported.
- Use the `rules` property of the `OFormItem` component to define the validation rules.

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

Use the `validate` method of the `OForm` component instance to validate form data manually. Note:

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
import { OForm, OFormItem, OInput, OCheckbox, OCheckboxGroup, OButton, OUpload, type FieldResultT, type RulesT, type UploadFileT } from '@opensig/opendesign';

const formModel = reactive({
  name: '',
  task: [] as string[],
  uploadList: [] as UploadFileT[],
  pwd: '',
  pwdAgain: '',
});

const formInst = useTemplateRef('formRef');

const reset = () => {
  formInst.value?.resetFields();
};

const clear = () => {
  formInst.value?.clearValidate();
};

const inputRules: RulesT[] = [
  {
    triggers: ['input', 'change'],
    validator: (value: string) => {
      if (value.length < 5) {
        return {
          type: 'warning',
          message: 'The length of your name is too short.',
        };
      }
      return {
        type: 'success',
        message: 'The length of your name is OK.',
      };
    },
  },
  {
    triggers: ['input', 'change'],
    validator: (value: string) => {
      if (value.length > 10) {
        return {
          type: 'warning',
          message: 'The length of your name is too long.',
        };
      }
    },
  },
];

const uploadRules: RulesT[] = [
  {
    validator: (value: Array<any>) => {
      if (value.length < 2) {
        console.error('Suggestion: upload more files.');
        return {
          type: 'warning',
          message: 'Suggestion: upload more files.',
        };
      }
    },
  },
];

const pwdAgainRules: RulesT[] = [
  {
    validator: (value: string) => {
      if (value !== formModel.pwd) {
        return {
          type: 'danger',
          message: 'The two passwords do not match.',
        };
      }
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
  <OForm ref="formRef" class="form" has-required :model="formModel" @submit="onFormSubmit">
    <OFormItem label="Name" required field="name" :rules="inputRules">
      <OInput v-model="formModel.name" />
    </OFormItem>
    <OFormItem label="Task" required field="task">
      <OCheckboxGroup v-model="formModel.task">
        <OCheckbox :value="2">Task 1</OCheckbox>
        <OCheckbox :value="3">Task 2</OCheckbox>
      </OCheckboxGroup>
    </OFormItem>
    <OFormItem label="UploadList" required :rules="uploadRules" field="uploadList">
      <OUpload v-model="formModel.uploadList" btn-label="Upload" multiple color="normal" variant="solid" />
    </OFormItem>
    <OFormItem label="Password" required field="pwd">
      <OInput v-model="formModel.pwd" type="password" />
    </OFormItem>
    <OFormItem label="Password Again" required field="pwdAgain" :rules="pwdAgainRules">
      <OInput v-model="formModel.pwdAgain" type="password" />
    </OFormItem>
    <div>
      <OButton type="submit">Submit</OButton>
      <OButton @click="reset">Reset</OButton>
      <OButton @click="clear">RestValidate</OButton>
    </div>
  </OForm>
</template>
