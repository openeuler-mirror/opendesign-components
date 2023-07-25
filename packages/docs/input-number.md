# input-number 数字输入框

## 说明

> currentValue: number|string 数字输入框当前值

> realValue: number 数字输入框当前真实值

> inputValue: string 输入框框当前值

> 数字非法判断：非 number 字符串（Number 无法转换为数字）、不在[min, max]范围内；

## 设计

1. 初始化 currentValue

   `currentValue = modelValue ?? defaultValue`

- 如果 modelValue 非法，展示该值，并使用删除线样式
- 如果 defaultValue 非法，展示该值，并使用删除线样式

2. 聚焦时（鼠标点击，键盘 Tab 切换）

- 触发 focus 事件，参数：(realValue, event)

3. 输入时

- 触发`input`事件，参数：(inputValue, event)
- 如果输入值非法，展示该值，并使用删除线样式

4. 失焦时

-
- 触发`blur`事件，参数：(currentValue, event)

parse/format

1. 当 change 事件时，执行 format
