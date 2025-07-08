# opendesign 组件文档

## 快速开始

### 📦 安装依赖
```bash
pnpm docs:install
```
> 会自动完成以下操作：
> 1. 安装项目依赖
> 2. 编译 opendesign 组件
> 3. 生成 API 文档

### 🚀 运行开发服务
```bash
pnpm docs:dev
```
浏览器访问：http://localhost:3300

### 🛠️ 构建生产环境
```bash
pnpm docs:build
```

## 🌍 英文翻译

1. **Fork 仓库** 到个人账号
2. **创建特性分支** `git checkout -b feat/translate`
3. **新增语言文件**
   ```bash
   # 按以下结构创建文件
   /packages/opendesign/src/*/__docs__/index.en-US.md  # 语言主文档
   /packages/opendesign/src/*/__docs__/*-api.en-US.md  # API 文档
   ```
4. **demo组件英文翻译** 在 `/packages/opendesign/src/*/__docs__/__case__/*.vue` 文件中的`<docs lang="md">` 标签中添加en-US语言配置

    ```html
    <docs lang="md">
    <!-- zh-CN -->

    ### 中文标题

    中文内容

    <!-- en-US -->

    ### English Title

    English content here
    </docs>
    ```
5. 提交 PR 并等待审核
6. 维护人员审核通过后合并

## ⚠️ 注意事项
- 当前支持语言：`zh-CN`(简体中文) 和 `en-US`(英语)
- 扩展语言需遵循命名规范：`<lang>-<COUNTRY>.md`（如 `es-US`）
- 保持原始文件结构，确保国际化文件位置正确
- 修改内容时请勿删除原有语言版本
