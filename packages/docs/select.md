# Select 下拉选择器

## props

| name            | type                             | 默认值             | 说明                                                                |
| :-------------- | :------------------------------- | :----------------- | ------------------------------------------------------------------- |
| modelValue      | string \| number（v-model）      | --                 | 必选，开关状态                                                      |
| shape           | ShapeT                           | 'normal'           | 可选，形状: large \| normal \| small                                |
| size            | SizeT                            | 'normal'           | 可选，形状 normal \| round                                          |
| disabled        | boolean                          | false              | 可选，形状                                                          |
| placeholder     | string                           | 'please select...' | 可选，提示文本                                                      |
| loading         | boolean                          | false              | 可选，加载状态                                                      |
| beforeChange    | function                         | ()=>true           | 可选，return Promise. resolve(true)继续切换，resolve(false)阻止切换 |
| optionWrapClass | string                           | ''                 | 可选，下拉的自定义类                                                |
| optionPosition  | PopupPositionT                   | 'bl'               | 可选，下拉的位置                                                    |
| optionWidthMode | 'auto' \| 'min-width' \| 'width' | 'min-width'        | 可选，下拉的宽度适配方式                                            |

## event

| name   | 参数                        | 说明           |
| :----- | :-------------------------- | :------------- |
| change | (value: boolean; ev: Event) | 选择切换后触发 |

## expose

## slot
