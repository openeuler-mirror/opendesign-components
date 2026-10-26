---
name: async-scope-cleanup
description: VueUse composable 在 Promise.then / setTimeout 等异步延续中调用时 tryOnScopeDispose 失效的预防模式
metadata:
  version: '1.0.0'
---

# 异步延续中的资源清理

## 触发场景

ESLint 无法检测此类问题，需人工判断。当组件代码出现以下模式时适用：

- `onMounted` 回调中使用 `Promise.then()` 延续异步逻辑
- `onMounted` 回调中 `await` 之后再调用 VueUse composable
- `setTimeout` / 事件回调 / `requestAnimationFrame` 回调中调用 VueUse composable

## 核心原理

VueUse 的 `useEventListener`、`useResizeObserver`、`useTimeoutFn`、`useIntervalFn` 等组合式函数内部通过 `tryOnScopeDispose(fn)` 注册清理：

```js
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    // 检查 activeEffectScope
    onScopeDispose(fn); // 有 scope → 注册清理
    return true;
  }
  return false; // 无 scope → 不注册，清理丢失
}
```

Vue 的 `injectHook` 在 `onMounted` 回调同步部分调用 `setCurrentInstance(target)` 打开 scope，回调返回后立即 `scope.off()`。`Promise.then()` 是微任务，在 `scope.off()` 之后才执行，此时 `getCurrentScope()` 返回 `undefined`。

```
onMounted 同步段     → scope.on()  ✅ tryOnScopeDispose 生效
onMounted 返回后     → scope.off()
Promise.then 微任务  → scope 已关闭 ❌ tryOnScopeDispose 返回 false
```

## 风险模式识别

以下写法会导致 `useEventListener` / `useResizeObserver` 等的清理函数不被注册：

```ts
// ❌ Promise.then 微任务中调用——scope 已关闭
onMounted(() => {
  resolveHtmlElement(target).then((el) => {
    useEventListener(el, 'scroll', onScroll); // tryOnScopeDispose 失效
    useResizeObserver(el, updateSize); // tryOnScopeDispose 失效
  });
});

// ❌ await 之后的代码也不在 scope 内
onMounted(async () => {
  const el = await resolveElement();
  useEventListener(el, 'scroll', onScroll); // tryOnScopeDispose 失效
});

// ❌ setTimeout 回调同理
onMounted(() => {
  setTimeout(() => {
    useEventListener(el, 'scroll', onScroll); // tryOnScopeDispose 失效
  }, 0);
});
```

**安全的位置**（scope 激活，`tryOnScopeDispose` 生效）：

- `<script setup>` 顶层同步代码
- `onMounted` 回调的同步部分（`await` / `.then()` 之前）
- `onBeforeMount` 回调的同步部分

## 修复模式

当 VueUse composable 必须在异步延续中调用时，捕获其返回的 stop 函数，在 `onUnmounted` 中手动清理：

```ts
// ✅ 捕获 stop 函数，手动清理
const cleanups: (() => void)[] = [];

const init = () => {
  if (!targetEl) return;

  const ro = useResizeObserver(targetEl, updateSize);
  cleanups.push(ro.stop);

  const stopScroll = useEventListener(targetEl, 'scroll', onScroll);
  cleanups.push(stopScroll);
};

onMounted(() => {
  resolveHtmlElement(target).then((el) => {
    targetEl = el;
    init();
  });
});

onUnmounted(() => {
  cleanups.forEach((fn) => fn());
  cleanups.length = 0;
});
```

**各 composable 返回值类型**：

| composable          | 返回值               | 清理调用  |
| ------------------- | -------------------- | --------- |
| `useEventListener`  | `() => void`（stop） | `stop()`  |
| `useResizeObserver` | `{ stop }`           | `stop()`  |
| `useTimeoutFn`      | `{ start, stop }`    | `stop()`  |
| `useIntervalFn`     | `{ pause, resume }`  | `pause()` |

## 替代方案：避免异步

如果业务允许，优先将异步解析改为同步，使 composable 在 scope 激活期调用：

```ts
// ✅ onMounted 时 DOM 已就绪，可同步解析
onMounted(() => {
  const el = getHtmlElement(target); // 同步，不走 Promise
  if (!el) return;
  useEventListener(el, 'scroll', onScroll); // scope 激活，tryOnScopeDispose 生效
});
```

> 完整工作流见 [clean-code/SKILL.md](../SKILL.md)
