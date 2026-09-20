# OPopup 定位数据采用 TargetRect 快照契约

#199 定位回归暴露了 OPopup 中 `targetEl` 被多个 watcher 写入、靠写入时机协调的结构问题，重构为「定位源 / 交互元素正交分离」。定位数据的公开契约从 VirtualElement（`getBoundingClientRect` 闭包）切换为 TargetRect（结构兼容 DOMRect 的纯数据快照）：整体替换对象是主用法；`deep: true` 使响应式对象原地修改坐标同样生效；滚动/缩放的跟随职责归调用方（OTour 自行监听 scroll 写回 rect）。

## Considered Options

- **VirtualElement 闭包**（floating-ui 惯用形态）：不透明、不可 deep watch、不可比较，与 Vue 响应式模型不友好。否决。
- **纯 deep 语义**（只支持原地修改）：普通对象原地修改静默失效，契约不可靠。否决。
- **computed 缓存 rect**：`getBoundingClientRect()` 非响应式，滚动/缩放下必然陈旧。否决。

## Consequences

- 组件内部必须**拷贝写入**内部定位状态（整体替换新对象），否则调用方原地修改无法触发内部浅层 watch——与 #199 属同类病灶，禁止直接存 prop 引用。
- 普通对象原地修改不触发重算，这是文档化行为而非缺陷。
- `target` 与 `targetRect` 同传仍为误用：维持运行时 warning，不做编码层面限制（与既有行为一致）。
