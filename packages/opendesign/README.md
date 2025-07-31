<p align="center"><img src="../docs/public/opendesign-logo-light.png"/></p>
<h1 align="center">opendesign</h1>
<p align="center">一个 Vue 3 组件库</p>
<p align="center"><b>皮肤可定制，使用 TypeScript</b></p>


## 特性


### 皮肤可定制

提供组件变量体系，可以快速定义一套新皮肤

### 使用 TypeScript

opendesign 全量使用 TypeScript 编写，和你的 TypeScript 项目无缝衔接。


## 安装

### npm

使用 npm/pnpm 安装。

```bash
# npm
npm i @opensig/opendesign

#pnpm 
pnpm add @opensig/opendesign

```


## 使用

### 引入样式文件
```
import '@opensig/opendesign/es/index.scss'
```

### 使用组件
```
<script setup lang="ts">
import { OButton } from '../../locale';

</script>
<template>
    <OButton variant="outline">Outline Button</OButton>
</template>
```


## 许可

opendesign 使用 [MIT license](https://opensource.org/licenses/MIT) 许可证书。