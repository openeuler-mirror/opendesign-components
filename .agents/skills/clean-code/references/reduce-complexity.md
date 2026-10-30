---
name: reduce-complexity
description: 降低函数圈复杂度与认知复杂度的手法。当 local/cumulative-complexity 超限，或代码存在嵌套条件难读、复杂布尔表达式、嵌套三元、Promise 链嵌套等问题时应用。
metadata:
  version: '2.0.0'
---

# 降低函数复杂度

## 两种复杂度的区别

| 维度       | 圈复杂度                           | 认知复杂度           |
| ---------- | ---------------------------------- | -------------------- |
| 度量目标   | 可测试路径数                       | 人理解代码的难度     |
| 嵌套处理   | 每个分支 +1，与层级无关            | 每层嵌套额外加分     |
| 卫语句效果 | 不降低（路径数不变）               | 显著降低（消除嵌套） |
| 检测方式   | `local/cumulative-complexity` 报告 | 需人工判断           |

---

## 核心原则

**函数是组合器，不是实现者。** 将复杂度下沉到更小的纯函数或子模块中，调用者只负责装配。

手法按**典型应用顺序**排列——从改动最小的快速收益到影响最广的架构调整，优先尝试编号较小的手法。

---

## 手法一：卫语句展平嵌套

→ 详见 [guard-clause.md](./guard-clause.md)

**优先应用此手法**——展平嵌套后，后续手法的应用空间更大。同时显著降低认知复杂度（消除嵌套惩罚）。

---

## 手法二：消除 else-after-return

当 `if` 分支已经通过 `return`/`throw` 退出，后续的 `else` 是结构上的多余——人为制造了一个缩进层级。

```ts
// ❌ return 之后的 else 造成不必要的嵌套
function getLabel(status: string) {
  if (status === 'active') {
    return '激活';
  } else if (status === 'inactive') {
    return '停用';
  } else {
    return '未知';
  }
}

// ✅ 每个分支平铺，线性阅读
function getLabel(status: string) {
  if (status === 'active') return '激活';
  if (status === 'inactive') return '停用';
  return '未知';
}
```

**适用时机：** `if` / `else if` 的每个分支都以 `return` 或 `throw` 结束。

---

## 手法三：命名复杂条件

将多个子条件组成的布尔表达式提取为具名变量或谓词函数，读者无需逐项推演。

```ts
// ❌ 条件意图不明，需要逐项阅读
if (user.age >= 18 && user.isVerified && !user.isBanned && user.balance > 0) {
  allowPurchase();
}

// ✅ 命名变量——意图一目了然
const isEligibleToPurchase = user.age >= 18 && user.isVerified && !user.isBanned && user.balance > 0;

if (isEligibleToPurchase) {
  allowPurchase();
}
```

条件本身复杂时，进一步提取为谓词函数：

```ts
/**
 * 判断用户是否满足购买条件
 * @param user - 待校验的用户对象
 * @returns 是否允许购买
 */
function isEligibleToPurchase(user: User): boolean {
  return user.age >= 18 && user.isVerified && !user.isBanned && user.balance > 0;
}
```

**适用时机：** 条件表达式超过 2 个子条件，或条件含义不能从变量名直接推断。

---

## 手法四：避免嵌套三元运算符

单层三元运算符可读，嵌套三元需要从内向外解读，认知负担指数级增加。

```ts
// ❌ 嵌套三元——必须从内向外解读
const message = isLoggedIn ? (isAdmin ? '欢迎，管理员' : '欢迎，用户') : '请登录';

// ✅ 改用 if/else，线性阅读
function getMessage(isLoggedIn: boolean, isAdmin: boolean) {
  if (!isLoggedIn) return '请登录';
  if (isAdmin) return '欢迎，管理员';
  return '欢迎，用户';
}
```

**规则：** 三元运算符只允许一层，条件或结果本身再有分支时必须改用 `if/else`。

---

## 手法五：提取纯函数

将回调或内联函数中的逻辑抽取为独立的纯函数。所有分支集中在纯函数中，可独立测试，调用方的复杂度接近零。

```ts
interface StatusInput {
  /** 是否正在加载 */
  loading: boolean;
  /** 请求错误信息，无错误时为 null */
  error: unknown;
  /** 请求返回的数据 */
  data: unknown;
}

/**
 * 根据请求状态解析当前展示状态
 * @param loading - 是否正在加载
 * @param error - 请求错误信息，无错误时为 null
 * @param data - 请求返回的数据
 * @returns 当前展示状态字符串
 */
function resolveStatus({ loading, error, data }: StatusInput) {
  if (loading) return 'loading';
  if (error) return 'error';
  if (!data) return 'empty';
  return 'done';
}

export function useData() {
  // composable 复杂度 +0，完全委托给纯函数
  const status = computed(() => resolveStatus({ loading: loading.value, error: error.value, data: data.value }));
}
```

**适用时机：** 任何回调（事件处理、`computed`/`watch`、`Array.prototype` 方法等）或内联函数中存在 2–3 个以上分支。  
**注意：** 提取出的纯函数不应依赖外部副作用，所有依赖通过参数显式传入。

---

## 手法六：提取循环体为具名函数

嵌套循环 + 内联逻辑是认知复杂度的双重来源。将循环体提取为具名函数，每层可独立理解。

