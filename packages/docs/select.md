# Select 下拉选择器

## props

| name            | type                             | 默认值             | 说明                                                          |
| :-------------- | :------------------------------- | :----------------- | ------------------------------------------------------------- |
| modelValue      | string \| number（v-model）      | false              | 开关状态                                                      |
| shape           | ShapeT                           | 'normal'           | 形状: large \| normal \| small                                |
| size            | SizeT                            | 'normal'           | 形状 normal \| round                                          |
| disabled        | boolean                          | false              | 形状                                                          |
| placeholder     | string                           | 'please select...' | 提示文本                                                      |
| loading         | boolean                          | false              | 加载状态                                                      |
| beforeChange    | function                         | ()=>true           | return Promise. resolve(true)继续切换，resolve(false)阻止切换 |
| optionWrapClass | string                           | ''                 | 下拉的自定义类                                                |
| optionPosition  | PopupPositionT                   | 'bl'               | 下拉的位置                                                    |
| optionWidthMode | 'auto' \| 'min-width' \| 'width' | 'min-width'        | 下拉的宽度适配方式                                            |

## event

| name   | 参数                      | 说明           |
| :----- | :------------------------ | :------------- |
| change | value: boolean; ev: Event | 选择切换后触发 |

## expose

## slot
