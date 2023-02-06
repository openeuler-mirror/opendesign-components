# Radio 单选框

## props

| name                 | type                        | 默认值 | 说明               |
| :------------------- | :-------------------------- | :----- | ------------------ |
| value                | string \| number \| boolean | -      | 必选，单选框 value |
| model-value(v-model) | string \| number \| boolean | -      | 可选，双向绑定值   |
| disabled             | boolean                     | false  | 可选，是否禁用     |

## event

| name   | 参数                             | 说明                                 |
| :----- | :------------------------------- | :----------------------------------- |
| change | val: string \| number \| boolean | 双向绑定值改变时，在选中单选框上触发 |

## expose

| name    | type    | 说明           |
| :------ | :------ | :------------- |
| checked | boolean | 单选框是否选中 |

## slot

| name  | 参数                               | 说明         |
| :---- | :--------------------------------- | :----------- |
| radio | checked:boolean; disabled: boolean | 自定义单选框 |

# RadioGroup 单选框组

## props

| name                 | type                        | 默认值       | 说明             |
| :------------------- | :-------------------------- | :----------- | ---------------- |
| model-value(v-model) | string \| number \| boolean | -            | 可选，双向绑定值 |
| disabled             | boolean                     | false        | 可选，是否禁用   |
| direction            | 'horizontal' \| 'vertical'  | 'horizontal' | 可选，排列方向   |

## event

| name   | 参数                             | 说明           |
| :----- | :------------------------------- | :------------- |
| change | val: string \| number \| boolean | 状态切换后触发 |

## expose

## slot