```ts
// ❌ 三层嵌套：外循环 + 内循环 + 条件
function processMatrix(matrix: number[][]) {
  for (const row of matrix) {
    for (const cell of row) {
      if (cell > 0) doSomething(cell * 2);
    }
  }
}

// ✅ 每层各司其职
/**
 * 处理矩阵中单行的有效单元格
 * @param row - 矩阵的一行
 */
function processRow(row: number[]) {
  for (const cell of row) {
    if (cell > 0) doSomething(cell * 2);
  }
}

function processMatrix(matrix: number[][]) {
  for (const row of matrix) {
    processRow(row);
  }
}
```

**适用时机：** 两层及以上循环嵌套，或循环体内有额外的条件判断。

---

## 手法七：async/await 替代 Promise 链

嵌套的 `.then()` 回调在认知上等同于嵌套 if——每个 `.then` 引入一层新的执行上下文。

```ts
// ❌ Promise 链嵌套——控制流难以追踪
function loadUserData(id: string) {
  return fetchUser(id).then((user) => {
    return fetchPermissions(user.role).then((permissions) => {
      return fetchSettings(user.id).then((settings) => ({ user, permissions, settings }));
    });
  });
}

// ✅ async/await——线性控制流
async function loadUserData(id: string) {
  const user = await fetchUser(id);
  const [permissions, settings] = await Promise.all([fetchPermissions(user.role), fetchSettings(user.id)]);
  return { user, permissions, settings };
}
```

**适用时机：** `.then()` 有嵌套，或链中需要访问上层回调的变量。

---

## 手法八：查表替代 `if` 链

用静态 Map 替换 `if/else if` 或 `switch` 链。无论 Map 有多少条目，其圈复杂度始终为零。

```ts
// ❌ 每个分支 +1——5 个处理器 = +5 复杂度
if (type === 'click') handleClick(event);
else if (type === 'keydown') handleKeydown(event);
// ...

// ✅ 查表：无论条目多少，复杂度始终 +1
const HANDLER_MAP: Record<EventType, (event: Event) => void> = {
  click: handleClick,
  keydown: handleKeydown,
  focus: handleFocus,
};

/**
 * 根据事件类型分发至对应处理函数
 * @param type - 事件类型
 * @param event - 原生事件对象
 */
function dispatch(type: EventType, event: Event) {
  HANDLER_MAP[type]?.(event);
}
```

**适用时机：** 按类型/键值分发、状态码映射标签、将动作路由到处理器。

---

## 手法九：状态机替代分散的条件

当多处代码对同一组状态标志做分支判断时，说明你在手动实现状态机。将迁移逻辑提取为声明式 Map。

```ts
type State = 'idle' | 'loading' | 'error' | 'done';
type Action = 'fetch' | 'resolve' | 'reject' | 'reset' | 'retry';

const transitions: Record<State, Partial<Record<Action, State>>> = {
  idle: { fetch: 'loading' },
  loading: { resolve: 'done', reject: 'error' },
  error: { retry: 'loading' },
  done: { reset: 'idle' },
};

/**
 * 根据当前状态和触发动作计算下一个状态
 * @param current - 当前状态
 * @param action - 触发的动作
 * @returns 下一个状态；若当前状态下该动作无效则保持不变
 */
function transition(current: State, action: Action): State {
  return transitions[current][action] ?? current;
}
```

**适用时机：** 多处条件分支读取相同状态标志、异步加载/错误/成功流程、多步骤 UI 流程。

---

## 手法十：拆分子模块，外层只做装配

→ 详见 [split-composable.md](./split-composable.md)

**适用时机：** 函数/模块处理多个不同关注点，或代码超过约 80 行。

---

## 决策速查表

| 症状                                        | 应用手法                                            |
| ------------------------------------------- | --------------------------------------------------- |
| 函数中存在嵌套 `if`                         | [手法一——卫语句](./guard-clause.md)（**优先应用**） |
| `if` 分支已 return，后面还有 `else`         | 手法二——消除 else-after-return                      |
| 布尔条件超过 2 个子条件                     | 手法三——命名复杂条件                                |
| 三元运算符有嵌套                            | 手法四——避免嵌套三元                                |
| 函数/回调内分支过多                         | 手法五——提取纯函数                                  |
| 两层及以上嵌套循环                          | 手法六——提取循环体                                  |
| `.then()` 回调有嵌套                        | 手法七——async/await                                 |
| 长串 `if/else if` 或 `switch` 按键/类型分发 | 手法八——查表                                        |
| 多处条件分支读取相同状态标志                | 手法九——状态机                                      |
| 函数/模块处理多个不同关注点                 | [手法十——拆分子模块](./split-composable.md)         |

手法编号即推荐的尝试顺序：先用编号小的手法展平和简化，再用编号大的手法做结构性重构。

---

## 重构代码的注释规范

所有重构后提取出的函数（纯函数、子模块、状态机辅助函数等）必须添加 JSDoc 格式的中文注释。

```ts
/**
 * 根据请求状态解析当前展示状态
 * @param loading - 是否正在加载
 * @param error - 请求错误信息，无错误时为 null
 * @param data - 请求返回的数据
 * @returns 当前展示状态
 */
function resolveStatus({ loading, error, data }: StatusInput): DisplayStatus {
  if (loading) return 'loading';
  if (error) return 'error';
  if (!data) return 'empty';
  return 'done';
}
```

**要求：**

- 使用 `/** */` 格式，不使用 `//` 单行注释替代
- 每个参数用 `@param` 说明；配置对象已解构时直接用字段名（`@param field`），无需加 `options.` 前缀
- 有返回值时必须加 `@returns`
- 注释内容为中文，描述"做什么"而非"怎么做"
