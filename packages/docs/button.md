# Button 按钮 组件设计

# 组件介绍

页面中常用的按钮

1. 支持设置不同状态颜色，设置边框、填充样式，以及圆角值（也支持全局设置）；
2. 支持加载状态
3. 支持设置链接跳转，图标

## props 入参

| name     | type                                                        | 默认值    | 说明                       |
| :------- | :---------------------------------------------------------- | :-------- | :------------------------- |
| color    | "normal" \| "primary" \| "success" \| "warning" \| "danger" | 'normal'  | 可选，颜色类型             |
| size     | 'mini' \| 'small' \| 'medium' \| 'large'                    | 'medium'  | 可选，按钮尺寸             |
| variant  | "solid" \| "outline" \| "text"                              | 'outline' | 可选，按钮类型             |
| loading  | boolean                                                     | false     | 可选，加载状态             |
| disabled | boolean                                                     | false     | 可选，是否为禁用状态       |
| href     | string                                                      | --        | 可选，链接跳转             |
| icon     | Component                                                   | --        | 可选，前缀图标             |
| tag      | string                                                      | 'button'  | 可选，自定义元素 html 标签 |

## event 事件

| name  | 参数           | 返回值 | 说明     |
| :---- | :------------- | :----- | :------- |
| click | (e:MouseEvent) | --     | 点击事件 |

## slot 插槽

| name    | 说明         |
| :------ | :----------- |
| default | 按钮内容     |
| icon    | 前缀按钮图标 |
| suffix  | 后缀         |

## expose 导出
