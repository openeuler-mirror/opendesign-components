# Menu 菜单

## OMenu

### props

| name                | type            | 默认值 | 说明                                   |
| :------------------ | :-------------- | :----- | -------------------------------------- |
| modelValue(v-model) | string          | -      | 可选，双向绑定值                       |
| defaultValue        | boolean         | false  | 可选，非受控状态时，默认选中值         |
| expanded(v-model)   | Array<string \> | -      | 可选，双向展开的子菜单值               |
| defaultExpanded     | Array<string \> | false  | 可选，非受控状态时，默认展开的子菜单值 |
| accordion           | boolean         | false  | 可选，是否开启手风琴模式               |
| levelIndent         | number          | 24     | 可选，层级缩进值                       |

### event

| name            | 参数                 | 说明                   |
| :-------------- | :------------------- | :--------------------- |
| change          | val: string          | 选中值切换后触发       |
| expanded-change | val: Array<string \> | 展开子菜单值切换后触发 |

## OSubMenu

### props

| name  | type   | 默认值 | 说明           |
| :---- | :----- | :----- | -------------- |
| value | string | -      | 必选，子菜单值 |

## slot

| name | 参数 | 说明       |
| :--- | :--- | :--------- |
| icon |      | 自定义图标 |

## OMenuItem

### props

| name     | type    | 默认值 | 说明             |
| :------- | :------ | :----- | ---------------- |
| value    | string  | -      | 必选，菜单选项值 |
| disabled | boolean | false  | 可选，是否禁用   |

## event

| name  | 参数 | 说明     |
| :---- | :--- | :------- |
| click |      | 点击触发 |
