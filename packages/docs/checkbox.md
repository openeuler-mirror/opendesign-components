# Checkbox 多选框

## props

| name                 | type                      | 默认值 | 说明              |
| :------------------- | :------------------------ | :----- | ----------------- |
| value                | string \| number          | -      | 必选，多选框 vale |
| model-value(v-model) | Array<string \| number \> | [ ]    | 可选，双向绑定值  |
| disabled             | boolean                   | false  | 可选，是否禁用    |

## event

| name   | 参数                            | 说明         |
| :----- | :------------------------------ | :----------- |
| change | val: Array<string \| number \>; | 值改变时触发 |

## expose

| name    | 说明           |
| :------ | :------------- |
| checked | 多选框是否选中 |

## slot

| name     | 参数                               | 说明         |
| :------- | :--------------------------------- | :----------- |
| checkbox | checked:boolean; disabled: boolean | 自定义多选框 |

# CheckboxGroup 多选框组

## props

| name                 | type                      | 默认值 | 说明             |
| :------------------- | :------------------------ | :----- | ---------------- |
| model-value(v-model) | Array<string \| number \> | [ ]    | 可选，双向绑定值 |
| disabled             | boolean                   | false  | 可选，是否禁用   |
| direction            | CheckboxGroupDirectionT   | false  | 可选，排列方向   |

```ts
type CheckGroupDirectionT = 'horizontal' | 'vertical';
```

## event

| name   | 参数                             | 说明           |
| :----- | :------------------------------- | :------------- |
| change | val: Array<string \| number \> | 状态切换后触发 |

## expose

## slot