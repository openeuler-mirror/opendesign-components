# Breadcrumb 面包屑

| name      | type             | 默认值 | 说明             |
| :-------- | :--------------- | :----- | ---------------- |
| separator | string \| number | -      | 可选，分隔符字符 |

# BreadcrumbItem

| name      | type                                           | 默认值   | 说明                                     |
| :-------- | :--------------------------------------------- | :------- | ---------------------------------------- |
| href      | string                                         | -        | 可选，链接跳转地址                       |
| target    | '\_blank' \| '\_parent' \| '\_self' \| '\_top' | '\_self' | 可选，链接跳转方式                       |
| to        | string \| obeject                              | -        | 可选，路由跳转对象，同 vue-router        |
| replace   | boolean                                        | false    | 可选，路由跳转时，是否覆盖浏览器历史记录 |
| separator | string \| number                               | -        | 可选，分隔符字符                         |
