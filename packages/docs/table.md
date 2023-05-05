# Table 表格

## props

### OTab

| name       | type                        | 默认值 | 说明                                 |
| :--------- | :-------------------------- | :----- | ------------------------------------ |
| modelValue | string \| number（v-model） | ''     | 可选，开关状态                       |
| lazy       | boolean                     | false  | 可选，是否在首次激活标签时再挂载内容 |
| addable    | boolean                     | false  | 可选，是否可以添加页签               |

### OTabPane

| name          | type             | 默认值          | 说明                                 |
| :------------ | :--------------- | :-------------- | ------------------------------------ |
| value         | string \| number | instance.uid    | 可选，tab id                         |
| label         | string           | undefined       | 可选，页签文本                       |
| transition    | string           | o-fade-up-enter | 可选，页签切换时过渡动画             |
| lazy          | boolean          | false           | 可选，是否在首次激活标签时再挂载内容 |
| unmountOnHide | boolean          | false           | 可选，是否在未激活时卸载页签内容     |
| disabled      | boolean          | false           | 可选，是否禁用选中                   |
| closable      | boolean          | false           | 可选，是否可以删除                   |

## event

### OTab

| name   | 参数                                                  | 说明           |
| :----- | :---------------------------------------------------- | :------------- |
| change | (value: string \| number, oldValue: string \| number) | 页签切换后触发 |
| delete | (value: string \| number )                            | 页签删除后触发 |

## expose

## slot

### OTab

| name | 说明                 |
| :--- | :------------------- |
| act  | 页签右侧额外内容插槽 |

### OTabPane

| name | 说明     |
| :--- | :------- |
| nav  | 页签插槽 |
