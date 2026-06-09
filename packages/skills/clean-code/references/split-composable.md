---
name: split-composable
description: 将过长的 composable 拆分为多个子 composable，解决 max-lines-per-function 超限问题
metadata:
  version: '1.0.0'
---

# 拆分子 Composable

## 触发场景

ESLint 报告 `max-lines-per-function` 超限（阈值 100 行），或 composable 同时处理多个不同关注点。

## 核心思路

**Composable 是组合器，不是实现者。** 将每个独立关注点提取为专注的子 composable，外层只做装配。

## 重构示例

```ts
// ❌ 一个 composable 处理太多事：状态 + 校验 + 提交
export function useForm() {
  // 60+ 行混合逻辑...
}

// ✅ 三个子 composable，各司其职
/** 管理字段值与 dirty 状态 */
function useFormState() {
  /* ≤ 100 行 */
}

/** 提供字段校验逻辑，依赖 state */
function useFormValidation(state: ReturnType<typeof useFormState>) {
  /* ≤ 100 行 */
}

/** 处理提交流程，依赖 state 和 validation */
function useFormSubmit(state: ReturnType<typeof useFormState>, validation: ReturnType<typeof useFormValidation>) {
  /* ≤ 100 行 */
}

/** 对外暴露统一接口，本身只做装配 */
export function useForm() {
  const state = useFormState();
  const validation = useFormValidation(state);
  const submit = useFormSubmit(state, validation);
  return { ...state, ...validation, ...submit };
}
```

## 拆分依据

以"关注点"划分，每个子 composable 只做一件事：

- 数据状态管理（state）
- 业务校验（validation）
- 异步操作（fetch / submit）
- UI 交互状态（loading / visible）

## 注意

子 composable 之间依赖通过参数传递，**不共享 ref 对象本身**，保持每个子 composable 可独立测试。
子 composable 入参超过 3 个时，改用配置对象（见 [config-object.md](./config-object.md)）。

> 完整工作流见 [clean-code/SKILL.md](../SKILL.md)
