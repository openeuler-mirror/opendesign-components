# Tag 标签

## props

| name             | type                                           | 默认值   | 说明                                                          |
| :--------------- | :--------------------------------------------- | :------- | ------------------------------------------------------------- |
| color            | 'normal' \| 'success' \| 'warning' \| 'danger' | 'normal' | 可选，标签颜色                                                |
| variant          | 'solid'\|'outline'                             | 'solid'  | 可选，标签类型                                                |
| size             | 'large' \| 'normal' \| 'small'                 | 'normal' | 可选，标签尺寸                                                |
| round            | string                                         | -        | 可选，标签圆角                                                |
| closable         | boolean                                        | false    | 可选，是否可关闭                                              |
| checkable        | boolean                                        | false    | 可选，是否可选中                                              |
| checked(v-model) | boolean                                        | false    | 可选，是否被选中（仅 checkable 为 true 生效）                 |
| defaultChecked   | boolean                                        | false    | 可选，非受控状态时，默认是否选中（仅 checkable 为 true 生效） |

## event

| name   | 参数                         | 说明         |
| :----- | :--------------------------- | :----------- |
| change | val: boolean, ev: MouseEvent | 值改变时触发 |
| close  | ev: MouseEvent               | 关闭时触发   |

## slot

| name    | 说明           |
| :------ | :------------- |
| icon    | 自定义图标     |
| default | 自定义标签内容 |
