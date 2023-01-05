# Radio 单选框

## props

| name                 | type                        | 默认值 | 说明        |
| :------------------- | :-------------------------- | :----- | ----------- |
| value                | string \| number \| boolean | -      | 单选框 vale |
| model-value(v-model) | string \| number \| boolean | -      | 双向绑定值  |
| disabled             | boolean                     | false  | 是否禁用    |

## event

| name   | 参数                                                    | 说明           |
| :----- | :------------------------------------------------------ | :------------- |
| change | {value: string \| number \| boolean, checked: boolean}; | 状态切换后触发 |

## expose

## slot

| name  | 说明         |
| :---- | :----------- |
| radio | 自定义单选框 |

# RadioGroup 单选框组

## props

| name                 | type                        | 默认值       | 说明       |
| :------------------- | :-------------------------- | :----------- | ---------- |
| model-value(v-model) | string \| number \| boolean | -            | 双向绑定值 |
| disabled             | boolean                     | false        | 是否禁用   |
| direction            | RadioGroupDirectionT        | 'horizontal' | 排列方向   |

```ts
type RadioGroupDirectionT = 'horizontal' | 'vertical';
```

## event

| name   | 参数                               | 说明           |
| :----- | :--------------------------------- | :------------- |
| change | value: string \| number \| boolean | 状态切换后触发 |

## expose

## slot
