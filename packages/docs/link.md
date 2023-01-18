# Link 按钮

## props

| name       | type                                                        | 默认值   | 说明                                     |
| :--------- | :---------------------------------------------------------- | :------- | :--------------------------------------- |
| href       | string                                                      | ''       | 可选，包含超链接指向的 URL 或 URL 片段。 |
| target     | '\_blank' \| '\_parent' \| '\_self' \| '\_top'              | 'normal' | 可选，指定在何处显示链接的资源。         |
| type       | 'normal' \| 'primary' \| 'warning' \| 'danger' \| 'success' | 'normal' | 可选，链接类型                           |
| disabled   | boolean                                                     | false    | 可选，是否禁用                           |
| loading    | boolean                                                     | false    | 可选，是否为 loading 状态                |
| iconPrefix | boolean                                                     | false    | 可选，前缀图标                           |
| iconArrow  | boolean                                                     | false    | 可选，图标箭头                           |
| hoverable  | boolean                                                     | false    | 可选，hover 时是否显示背景               |

## event

| event | 参数           | 说明     |
| :---- | :------------- | :------- |
| click | (e:MouseEvent) | 点击事件 |

## expose

## slot

| name | 说明     |
| :--- | :------- |
| icon | 按钮图标 |
