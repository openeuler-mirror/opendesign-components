# Input 输入框

输入框组件，支持用户输入内容

## 说明

> `realValue: number|string` 数字输入框当前值

> `inputValue: string` 输入框框当前值

> `displayValue: string` 输入框展示的值

> 数字非法判断：非 number 字符串（Number 无法转换为数字）、不在[min, max]范围内；

## 组件交互设计

1. 初始化 realValue

   `realValue = modelValue ?? defaultValue`

- 如果 `modelValue` 非法，展示该值，并使用删除线样式;
- 如果 `defaultValue` 非法，展示该值，并使用删除线样式;

2. 聚焦时（鼠标点击，键盘 Tab 切换）

- 触发 `focus` 事件，参数：`(realValue, e)`;

3. 输入时

- 触发`input`事件，参数：`(inputValue, event)`;
- 如果无 `parse`, 赋值`realValue = inputValue`,触发`update:modelValue`事件，参数`(inputValue)`;

4. 失焦时

- 如果有 `format`, `displayValue = format(realValue)`;
- 如果没有 `format`, `displayValue = realValue`;
- 如果有 `parse`, `realValue = parse(inputValue)`;
- 触发`blur`事件，参数：`(realValue, event)`;
- 如果值改变，触发`change`事件，参数: `(realValue)`
- 触发`update:modelValue`事件，参数: `(realValue)`

5. Enter 键按下时

- 如果有 `format`, `displayValue = format(inputValue)`;
- 如果没有 `format`, `displayValue = inputValue`;
- 触发`pressEnter`事件，参数：`(realValue, KeyboardEvent)`;
- 如果值改变，触发`change`事件，参数: `(realValue)`
- 触发`update:modelValue`事件，参数: `(realValue)`

## props 入参

| name           | type                                                        | 默认值      | 说明                                                             |
| :------------- | :---------------------------------------------------------- | :---------- | :--------------------------------------------------------------- |
| modelValue     | String, Number                                              | --          | 可选，输入框的值 v-model                                         |
| defaultValue   | String, Number                                              | --          | 可选，输入框的默认值                                             |
| type           | 'text' \| 'password'                                        | 'text'      | 可选，输入框类型                                                 |
| color          | "normal" \| "primary" \| "success" \| "warning" \| "danger" | 'normal'    | 可选，颜色类型                                                   |
| size           | 'mini' \| 'small' \| 'medium' \| 'large'                    | 'medium'    | 可选，按钮尺寸                                                   |
| variant        | "solid" \| "outline" \| "text"                              | 'outline'   | 可选，按钮类型                                                   |
| disabled       | boolean                                                     | false       | 可选，是否为禁用状态                                             |
| readonly       | boolean                                                     | false       | 可选，是否为只读状态                                             |
| invalid        | boolean                                                     | false       | 可选，是否为非法值状态                                           |
| clearable      | boolean                                                     | true        | 可选，是否可以清除。                                           |
| autoWidth      | boolean                                                     | true        | 可选，是否自动增加宽度                                           |
| placeholder    | string                                                      | --          | 可选，提示文本                                                   |
| showPasswordOn | 'click' \| 'mousedown'                                      | 'mousedown' | 可选，显示密码的方式                                             |
| parse          | (value: string) => string                                   | --          | 可选，解析输入框的值                                             |
| format         | (value: string \| number) => string \| number               | --          | 可选，对值格式化，控制显示格式,需搭配 parse 处理，保证值的正确性 |

## event 事件

| name              | 参数                               | 返回值 | 说明           |
| :---------------- | :--------------------------------- | :----- | :------------- |
| update:modelValue | (value: string)                    | --     | 值更新事件     |
| change            | (value: string)                    | --     | 值变化事件     |
| input             | (value: string,evt: Event)         | --     | 输入事件       |
| blur              | (value: string,evt: FocusEvent)    | --     | 失焦事件       |
| focus             | (value: string,evt: FocusEvent)    | --     | 聚焦事件       |
| clear             | (evt: Event)                       | --     | 清除输入框事件 |
| pressEnter        | (value: string,evt: KeyboardEvent) | --     | 回车事件       |

## slot 插槽

| name    | 说明     |
| :------ | :------- |
| prepend | 前置插槽 |
| prefix  | 前缀插槽 |
| suffix  | 后缀插槽 |
| append  | 后置插槽 |

## expose 导出
