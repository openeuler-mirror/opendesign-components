# 全局配置设计

组件可以通过全局配置部分样式属性，同时支持动态设置。

## 方案设计

1. 设置全局默认值，同时暴露接口进行默认值修改，基于 vue 响应式，实现全局配置动态化
2. 组件内部图标统一配置，并支持接口修改，实现组件深度定制

## 配置全局样式

| 方法名         | 参数                                    | 返回值 | 说明                     |
| :------------- | :-------------------------------------- | :----- | :----------------------- |
| initSize       | (type: 'large' \| 'medium' \| 'small')  | --     | 设置全局组件尺寸         |
| initRound      | (type: 'pill' \| '')                    | --     | 设置全局组件圆角         |
| initZIndex     | (val: number)                           | --     | 设置全局组件初始 z-index |
| initMediaPoint | point: Record<'phone' \| 'pad', number> | --     | 设置全局组件响应式断点   |

## 配置全局图标

具体接口见[`init-icons.ts`](../opendesign/src/_utils/init-icons.ts)

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
