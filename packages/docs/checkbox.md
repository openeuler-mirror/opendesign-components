# Checkbox 多选框

## props

| name                 | type                      | 默认值 | 说明        |
| :------------------- | :------------------------ | :----- | ----------- |
| value                | string \| number          | -      | 多选框 vale |
| model-value(v-model) | Array<string \| number \> | [ ]    | 双向绑定值  |
| disabled             | boolean                   | false  | 是否禁用    |

## event

| name   | 参数                                                  | 说明           |
| :----- | :---------------------------------------------------- | :------------- |
| change | {value: Array<string \| number \>, checked: boolean}; | 状态切换后触发 |

## expose

## slot

| name     | 说明         |
| :------- | :----------- |
| checkbox | 自定义多选框 |

# CheckboxGroup 多选框组

## props

| name                 | type                      | 默认值 | 说明       |
| :------------------- | :------------------------ | :----- | ---------- |
| model-value(v-model) | Array<string \| number \> | -      | 双向绑定值 |
| disabled             | boolean                   | false  | 是否禁用   |
| direction            | CheckboxGroupDirectionT   | false  | 排列方向   |

```ts
type CheckGroupDirectionT = 'horizontal' | 'vertical';
```

## event

| name   | 参数                             | 说明           |
| :----- | :------------------------------- | :------------- |
| change | value: Array<string \| number \> | 状态切换后触发 |

## expose

## slot
