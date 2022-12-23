# Switch 开关

# props

| name         | type                                        | 默认值        | 说明                                                         |
| :----------- | :------------------------------------------ | :------------ | ------------------------------------------------------------ |
| model:value  | Boolean                                     | false         | 开关状态                                                     |
| shape        | ShapeT                                      | ShapeT.NORMAL | 形状                                                         |
| size         | SizeT                                       | SizeT.NORMAL  | 尺寸                                                         |
| disabled     | Boolean                                     | false         | 是否禁用                                                     |
| loading      | Boolean                                     | false         | 加载状态                                                     |
| beforeChange | (val: boolean): Promise\<boolean\>\|boolean | -             | return Promise.resolve(true)继续切换，resolve(false)阻止切换 |

```
enum SizeT {
  LARGE = 'large',
  NORMAL = 'normal',
  SMALL = 'small'
}

enum ShapeT {
  ROUND = 'round',
  NORMAL = 'normal'
}
```

# event

| name   | 参数                      | 说明           |
| :----- | :------------------------ | :------------- |
| change | value: boolean; ev: Event | 状态切换后触发 |

# expose

# slot

| name | 说明     |
| :--- | :------- |
| on   | 开启状态 |
| off  | 关闭状态 |
