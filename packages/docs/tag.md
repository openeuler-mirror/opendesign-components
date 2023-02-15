# Tag 标签

## props

| name             | type                                           | 默认值   | 说明                                                    |
| :--------------- | :--------------------------------------------- | :------- | ------------------------------------------------------- |
| status           | 'normal' \| 'success' \| 'warning' \| 'danger' | 'normal' | 标签状态                                                |
| bordered         | boolean                                        | false    | 是否有边框                                              |
| size             | 'large' \| 'normal' \| 'small'                 | 'normal' | 标签形状                                                |
| shape            | 'normal' \| 'round'                            | 'normal' | 尺寸                                                    |
| closable         | boolean                                        | false    | 是否可关闭                                              |
| checkable        | boolean                                        | false    | 是否可选中                                              |
| checked(v-model) | boolean                                        | false    | 是否被选中（仅 checkable 为 true 生效）                 |
| defaultChecked   | boolean                                        | false    | 非受控状态时，默认是否选中（仅 checkable 为 true 生效） |

## event

| name  | 参数         | 说明         |
| :---- | :----------- | :----------- |
| close |              | 值改变时触发 |
| check | val: boolean | 选中时触发   |

## slot

| name | 说明     |
| :--- | :------- |
| icon | 按钮图标 |
