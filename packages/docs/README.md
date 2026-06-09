# opendesign 组件文档

## 快速开始

### 安装依赖

```bash
pnpm docs:install
```

> 会自动完成以下操作：
>
> 1. 安装项目依赖
> 2. 编译 opendesign 组件
> 3. 生成 API 文档

### 运行开发服务

```bash
pnpm docs:dev
```

浏览器访问：http://localhost:3300

### 构建生产环境

```bash
pnpm docs:build
```

### 重新生成 API 文档

```bash
pnpm docs:gen:api
```

> 修改组件 props/slots/expose/emits 后需重新运行。支持 `@since`、`@deprecated`、`@experimental` JSDoc 注解标签。

## 英文翻译

1. **Fork 仓库** 到个人账号
2. **创建特性分支** `git checkout -b feat/translate`
3. **新增语言文件**
   ```bash
   # 按以下结构创建文件
   /packages/opendesign/src/*/__docs__/index.en-US.md  # 语言主文档
   /packages/opendesign/src/*/__docs__/*-api.en-US.md  # API 文档
   ```
4. **demo 组件英文翻译** 在 `/packages/opendesign/src/*/__docs__/__case__/*.vue` 文件中的 `<docs lang="md">` 标签中添加 en-US 语言配置

   ```html
   <docs lang="md">
     <!-- zh-CN -->

     ### 中文标题 中文内容

     <!-- en-US -->

     ### English Title English content here
   </docs>
   ```

   > 语言标记必须精确使用 `<!-- zh-CN -->` 和 `<!-- en-US -->`，中英文标题级别必须一致（通常用 `###`）。详细规范见 `component-docs` skill 的 [`cases.md`](../../skills/component-docs/references/cases.md)。

5. 提交 PR 并等待审核
6. 维护人员审核通过后合并

## 行内注解标签语法

文档 Markdown 中支持 `^[内容](颜色)`tooltip``行内注解语法，渲染为`OTag`或`OPopover`+`OTag`：

```md
^[NEXT](primary) → 行内 OTag 标签（无气泡）
^[deprecated](danger)`1.3.0` → OTag + OPopover 气泡（hover 显示 "1.3.0"）
```

颜色类型：`normal | primary | success | warning | danger`（默认 `normal`）

该语法可在以下场景使用：

- Markdown 文档内容（由 `popover.ts` 插件渲染为 HTML）
- API 表格名称列（由 `generateApi.ts` 根据 JSDoc `@since`/`@deprecated`/`@experimental` 标签自动生成）
- 侧边栏菜单、锚点导航（由 `inlineTag.ts` 运行时渲染为 VNode）

## 注意事项

- 当前支持语言：`zh-CN`(简体中文) 和 `en-US`(英语)
- 扩展语言需遵循命名规范：`<lang>-<COUNTRY>.md`（如 `es-US`）
- 保持原始文件结构，确保国际化文件位置正确
- 修改内容时请勿删除原有语言版本
