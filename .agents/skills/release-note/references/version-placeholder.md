# 版本占位符替换

> **关联参考：** 完整工作流见 [`SKILL.md`](../SKILL.md)；`@since NEXT` 占位策略详见 [`component-docs`](../../component-docs/SKILL.md) skill 的 [`annotations.md`](../../component-docs/references/annotations.md) 和 [`doc-pages.md`](../../component-docs/references/doc-pages.md)。

---

## 开发阶段的占位符

开发阶段新增 API 时，`@since` 和 `^[]()` 行内标签均使用 `NEXT` 占位符（详见 [`component-docs`](../../component-docs/SKILL.md) skill）。确认版本号后需批量替换为实际版本号。

---

## 替换命令

```bash
# 替换 @since NEXT → @since <new_version>（涉及 types.ts 和 .vue 文件）
grep -rl '@since NEXT' packages/opendesign/src/ | xargs sed -i 's/@since NEXT/@since <new_version>/g'

# 替换 ^[NEXT](primary) → ^[<new_version>](primary)（涉及 __docs__/ index.md 的 sidebar、Demo 标题、CSS 变量名列、注入键属性名列）
grep -rl '\^\[NEXT\](primary)' packages/opendesign/src/ | xargs sed -i 's/\^\[NEXT\](primary)/^[<new_version>](primary)/g'

# 替换完成后重新生成 API 文档
pnpm gen:api
```

---

## 替换后的验证

替换完成后，运行 `pnpm gen:api` 并检查 git diff，确认：

- 所有 `@since NEXT` 已替换为实际版本号
- 所有 `^[NEXT](primary)` 已替换为 `^[<版本号>](primary)`
- 自动生成的 `*-api.*.md` 文件已更新
