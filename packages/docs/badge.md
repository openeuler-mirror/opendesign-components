# Badge 徽标

## props

| name   | type                                                      | 默认值   | 说明                                                                 |
| :----- | :-------------------------------------------------------- | :------- | -------------------------------------------------------------------- |
| value  | string \| number                                          | ''       | 可选，显示值                                                         |
| max    | number                                                    | 99       | 可选，最大值，超过最大值显示${max}+(仅当 value 类型为 number 时生效) |
| offset | number []                                                 | []       | 可选，徽标位置偏移量                                                 |
| dot    | boolean                                                   | fasle    | 可选，是否显示为小红点                                               |
| color  | 'normal' \| 'primary' \|'success'\| 'warning' \| 'danger' | 'normal' | 可选，颜色                                                           |

## slot

| name    | 参数 | 说明         |
| :------ | :--- | :----------- |
| default |      | 徽标包裹内容 |
| content |      | 徽标具体内容 |
