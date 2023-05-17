# Switch 开关

## props

| name                | type                                          | 默认值   | 说明                                                                                                                                                     |
| :------------------ | :-------------------------------------------- | :------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| modelValue(v-model) | string \| number \| boolean                   | -        | 可选，双向绑定值                                                                                                                                         |
| checkedValue        | string \| number \| boolean                   | true     | 可选，选中状态对应值                                                                                                                                     |
| uncheckedValue      | string \| number \| boolean                   | false    | 可选，未选中状态对应值                                                                                                                                   |
| defaultChecked      | boolean                                       | false    | 非受控状态时，默认是否选中                                                                                                                               |
| size                | 'large' \| 'normal' \| 'small'                | 'normal' | 可选，开关尺寸                                                                                                                                           |
| round               | string                                        | -        | 可选，开关圆角                                                                                                                                           |
| disabled            | boolean                                       | false    | 可选，是否禁用                                                                                                                                           |
| loading             | boolean                                       | false    | 可选，是否加载中                                                                                                                                         |
| beforeChange        | (val: boolean): Promise\<boolean\> \| boolean | -        | 可选，状态改变前的钩子函数，返回 true 或者返回 promise 且 resolve(true)则继续切换，返回 false 或者返回 promise 且被 reject 或 resolve(false)则阻止切换， |

## event

| name   | 参数                                        | 说明           |
| :----- | :------------------------------------------ | :------------- |
| change | val: string \| number \| boolean, ev: Event | 状态切换后触发 |

## expose

## slot

| name | 说明                   |
| :--- | :--------------------- |
| on   | 自定义开启状态文字内容 |
| off  | 自定义关闭状态文字内容 |
