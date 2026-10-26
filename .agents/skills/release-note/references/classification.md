# 提交分区归属判断

> **关联参考：** scope 名称规范化见 [`scope-format.md`](scope-format.md)；版本占位符替换见 [`version-placeholder.md`](version-placeholder.md)；完整工作流见 [`SKILL.md`](../SKILL.md)。

---

## 第二步：逐条判断提交的分区归属

**提交消息仅供参考，不能作为分区的唯一依据。** 必须结合实际变更内容综合判断。

对每条提交，先查看具体改了哪些文件：

```bash
git show <commit_hash> --stat
```

对关键文件查看具体改动：

```bash
git show <commit_hash> -- packages/opendesign/src/<component>/
```

**判断原则（以对组件库使用者的影响为准）：**

| 实际变更内容                                                        | 归属分区                         |
| ------------------------------------------------------------------- | -------------------------------- |
| 新增组件、新增 prop/event/slot/expose                               | `### Features`                   |
| 新增对使用者可见的 CSS 变量                                         | `### Features`                   |
| 修复功能性 bug（含 SSR、类型错误等）                                | `### Bug Fixes`                  |
| 修复视觉 bug（组件显示错误、样式异常）                              | `### Bug Fixes`                  |
| 调整 CSS 变量默认值、组件视觉细节（非 bug，非新功能，但使用者可见） | `### Style`                      |
| 删除/重命名 prop、修改 DOM 结构、CSS 变量重命名                     | `### BREAKING CHANGES`           |
| 内部重构（使用者不可见、不影响 API）                                | `### Code Refactoring`           |
| 引入新 `peerDependency`                                             | `### BREAKING CHANGES`           |
| 引入新运行时 `dependency`（支撑某功能）                             | 附注在对应功能条目，不单独开条目 |
| 引入新运行时 `dependency`（无对应功能）                             | `### Chore`                      |
| 升级已有依赖、构建脚本、CI 配置                                     | `### Chore`                      |
| 仅更新文档、测试文件                                                | **跳过，不写入 release note**    |

**第三方依赖附注写法：** 运行时依赖随所支撑的功能条目一并说明，不单独列条目：

```markdown
- **ODatePicker:** 新增日期时间系列选择器（运行时依赖 `dayjs`）
```

**模糊情况：** 若变更内容仍难以判断归属（如：既像功能调整又像 bug 修复），**主动询问用户**，说明具体变更，请用户定夺。

---

## 第三步：`### Style` 分区的使用边界

`### Style` 分区专指：**不改变组件功能逻辑，但使用者可以观察到的视觉/样式调整**。

常见例子：

- 调整 CSS 变量的默认值（如修改 `--switch-text-size` 的值）
- 修改组件某个状态下的颜色、字号、间距，但属于视觉优化而非 bug
- 修改某个 prop 的默认表现（如字体加粗、hover 色等），没有改 API

**以下情况不归 `### Style`：**

| 情况                                 | 正确归属                          |
| ------------------------------------ | --------------------------------- |
| 视觉变更修复了已知 bug               | `### Bug Fixes`                   |
| 新增 CSS 变量供用户使用              | `### Features`                    |
| 纯代码格式化/linting，不影响构建产物 | **跳过**                          |
| 组件内部实现调整，使用者无法感知     | `### Code Refactoring` 或**跳过** |
