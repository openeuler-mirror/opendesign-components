### scrollbar 刷新的时机

- `showType = hover`

1. 目标容器滚动时；
2. 鼠标 hoverout 时刷新；

- `showType = always`

1. 目标容器滚动时；
2. `autoUpdateOnScrollSize=true`时每 1s 后，在 js idle 时间内刷新；

- `showType = auto`

1. 目标容器滚动时；
