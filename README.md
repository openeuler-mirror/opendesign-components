# opendesign-components

基于 Vue 3 的企业级组件库，包含组件包、构建 CLI 和文档站。

## 快速上手

```bash
# 克隆仓库
git clone https://atomgit.com/openeuler/opendesign-components.git
cd opendesign-components

# 安装依赖 + 编译组件 + 生成 API 文档（一键初始化）
pnpm docs:install

# 启动文档站开发服务器
pnpm docs:dev
```

浏览器访问 http://localhost:3300

## 项目架构

基于 pnpm workspace 的 monorepo：

| 包                      | 路径                  | 说明                |
| ----------------------- | --------------------- | ------------------- |
| `@opensig/opendesign`   | `packages/opendesign` | 发布的 Vue 3 组件库 |
| `@opensig/open-scripts` | `packages/scripts`    | 组件库专用构建 CLI  |
| docs                    | `packages/docs`       | 文档站 + 组件测试   |

## 变更日志

- [opendesign 变更日志](./packages/docs/ReleaseNote.opendesign.md)
- [open-scripts 变更日志](./packages/docs/ReleaseNote.scripts.md)

## 参与贡献

1. Fork 本仓库
2. 基于 release/xxx 分支，新建 feat/xxx 分支
3. 提交代码到 fork 仓
4. 新建 PR 合入到主仓 release/xxx 分支
