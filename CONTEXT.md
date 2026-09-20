# OpenDesign Components

基于 pnpm workspace 的 Vue 3 组件库 monorepo（`@opensig/opendesign` 及其配套构建、文档、门户包）。

## Language

### 弹层定位（OPopup 语境）

**定位源（position source）**:
决定弹层出现位置的输入。元素模式下是目标元素的实时矩形，数据模式下是调用方传入的 `TargetRect`。
_Avoid_: 定位真相、定位目标、targetRect 优先级

**交互元素（interaction element）**:
接收触发事件（hover/click/focus 等）并被观察可见性的真实 DOM 元素。与定位源正交：同一弹层的交互元素与定位源可以不同。
_Avoid_: 触发对象、trigger 元素（与 trigger 事件类型混称时）

**TargetRect**:
视口坐标系下的目标矩形快照数据，结构兼容 DOMRect。滚动/缩放的跟随职责在调用方，组件不代劳。
_Avoid_: VirtualElement、虚拟元素、虚拟定位点
