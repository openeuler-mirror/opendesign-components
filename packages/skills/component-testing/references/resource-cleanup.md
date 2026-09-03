---
name: resource-cleanup
description: 组件卸载后资源清理的测试方法，检测 useEventListener / useResizeObserver 在异步延续中调用导致的内存泄漏
metadata:
  version: '1.0.0'
---

# 资源清理测试

## 背景

VueUse 的 `useEventListener`、`useResizeObserver` 等组合式函数依赖 `tryOnScopeDispose` 注册清理。当这些 composable 在 `onMounted` 的 `Promise.then()` 微任务中调用时，组件 effect scope 已关闭，`tryOnScopeDispose` 返回 `false`，清理函数不被注册。组件卸载时 `scope.stop()` 无法触发清理，事件监听和 ResizeObserver 泄漏。

详细原理与修复手法见 [clean-code: async-scope-cleanup.md](../../clean-code/references/async-scope-cleanup.md)。

## 检测原理

不测内存增量（GC 时机不可控、CI 不可行），而是验证**资源释放契约的必经环节**：`removeEventListener` 和 `ResizeObserver.disconnect` 是释放资源的唯一 DOM API 入口，如果它们没被调用，资源必然泄漏。

| 检测目标            | 方法                                                                       | 侵入性                       |
| ------------------- | -------------------------------------------------------------------------- | ---------------------------- |
| 事件监听泄漏        | `vi.spyOn(el, 'addEventListener')` / `vi.spyOn(el, 'removeEventListener')` | 零——作用于测试自建元素       |
| ResizeObserver 泄漏 | 替换 `window.ResizeObserver` 为 mock class                                 | 局部——`try/finally` 严格恢复 |

## 完整测试骨架

### 事件监听清理

```ts
test('卸载后 scroll 事件监听被移除', async () => {
  // 1. 创建目标元素并挂载到 body
  const targetEl = document.createElement('div');
  targetEl.style.cssText = 'width:200px;height:100px;overflow:auto;';
  targetEl.innerHTML = '<div style="width:400px;height:200px;">Content</div>';
  document.body.appendChild(targetEl);

  // 2. spy addEventListener / removeEventListener
  const addSpy = vi.spyOn(targetEl, 'addEventListener');
  const removeSpy = vi.spyOn(targetEl, 'removeEventListener');

  // 3. 挂载组件
  const screen = render({
    render: () => h(OComp, { target: targetEl }),
  });

  // 4. 等待微任务 + RAF（确保 init() 在 Promise.then 中执行完毕）
  await Promise.resolve(); // 微任务
  await flush(); // nextTick + RAF

  // 5. 确认监听已建立
  const added = addSpy.mock.calls.filter((c) => c[0] === 'scroll');
  expect(added.length).toBeGreaterThan(0);

  // 6. 卸载
  screen.unmount();
  await Promise.resolve();
  await flush();

  // 7. 验证监听已移除
  const removed = removeSpy.mock.calls.filter((c) => c[0] === 'scroll');
  expect(removed.length).toBeGreaterThan(0);

  targetEl.remove();
});
```

### ResizeObserver 清理

```ts
test('卸载后 ResizeObserver 被 disconnect', async () => {
  const disconnectSpy = vi.fn();
  const observeSpy = vi.fn();
  const originalRO = window.ResizeObserver;

  // 用 class 而非箭头函数，确保 new ResizeObserver(cb) 可用
  window.ResizeObserver = class {
    observe = observeSpy;
    disconnect = disconnectSpy;
    unobserve = vi.fn();
  } as any;

  try {
    const targetEl = document.createElement('div');
    targetEl.style.cssText = 'width:200px;height:100px;overflow:auto;';
    targetEl.innerHTML = '<div style="width:400px;height:200px;">Content</div>';
    document.body.appendChild(targetEl);

    const screen = render({
      render: () => h(OComp, { target: targetEl }),
    });

    await Promise.resolve();
    await flush();

    expect(observeSpy).toHaveBeenCalled();

    screen.unmount();
    await Promise.resolve();
    await flush();

    expect(disconnectSpy).toHaveBeenCalled();
  } finally {
    window.ResizeObserver = originalRO;
  }
});
```

### 多次挂载/卸载不残留

```ts
test('多次挂载/卸载不残留事件监听', async () => {
  for (let i = 0; i < 3; i++) {
    const targetEl = createScrollTarget();
    const removeSpy = vi.spyOn(targetEl, 'removeEventListener');

    const screen = render({
      render: () => h(OComp, { target: targetEl }),
    });

    await Promise.resolve();
    await flush();

    screen.unmount();
    await Promise.resolve();
    await flush();

    const removed = removeSpy.mock.calls.filter((c) => c[0] === 'scroll');
    expect(removed.length).toBeGreaterThan(0);

    targetEl.remove();
  }
});
```

## 关键细节

### 为什么需要 `await Promise.resolve()`

`onMounted` 回调中 `resolveHtmlElement().then(callback)` 注册的微任务，在 `onMounted` 同步返回后才执行。`flush()` 的 `await nextTick()` 也是微任务，但微任务按 FIFO 处理，先注册的先执行。显式 `await Promise.resolve()` 确保微任务队列在 `flush()` 之前排空。

### 为什么 mock 用 class 而非 `vi.fn().mockImplementation`

`useResizeObserver` 内部执行 `new ResizeObserver(callback)`。`vi.fn().mockImplementation(() => ({...}))` 的实现是箭头函数，箭头函数不能用 `new` 调用，会抛 `TypeError: ... is not a constructor`。用 class 定义确保 `new` 可用。

### 为什么不测内存

| 方法                 | 问题                                       |
| -------------------- | ------------------------------------------ |
| `performance.memory` | Chromium 已废弃，非标准，GC 时机不可控     |
| `WeakRef` + `gc()`   | `gc()` 需 `--expose-gc` flag，CI 不可用    |
| 堆快照对比           | V8 `--expose-gc` 在 Playwright CI 中不现实 |

spy / mock 测的是 API 调用事实（`removeEventListener` 是否被调用），确定性 100%、可复现、不依赖 GC 时机。

## 准确性与侵入性

**准确性**：测试断言的是资源释放链路的末端（`removeEventListener` / `disconnect`），而非中间环节。只要末端 API 没被调用，资源必然泄漏——这是 DOM 规范层面的保证。

**对源码侵入性**：零。测试文件完全独立，不 import 内部模块，不修改组件代码。可对修复前代码运行（会 fail，证明泄漏存在），也可对修复后代码运行（会 pass，证明修复有效）。

**对运行时侵入性**：

- 事件监听测试：纯黑盒 spy，不修改全局状态
- ResizeObserver 测试：临时替换全局构造函数，`try/finally` 严格恢复

## 标杆测试

[OScrollbar.leak.test.ts](../../opendesign/src/scrollbar/__tests__/OScrollbar.leak.test.ts) — 3 个用例覆盖事件监听清理、ResizeObserver 清理、多次挂载/卸载不残留。

> 完整方法论见 [component-testing/SKILL.md](../SKILL.md)
