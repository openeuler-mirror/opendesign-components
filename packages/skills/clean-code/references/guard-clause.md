---
name: guard-clause
description: 用卫语句（提前 return）消除嵌套 if 块，解决 max-depth 超限问题
metadata:
  version: '1.0.0'
---

# 卫语句展平嵌套

## 触发场景

ESLint 报告 `max-depth` 超限，或函数中存在多层嵌套 `if` 块。

## 核心思路

将"满足条件才继续"的 `if` 翻转为"不满足就提前退出"，把嵌套结构变成线性结构。**复杂度计数不变，但代码变为线性，每个卫语句可独立提取或调整顺序。**

## 重构示例

```ts
// ❌ 嵌套——max-depth 超限，难以提取
function handleSubmit(event) {
  if (enabled.value) {
    if (!loading.value) {
      if (validate(event)) {
        doSubmit(event);
      }
    }
  }
}

// ✅ 卫语句——每行意图独立，max-depth 降为 1
function handleSubmit(event) {
  if (!enabled.value) return;
  if (loading.value) return;
  if (!validate(event)) return;
  doSubmit(event);
}
```

## 适用时机

- 处理器 / 事件回调中存在多层嵌套条件
- `watch` / `computed` 回调中有前置校验逻辑

## 注意

卫语句仅展平结构，**不降低圈复杂度**。展平后如果 `local/cumulative-complexity` 仍超限，继续用提取纯函数（手法一）或拆分子 composable（手法二）进一步处理。

> 完整工作流见 [clean-code/SKILL.md](../SKILL.md)
