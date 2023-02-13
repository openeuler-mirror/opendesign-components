# Checkbox 多选框

## props

| name                | type                      | 默认值 | 说明                             |
| :------------------ | :------------------------ | :----- | -------------------------------- |
| value               | string \| number          | -      | 必选，多选框 value               |
| defaultChecked      | boolean                   | false  | 可选，非受控状态时，默认是否选中 |
| modelValue(v-model) | Array<string \| number \> | -      | 可选，多选框双向绑定值           |
| disabled            | boolean                   | false  | 可选，是否禁用                   |
| indeterminate       | boolean                   | false  | 可选，是否为半选状态             |

## event

| name   | 参数                            | 说明                                 |
| :----- | :------------------------------ | :----------------------------------- |
| change | val: Array<string \| number \>; | 双向绑定值改变时，在选中多选框上触发 |

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

| name                | type                       | 默认值       | 说明                                   |
| :------------------ | :------------------------- | :----------- | -------------------------------------- |
| modelValue(v-model) | Array<string \| number \>  | -            | 可选，多选框组双向绑定值               |
| disabled            | boolean                    | false        | 可选，是否禁用                         |
| defaultValue        | Array<string \| number \>  | []           | 可选，非受控状态时，多选框组默认值     |
| direction           | 'horizontal' \| 'vertical' | 'horizontal' | 可选，排列方向                         |
| min                 | number                     | -            | 可选，多选框组支持选中的最小多选框数量 |
| max                 | number                     | -            | 可选，多选框组支持选中的最大多选框数量 |

## event

| name   | 参数                           | 说明           |
| :----- | :----------------------------- | :------------- |
| change | val: Array<string \| number \> | 状态切换后触发 |

## expose

## slot
