# 全局配置

## 配置全局样式

| 方法名    | 参数                                   | 返回值 | 说明             |
| :-------- | :------------------------------------- | :----- | :--------------- |
| initSize  | (type: 'large' \| 'normal' \| 'small') | --     | 设置全局组件尺寸 |
| initShape | (type: 'normal' \| 'round')            | --     | 设置全局组件形状 |

## 配置全局图标

| 方法名             | 参数              | 返回值 | 说明                   |
| :----------------- | :---------------- | :----- | :--------------------- |
| initLoadingIcon    | (icon: Component) | --     | 设置全局加载按钮图标   |
| initLinkArrowIcon  | (icon: Component) | --     | 设置 link 组件箭头图标 |
| initLinkPrefixIcon | (icon: Component) | --     | 设置 link 组件前缀图标 |
| initCloseIcon      | (icon: Component) | --     | 设置全局关闭图标       |
| initAddIcon        | (icon: Component) | --     | 设置全局添加图标       |

| 方法名  | 参数                                  | 默认值    |
| :------ | :------------------------------------ | :-------- |
| color   | normal primary success warning danger | normal    |
| variant | fill outline text                     | outline   |
| rounded | undefined string 'pill'               | undefined |
| size    | small normal large                    | normal    |
