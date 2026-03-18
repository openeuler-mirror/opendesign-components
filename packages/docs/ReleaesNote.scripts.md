# [open-scripts]

## 1.0.5

### Features

- **build:component:** 增加打包排除`vueuse`与`dayjs`包
- **config:** 脚本配置文件使用`jiti`增加esm的格式的支持

### Other

- 移除`fs-extra`的调用，使用`node:fs`替代相应功能
- 项目改由`vite`打包

## 1.0.4

- fix
- 修复gen-token生成的默认皮肤，类名不正确问题（正确为:root）

## 1.0.3

- fix

1. 新增defaultThemeName配置项，支持配置default主题文件前缀名

## 1.0.2

- fix

1. `gen-token`命令生成的default变量，提取到单独文件，方便不需要深浅切换的系统调用

## 1.0.0

- fix

1. 统一gen-icon在不同系统下生成path的分隔符风格

## 0.0.23

- fix

1. 更新 vite 版本 6.1->6.2

## 0.0.22

- fix

1. 修复 svg xlink:href=“#{id}”构件时未生成动态 id

## 0.0.21

- fix

1. 更新 sass 编译库，使用 sass-embedded 替换 sass；
2. 修复 svg href=“#{id}”构件时未生成动态 id

## 0.0.20 2024-10-10

- fix

1. 修复图标路径兼容性、文件名转变量名兼容性、不同实例同 id 的相互影响

## 0.0.19 2024-08-12

- fix

1. 修复 svg 文件名因空格、目录嵌套导致生成的 svg 组件被重名替换问题。

## 0.0.18

1. 解决图标服务端渲染，无法绑定事件问题；
2. svgo 配置增加默认 prefixIds，用于解决老版本对 svg 图标 id 不能正常使用问题
