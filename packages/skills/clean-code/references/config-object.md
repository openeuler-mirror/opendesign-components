---
name: config-object
description: 将超过 3 个的函数参数合并为配置对象，解决 max-params 超限问题
metadata:
  version: '1.0.0'
---

# 配置对象参数

## 触发场景

ESLint 报告 `max-params` 超限（阈值 3），函数参数超过 3 个。

## 核心思路

用具名配置对象替代位置参数列表。具名参数顺序无关、易扩展、调用处自文档化。

## 重构示例

```ts
// ❌ 3 个位置参数——调用时顺序易混淆
function formatDate(date: Date, locale: string, timezone: string) {
  // ...
}
formatDate(new Date(), 'zh-CN', 'Asia/Shanghai'); // timezone 和 locale 顺序靠记忆

// ✅ 配置对象——具名、顺序无关
interface FormatDateOptions {
  /** 待格式化的日期 */
  date: Date;
  /** 目标语言区域，如 'zh-CN' */
  locale: string;
  /** 目标时区，如 'Asia/Shanghai' */
  timezone: string;
}

/**
 * 将日期格式化为本地化字符串
 * @param date - 待格式化的日期
 * @param locale - 目标语言区域
 * @param timezone - 目标时区
 * @returns 格式化后的日期字符串
 */
function formatDate({ date, locale, timezone }: FormatDateOptions) {
  // ...
}
formatDate({ date: new Date(), locale: 'zh-CN', timezone: 'Asia/Shanghai' });
```

## 子 composable 传参同理

```ts
// ❌ 3 个 composable 依赖通过位置传入
function useFormSubmit(state, validation, options) {
  /* ... */
}

// ✅ 配置对象
interface SubmitDeps {
  /** useFormState 的返回值 */
  state: ReturnType<typeof useFormState>;
  /** useFormValidation 的返回值 */
  validation: ReturnType<typeof useFormValidation>;
  /** 表单配置项 */
  options: FormOptions;
}
function useFormSubmit({ state, validation, options }: SubmitDeps) {
  /* ... */
}
```

## 规则

| 参数数量 | 写法                         |
| -------- | ---------------------------- |
| ≤ 3 个   | 位置参数，保持简洁           |
| ≥ 4 个   | 配置对象，必须定义 interface |

## 函数参数注释规范

配置对象在函数签名中通常被**直接解构**，此时 `@param` 应使用解构后的字段名，而非 `options.field`——因为 `options` 并不存在于函数参数列表中。

```ts
// ❌ options 并不是实际参数名，IDE 无法关联
/**
 * @param options.date - 待格式化的日期
 * @param options.locale - 目标语言区域
 */
function formatDate({ date, locale }: FormatDateOptions) {}

// ✅ 直接用解构后的字段名
/**
 * @param date - 待格式化的日期
 * @param locale - 目标语言区域
 */
function formatDate({ date, locale }: FormatDateOptions) {}
```

## Interface 字段注释规范

定义配置对象的 interface 时，**每个字段必须用 `/** \*/` 单行注释说明含义\*\*，使 IDE hover 时能显示提示。

```ts
// ❌ 字段无注释——调用方不知道含义
interface FormatDateOptions {
  date: Date;
  locale: string;
  timezone: string;
}

// ✅ 每个字段有注释——IDE 可直接提示
interface FormatDateOptions {
  /** 待格式化的日期 */
  date: Date;
  /** 目标语言区域，如 'zh-CN' */
  locale: string;
  /** 目标时区，如 'Asia/Shanghai' */
  timezone: string;
}
```

> 完整工作流见 [clean-code/SKILL.md](../SKILL.md)
