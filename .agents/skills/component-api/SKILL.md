---
name: component-api
description: 组件公共 API 的暴露与契约规则。当给组件新增 props / emits / slots / expose、决定 DOM 原生属性(id / aria-* / title / name…)该声明成 prop 还是靠 attrs 透传、评审 API 声明是否冗余或契约不明、或判断某项变更(props 默认值、emits 参数、css class 钩子、派生 id)是否算 breaking 时应用。
metadata:
  version: '1.0.0'
---

# 组件公共 API 的暴露与契约

组件的公共面 = attrs 透传 + props + emits + slots + expose + css class 钩子。每一面都是两件事:**暴露**(给不给用户、以什么形态给)与**契约**(给了之后,哪些变化算 breaking,必须走版本协商)。本 skill 按面收纳规则,一题一文件:

| 你在处理什么                                                      | 看哪                                                                 |
| ----------------------------------------------------------------- | -------------------------------------------------------------------- |
| DOM 原生属性该声明成 prop 还是靠透传(id/aria-\*/title/name/type…) | [`references/attrs-passthrough.md`](references/attrs-passthrough.md) |
| (预留)props 默认值与类型变更的契约                                | references/props-changes.md(未建)                                    |
| (预留)emits 事件契约(参数形状、改名)                              | references/emits-contract.md(未建)                                   |
| (预留)slots 内容契约(具名增删、作用域参数)                        | references/slots-contract.md(未建)                                   |
| (预留)expose 方法契约(方法增删、签名)                             | references/expose-contract.md(未建)                                  |
| (预留)css class 钩子稳定性(结构类名、修饰类名)                    | references/css-hooks.md(未建)                                        |

> 领域级 break 判据(各规则共享):**用户代码里可能写到的才算契约**——props/emits/slots/expose 的公开签名、写进 API 文档表的东西、用户自己传的标识符(源头 id)。判据是**消费者身份**:开发者会在业务代码里写的,动它 = breaking,走版本协商;消费者只是内部实现或 agent 的(如组件派生的 id 后缀),写进文档也不算契约,改名只影响 DOM 可读性,可自由改。
