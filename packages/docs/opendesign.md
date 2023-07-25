# opendesign 组件设计

## 需求背景

为了支撑 openEuler 社区前端体验提升，帮助更多开发者、Sig 组快速搭建自己的前端页面，故设计开发了一套前端组件库。
该组件库需要支持：

1. 强大的皮肤定制能力，支持开发者快速定制皮肤，实现页面风格一致；
2. 上手难度低，开箱即用，提供示例模版，能快速搭建项目页面；

## 方案设计

1. 基于当前开发者能力现状（国内 vue 开发者最多），采用 vue3 作为组件开发框架，组件实现采用逻辑与 UI 分离；
2. 基于 Css Variables，结合 opendesign 设计体系，设计变量体系，定义全局变量以及每个组件变量，实现全局+局部皮肤定制能力；
3. 针对尺寸、颜色、圆角、图标等设置，提供全局配置接口，基于 vue 响应式机制，实现配置动态化
4. 组件避免依赖 dom，支持服务端渲染；

## 方案实现

### 变量体系 Token

#### 1. 全局变量

- 色盘 Palette
- 颜色 Color
  - 基础色
  - 状态色
  - 控件色
  - 填充色
  - 信息色
- 阴影 Shadow
- 字体 Font
- 尺寸 Size
  - 组件尺寸
  - 图标尺寸
  - 圆角尺寸
- 间距 Gap
- 动画 Animation
  - 动画曲线
  - 持续时间

> 例： [light.token.css](../opendesign/src/_styles/light.token.css)

#### 2. 组件变量

基于每个组件状态、类型，定义组件变量，值引用全局变量.

> 例： [button/var.css](../opendesign/src/button/style/var.scss)

### 动态全局配置

1. 设置全局默认值，同时暴露接口进行默认值修改
2. 组件内部图标统一配置，并支持接口修改，实现组件深度定制

#### 1. 配置全局样式

| 方法名         | 参数                                    | 返回值 | 说明                     |
| :------------- | :-------------------------------------- | :----- | :----------------------- |
| initSize       | (type: 'large' \| 'medium' \| 'small')  | --     | 设置全局组件尺寸         |
| initRound      | (type: 'pill' \| '')                    | --     | 设置全局组件圆角         |
| initZIndex     | (val: number)                           | --     | 设置全局组件初始 z-index |
| initMediaPoint | point: Record<'phone' \| 'pad', number> | --     | 设置全局组件响应式断点   |

#### 2. 配置全局图标

具体接口见[`init-icons.ts`](../opendesign/src/_utils/init-icons.ts)
