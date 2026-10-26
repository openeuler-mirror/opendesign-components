# Scope 名称规范化

> **关联参考：** 提交分区归属判断见 [`classification.md`](classification.md)；版本占位符替换见 [`version-placeholder.md`](version-placeholder.md)；完整工作流见 [`SKILL.md`](../SKILL.md)。

---

## 第四步：scope → 条目名称规范化

所有条目名称统一使用 `**name:**` 加粗格式，包括组件、hooks、工具方法。

| commit scope         | Release Note 中的名称                                     |
| -------------------- | --------------------------------------------------------- |
| `OInput`             | `**OInput:**`（保持原样）                                 |
| `OInput/OTextarea`   | `**OInput/OTextarea:**`（保持原样）                       |
| `cascader`           | `**OCascader:**`（加 `O` 前缀 + 首字母大写）              |
| `tab`                | `**OTab:**`                                               |
| `hooks`（泛指多个）  | `**hooks:**`                                              |
| `utils`（泛指多个）  | `**utils:**`                                              |
| `useScreen`          | `**useScreen:**`（具名 hook，直接使用）                   |
| `use-scrollbar`      | `**useScrollbar:**`（默认导出，文件名转化为小驼峰后使用） |
| 无 scope（全局变更） | 直接写描述，不加粗名称                                    |

**规则：**

- scope 若已含 `O` 前缀（组件），直接使用
- scope 是组件目录名但没有 `O` 前缀，检查 `packages/opendesign/src/` 下是否有同名子目录，有则加 `O` + 首字母大写
- scope 是具名 hook 或公共工具方法（`useXxx`、`use-xxx`），**直接使用原名加粗**，不加 `O` 前缀，若是默认导出，文件名转化为小驼峰后使用
- scope 泛指多个 hooks 时用 `**hooks:**`，并在下方嵌套列出各具名方法：

```markdown
- **hooks:**
  - 新增 `useElementOverflown`：自动监听元素文本溢出状态
  - 新增 `useResponseCssVar`：响应式获取 CSS 变量值
```
