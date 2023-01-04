# Switch 开关

## props

| name         | type                                        | 默认值        | 说明                                                         |
| :----------- | :------------------------------------------ | :------------ | ------------------------------------------------------------ |
| model:value  | boolean                                     | false         | 开关状态                                                     |
| shape        | ShapeT                                      | ShapeT.NORMAL | 开关形状                                                     |
| size         | SizeT                                       | SizeT.NORMAL  | 开关尺寸                                                     |
| disabled     | boolean                                     | false         | 是否禁用                                                     |
| loading      | boolean                                     | false         | 加载状态                                                     |
| beforeChange | (val: boolean): Promise\<boolean\>\|boolean | -             | return Promise.resolve(true)继续切换，resolve(false)阻止切换 |

## event

| name   | 参数            | 说明           |
| :----- | :-------------- | :------------- |
| change | value: boolean; | 状态切换后触发 |

## expose

## slot

| name | 说明     |
| :--- | :------- |
| on   | 开启状态 |
| off  | 关闭状态 |
