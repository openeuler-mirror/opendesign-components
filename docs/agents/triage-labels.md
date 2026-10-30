# Triage 标签

各 skill 以五个规范化 triage 角色沟通。本文件把这些角色映射到本仓库实际使用的表达方式。

本仓库在 up（AtomGit 平台）上**没有创建 label 的权限**，在本地 tracker 中使用文件行状态；两处词汇表一致：

- **up 上的 issue**（含 spec issue）：以正文中的 `Status:` 行表达（无 label 权限，不建平台 label）；
- **本地 `.scratch/` ticket**：同样以文件顶部的 `Status:` 行表达。本地 ticket 另有两个执行态取值：`claimed` / `resolved`（见 `issue-tracker.md` 的 Wayfinder 操作）。

| mattpocock/skills 中的角色 | 本仓库的 Status 值 | 含义                            |
| -------------------------- | ------------------ | ------------------------------- |
| `needs-triage`             | `needs-triage`     | 维护者需要评估该 issue          |
| `needs-info`               | `needs-info`       | 等待报告者补充信息              |
| `ready-for-agent`          | `ready-for-agent`  | 规格完备，可交给 AFK agent 执行 |
| `ready-for-human`          | `ready-for-human`  | 需要人来实现                    |
| `wontfix`                  | `wontfix`          | 不会处理                        |

当 skill 提到某个角色（例如「打上 AFK-ready 的 triage 标签」）时，使用上表对应的 Status 字符串；在 up issue 上即写入正文 `Status:` 行，在本地 ticket 上即写入文件 `Status:` 行。

若未来获得 up 的 label 权限或切换 tracker，编辑本文件同步词汇表即可。
