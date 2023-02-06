# Switch 开关

## props

| name                 | type                                          | 默认值   | 说明                                                                                                                                               |
| :------------------- | :-------------------------------------------- | :------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| model-value(v-model) | boolean                                       | false    | 可选，双向绑定值                                                                                                                                   |
| size                 | 'large' \| 'normal' \| 'small'                | 'normal' | 可选，开关尺寸                                                                                                                                     |
| shape                | 'normal' \| 'round'                           | 'normal' | 可选，开关形状                                                                                                                                     |
| disabled             | boolean                                       | false    | 可选，是否禁用                                                                                                                                     |
| loading              | boolean                                       | false    | 可选，是否加载中                                                                                                                                   |
| beforeChange         | (val: boolean): Promise\<boolean\> \| boolean | -        | 状态改变前的钩子函数，返回 true 或者返回 promise 且 resolve(true)则继续切换，返回 false 或者返回 promise 且被 reject 或 resolve(false)则阻止切换， |

## event

| name   | 参数            | 说明           |
| :----- | :-------------- | :------------- |
| change | value: boolean; | 状态切换后触发 |

## expose

## slot

| name | 说明                   |
| :--- | :--------------------- |
| on   | 自定义开启状态文字内容 |
| off  | 自定义关闭状态文字内容 |
