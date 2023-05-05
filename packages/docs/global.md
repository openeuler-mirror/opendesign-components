# 全局配置

## 配置全局样式

| 方法名    | 参数                                   | 返回值 | 说明             |
| :-------- | :------------------------------------- | :----- | :--------------- |
| initSize  | (type: 'large' \| 'normal' \| 'small') | --     | 设置全局组件尺寸 |
| initRound | (type: 'pill' \| '')                   | --     | 设置全局组件圆角 |

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

# 变量定义都在 var.scss 里，同时使用最外层内定义；

# 状态类 如果在最外层使用 o-[component]-[status]，在内部可以使用 is-[status]

# 不同状态通过类改变变量值，而不是新定义多个变量；

# 变量命名

- 边框（bd） `--btn-bd: 1px solid var(--o-color-control1)`
- 边框颜色（bd-color） `--btn-bd-color: var(--o-color-control1)`
- 背景颜色（bg-color） `--btn-bg-color: var(--o-color-control1)`

# polyfill

> resize-observer-polyfill
> intersection-observer-polyfill
> 建议在项目使用时引入
