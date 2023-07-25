# Select 下拉选择器

下拉选择框，支持单选、多选，加载中状态

## props

| name              | type                                                                                                                 | 默认值                      | 说明                                     |
| :---------------- | :------------------------------------------------------------------------------------------------------------------- | :-------------------------- | ---------------------------------------- |
| modelValue        | string \| number \| string[] \| number[] \| (string \| number)[]                                                     | --                          | 必选，下拉框的 v-model 值                |
| defaultValue      | string \| number \| string[] \| number[] \| (string \| number)[]                                                     | --                          | 必选，下拉框的值                         |
| color             | "normal" \| "primary" \| "success" \| "warning" \| "danger"                                                          | 'normal'                    | 可选，颜色类型                           |
| size              | 'mini' \| 'small' \| 'medium' \| 'large'                                                                             | 'medium'                    | 可选，按钮尺寸                           |
| variant           | "solid" \| "outline" \| "text"                                                                                       | 'outline'                   | 可选，按钮类型                           |
| loading           | boolean                                                                                                              | false                       | 可选，加载状态                           |
| disabled          | boolean                                                                                                              | false                       | 可选，是否为禁用状态                     |
| placeholder       | string                                                                                                               | --                          | 可选，提示文本                           |
| multiple          | boolean                                                                                                              | false                       | 可选，是否支持多选                       |
| maxTagCount       | boolean                                                                                                              | false                       | 可选，是否支持多选                       |
| clearable         | boolean                                                                                                              | true                        | 可选，是否是否可以清除                   |
| trigger           | PopupTriggerT                                                                                                        | true                        | 可选，是否是否可以清除                   |
| optionPosition    | PopupPositionT                                                                                                       | 'bl'                        | 可选，下拉的位置                         |
| optionWidthMode   | 'auto' \| 'min-width' \| 'width'                                                                                     | 'min-width'                 | 可选，下拉的宽度适配方式                 |
| optionWrapClass   | string                                                                                                               | ''                          | 可选，下拉的自定义类                     |
| unmountOnHide     | boolean                                                                                                              | false                       | 可选，是否在结束选择时，卸载下拉选项     |
| transition        | string                                                                                                               | o-fade-up-enter             | 可选，过渡动画                           |
| beforeSelect      | (value: string \| number, currentValue: SelectValueT) => Promise<boolean \| SelectValueT> \| boolean \| SelectValueT | --                          | 可选，选择前回调，根据返回值判断是否显示 |
| beforeOptionsShow | () => Promise<boolean> \| boolean                                                                                    | --                          | 显示前回调，根据返回值判断是否显示       |
| optionsWrapper    | string \| HTMLElement \| null                                                                                        | 'body'                      | 显示前回调，根据返回值判断是否显示       |
| foldLabel         | (tags: Array<SelectOptionT>) => string                                                                               | --                          | 多选超过最大 tag 是，文本显示            |
| showFoldTags      | boolean \| 'hover' \| 'click'                                                                                        | 'hover'                     | 浮层显示收起的多选 tag                   |
| optionTitle       | string                                                                                                               | 选项标题（pad、phone 显示） |
| noResponsive      | boolean                                                                                                              | 下拉浮层是否响应式          |

## event

| name                   | 参数                   | 说明                    |
| :--------------------- | :--------------------- | :---------------------- |
| change                 | (value: SelectValueT)  | 选择值切换后触发        |
| update:modelValue      | (value: SelectValueT ) | 选择值变化触发          |
| options-visible-change | (value: boolean )      | 下拉选项显示/隐藏后触发 |
| clear                  | (evt: Event )          | 清除下拉框的值后触发    |

## expose

## slot

| name     | 说明               |
| :------- | :----------------- |
| tag-fold | 多选时，折叠的文本 |
| arrow    | 下拉箭头图标插槽   |
| suffix   | 下拉框后缀插槽     |
| default  | 下拉选项插槽       |
| empty    | 下拉选项为空时插槽 |
| 'name'   | 每个下拉选项插槽   |
