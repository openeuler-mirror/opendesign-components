# Skeleton 骨架屏

## skeletonProps

| name      | type    | 默认值 | 说明                                     |
| :-------- | :------ | :----- | ---------------------------------------- |
| loading   | boolean | true   | 可选，是否显示加载中状态（即展示骨架屏） |
| animation | boolean | false  | 可选，是否展示动画                       |
| rows      | number  | 3      | 可选，行数                               |

## skeletonTextProps

| name | type   | 默认值 | 说明       |
| :--- | :----- | :----- | ---------- |
| rows | number | 3      | 可选，行数 |

## skeletonAvatarProps

| name  | type                                 | 默认值   | 说明           |
| :---- | :----------------------------------- | :------- | -------------- |
| size  | 'large'\| 'medium'\| 'small'\|'mini' | 'medium' | 可选，头像尺寸 |
| round | string                               | 'pill'   | 可选，圆角值   |

## slot

| name     | 参数 | 说明           |
| :------- | :--- | :------------- |
| template |      | 骨架屏模板内容 |
| default  |      | 骨架屏展示内容 |
