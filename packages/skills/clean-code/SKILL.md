---
name: clean-code
description: 代码质量诊断与重构指南。当被要求做 clean code、提升代码质量、重构函数/模块、降低复杂度、消除嵌套、精简参数、拆分过长函数，或讨论圈复杂度、认知复杂度、卫语句、配置对象、状态机、查表等 clean code 子话题时应用。
metadata:
  version: '1.1.0'
---

# 代码质量诊断与重构指南

> **触发场景：** clean code / 代码质量 / 重构函数或模块 / 降低复杂度 / 消除嵌套 / 参数过多 / 函数体过长 / 圈复杂度 / 认知复杂度 / 卫语句 / 查表 / 状态机 / 拆分 composable

## 第一步：用 ESLint 扫描问题（必须最先执行）

**所有问题必须由 ESLint 报告，禁止用模型阅读代码后自行估算。** 模型心算容易漏计分支、误判运算符，结论不可信。

在做任何分析或重构之前，先跑：

```bash
pnpm exec eslint --config packages/skills/clean-code/eslint.diagnose.ts <目标文件路径>
```

输出不含格式/类型等无关警告，便于直接阅读。**根据 warning 的规则名查找对应参考文档：**

| 规则名                        | 含义                               | 参考文档                                                  |
| ----------------------------- | ---------------------------------- | --------------------------------------------------------- |
| `local/cumulative-complexity` | 函数累计圈复杂度（含嵌套闭包）超限 | [reduce-complexity.md](./references/reduce-complexity.md) |
| `max-depth`                   | 嵌套层数过深                       | [guard-clause.md](./references/guard-clause.md)           |
| `max-lines-per-function`      | 函数体行数过长                     | [split-composable.md](./references/split-composable.md)   |
| `max-params`                  | 参数超过 3 个                      | [config-object.md](./references/config-object.md)         |

只有出现在 ESLint 输出中的问题才是重构目标，其余不处理。

**认知复杂度无 ESLint 规则检测**，需人工判断。当代码存在嵌套条件难读、复杂布尔表达式、嵌套三元、Promise 链嵌套、多层循环等问题时，直接参考 [reduce-complexity.md](./references/reduce-complexity.md) 手法六～十。

---

## 完整工作流

```
1. pnpm exec eslint --config packages/skills/clean-code/eslint.diagnose.ts <文件>
                               ← 取得全部问题列表（唯一可信来源）
2. 按规则名查上方映射表，打开对应参考文档
3. 按参考文档选择手法重构
4. 重复步骤 1                  ← 验证全部消除
5. 若仍有报告，回到步骤 3
```

**不允许跳过步骤 1 直接进入步骤 3。** 即使模型已读取文件，也必须先运行 ESLint，以实际输出为准决定重构范围。

---

## 修改后的验证步骤

重构完成后，再次运行诊断配置：

```bash
pnpm exec eslint --config packages/skills/clean-code/eslint.diagnose.ts <修改的文件路径>
```

**读取结果的方式：**

- 所有出现的 warning → **必须修复**，按规则名查映射表找对应手法

若仍存在报告，继续应用手法直到全部消除。
