# Input 输入框

## 说明

> `realValue: number|string` 数字输入框当前值

> `inputValue: string` 输入框框当前值

> `displayValue: string` 输入框展示的值

> 数字非法判断：非 number 字符串（Number 无法转换为数字）、不在[min, max]范围内；

## 设计

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
