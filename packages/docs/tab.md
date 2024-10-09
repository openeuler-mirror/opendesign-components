# Tab 页签

页签组件，支持切换页签显示不同内容

## props

### OTab

| name        | type                           | 默认值    | 说明                                 |
| :---------- | :----------------------------- | :-------- | ------------------------------------ |
| modelValue  | string \| number（v-model）    | ''        | 可选，开关状态                       |
| lazy        | boolean                        | false     | 可选，是否在首次激活标签时再挂载内容 |
| addable     | boolean                        | false     | 可选，是否可以添加页签               |
| variant     | "solid" \| "outline" \| "text" | 'outline' | 可选，按钮类型                       |
| addInactive | boolean                        | false     | 可选，不激活新添加页签               |
| line        | boolean                        | true      | 可选，是否展示 nav 线                |

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

| name   | 参数                                                    | 说明             |
| :----- | :------------------------------------------------------ | :--------------- |
| change | (value: string \| number, oldValue: string \| number)   | 页签切换后触发   |
| change | (value: string \| number, oldValue?: string \| number ) | 页签切换变化触发 |
| delete | (value: string \| number )                              | 页签删除后触发   |
| add    | (evt: MouseEvent )                                      | 页签添加后触发   |

## expose

## slot

### OTab

| name   | 说明     |
| :----- | :------- |
| prefix | 前缀插槽 |
| suffix | 后缀插槽 |
| anchor | 高亮插槽 |

### OTabPane

| name    | 说明         |
| :------ | :----------- |
| nav     | 页签头部插槽 |
| default | 页签内容插槽 |
