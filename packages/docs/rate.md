# Rate 评分

## props

| name                | type                                           | 默认值   | 说明                                                |
| :------------------ | :--------------------------------------------- | :------- | --------------------------------------------------- |
| count               | number                                         | 5        | 可选，评分数量                                      |
| modelValue(v-model) | number                                         | -        | 可选，双向绑定值                                    |
| defaultValue        | number                                         | 0        | 可选，非受控状态时，默认值                          |
| size                | 'large' \| 'normal' \| 'small'                 | 'normal' | 评分尺寸                                            |
| color               | 'normal' \| 'primary' \| 'warning' \| 'danger' | 'normal' | 评分颜色                                            |
| readonly            | boolean                                        | false    | 可选，是否只读                                      |
| allowHalf           | boolean                                        | false    | 可选，是否支持半选                                  |
| clearable           | boolean                                        | false    | 可选，是否支持可清空                                |
| labels              | Array<string\>                                 | -        | 提示文字，当且仅当提示文字数组长度等于 count 时生效 |

## event

| name   | 参数          | 说明                 |
| :----- | :------------ | :------------------- |
| change | index: number | 双向绑定值改变时触发 |

## slot

| name | 参数                          | 说明           |
| :--- | :---------------------------- | :------------- |
| icon | index: number; status: string | 自定义评分图标 |
