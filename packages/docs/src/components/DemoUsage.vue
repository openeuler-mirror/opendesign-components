<script setup lang="ts">
/* global __DEV__ */
import { h, reactive, ref, watchEffect, watch, shallowRef, type Component, isReactive, isRef, defineComponent } from 'vue';
import { LINENUMBER_TAG_ATTR, LINENUMBER_CSS_ATTR } from '../../plugins/markdown/lineNumber';
import CodeContainer from './CodeContainer.vue';
import { compileComponent, highlight, prettier } from '@/utils/code';
import DemoContainer, { type DemoComponent } from './DemoContainer.vue';
import OperatorView, {
  type SchemeT,
  type CheckboxScheme,
  type SelectorScheme,
  type InputNumberScheme,
  type TextareaScheme,
  type InputScheme,
  type RadioScheme,
} from './OperatorView';

type ThemeKey = 'e' | 'a' | 'k' | 'd';
const props = defineProps<{
  /** markdown文档 */
  docs?: Record<string, Component>;
  /** 表单控件配置数据 */
  schema: Record<string, SchemeT>;
  /** vue 模板 */
  template: string | ((_props: Record<string, any>) => string);
  /** 样式表字符串 */
  style?: string;
  /** 传给 template 的上下文，在模板中使用 */
  ctx?: any;
  activeThemes?: ThemeKey[];
}>();
const clampNumber = (num: number, boundary?: { min?: number; max?: number }) => {
  const min = boundary?.min ?? -Infinity;
  const max = boundary?.max ?? Infinity;
  return Math.min(Math.max(Number.isFinite(num) ? num : 0, min), max);
};

interface InitialValuesContext {
  /** 状态对象 */
  state: Record<string, any>;
  /** 复选框组值数组 */
  checkboxGroupValue: (string | number)[];
  /** 用户传入的默认值覆盖 */
  defaults?: Record<string, any>;
}

interface ResolveDefaultContext {
  /** 字段名 */
  key: string;
  /** schema 默认值 */
  schemaDefault: any;
  /** 用户传入的默认值覆盖 */
  defaults?: Record<string, any>;
  /** 类型校验函数 */
  typeCheck?: (v: any) => boolean;
}

/**
 * 根据字段名和默认值配置计算初始值，优先使用用户传入的 defaults
 * @param key - 字段名
 * @param schemaDefault - schema 默认值
 * @param defaults - 用户传入的默认值覆盖
 * @param typeCheck - 类型校验函数
 * @returns 计算后的初始值
 */
function resolveDefaultValue({ key, schemaDefault, defaults, typeCheck }: ResolveDefaultContext): any {
  if (defaults && Object.prototype.hasOwnProperty.call(defaults, key) && typeCheck?.(defaults[key])) {
    return defaults[key];
  }
  return schemaDefault;
}

/**
 * 处理布尔类型字段的初始值
 * @param key - 字段名
 * @param scheme - 布尔类型配置
 * @param ctx - 初始值上下文
 */
function processBooleanItem(key: string, scheme: CheckboxScheme, ctx: InitialValuesContext): void {
  const defaultValue = resolveDefaultValue({ key, schemaDefault: scheme.default ?? false, defaults: ctx.defaults, typeCheck: (v) => typeof v === 'boolean' });
  ctx.state[key] = Boolean(defaultValue);
  if (ctx.state[key]) {
    ctx.checkboxGroupValue.push(key);
  }
}

/**
 * 处理选择器/单选类型字段的初始值
 * @param key - 字段名
 * @param scheme - 选择器或单选配置
 * @param ctx - 初始值上下文
 */
function processSelectorItem(key: string, scheme: SelectorScheme | RadioScheme, ctx: InitialValuesContext): void {
  const defaultValue = resolveDefaultValue({
    key,
    schemaDefault: scheme.default ?? scheme.list[0],
    defaults: ctx.defaults,
    typeCheck: (v) => scheme.list.includes(v),
  });
  ctx.state[key] = defaultValue;
}

/**
 * 处理字符串/文本域类型字段的初始值
 * @param key - 字段名
 * @param scheme - 字符串或文本域配置
 * @param ctx - 初始值上下文
 */
function processStringItem(key: string, scheme: InputScheme | TextareaScheme, ctx: InitialValuesContext): void {
  const defaultValue = resolveDefaultValue({ key, schemaDefault: scheme.default ?? '', defaults: ctx.defaults, typeCheck: (v) => typeof v === 'string' });
  ctx.state[key] = defaultValue;
}

/**
 * 处理数字类型字段的初始值
 * @param key - 字段名
 * @param scheme - 数字类型配置
 * @param ctx - 初始值上下文
 */
function processNumberItem(key: string, scheme: InputNumberScheme, ctx: InitialValuesContext): void {
  const defaultValue = resolveDefaultValue({ key, schemaDefault: scheme.default ?? 0, defaults: ctx.defaults, typeCheck: (v) => Number.isFinite(v) });
  ctx.state[key] = clampNumber(defaultValue, scheme);
}

const INITIAL_VALUE_PROCESSOR_MAP: Record<SchemeT['type'], (key: string, scheme: any, ctx: InitialValuesContext) => void> = {
  boolean: processBooleanItem,
  radio: processSelectorItem,
  list: processSelectorItem,
  string: processStringItem,
  textarea: processStringItem,
  number: processNumberItem,
};

/**
 * 通过表单控制数据，生成表单控件响应式变量的默认值
 * @param schema - 表单控件配置数据
 * @param defaults - 表单控件默认值
 */
function getInitialValues(schema: Record<string, SchemeT>, defaults?: Record<string, any>) {
  const ctx: InitialValuesContext = { state: {}, checkboxGroupValue: [], defaults };
  Object.entries(schema).forEach(([key, value]) => {
    INITIAL_VALUE_PROCESSOR_MAP[value.type]?.(key, value, ctx);
  });
  return { state: ctx.state, checkboxGroupValue: ctx.checkboxGroupValue };
}
const initialValues = getInitialValues(props.schema);
const state = reactive(initialValues.state);
const checkboxGroupValue = ref(initialValues.checkboxGroupValue);
watch(state, (newVal) => {
  const newCheckboxGroupValue: Array<string | number> = [];
  Object.entries(newVal).forEach(([key, value]) => {
    if (props.schema[key].type === 'boolean' && value === true) {
      newCheckboxGroupValue.push(key);
    }
  });
  checkboxGroupValue.value = newCheckboxGroupValue;
});
if (isRef(props.schema) || isReactive(props.schema)) {
  // 当props.schema 发生变化时，重新初始化 state 和 checkboxGroupValue
  watch(props.schema, (newVal) => {
    const newInitialValues = getInitialValues(newVal, state);
    Object.assign(state, newInitialValues.state);
    checkboxGroupValue.value = newInitialValues.checkboxGroupValue;
  });
}

const highlightedCode = ref('');
const sourceCode = ref('');
const showcaseComponent = shallowRef<Component>(() => {});

/**
 * 构建 SFC 代码字符串，自动补充 template 和 style 标签
 * @param template - 模板字符串
 * @param style - 样式字符串
 * @returns 完整的 SFC 代码
 */
function buildSfcCode(template: string, style: string): string {
  let sfcCode = template.trimStart().startsWith('<template') ? template : `<template>${template}</template>`;
  if (style) {
    sfcCode += `\n${style.trimStart().startsWith('<style') ? style : `<style lang="scss">${style}</style>`}`;
  }
  return sfcCode;
}

/**
 * 创建 prettier 错误处理函数，开发环境下打印错误并返回备用代码
 * @param fallbackCode - 错误时返回的备用代码
 * @returns 错误处理回调
 */
const createErrorHandler = (fallbackCode: string) => (err: any) => {
  if (__DEV__) {
    console.error(err);
  }
  return fallbackCode;
};

/**
 * 通过 props.template 动态编译vue组件，同时格式化并高亮源码
 * 动态编译的组件保存在 showcaseComponent 中，格式化的源码保存在 sourceCode 中，高亮的源码保存在 highlightedCode 中
 * @param demoProps - 演示组件的属性
 * @param style - 样式字符串
 */
function createShowcaseComponent(demoProps: Record<string, any>, style: string = '') {
  const template = typeof props.template === 'function' ? props.template(demoProps) : props.template;
  const sfcCode = buildSfcCode(template, style);
  prettier(sfcCode, 'vue')
    .catch(createErrorHandler(sfcCode))
    .then((code) => {
      sourceCode.value = code;
      return highlight(code, 'vue');
    })
    .then((code) => {
      highlightedCode.value = code;
    });
  return compileComponent(template, props.ctx);
}
/**
 * 声明式组件，渲染 showcaseComponent 演示组件及 OperatorView 表单控件
 * 使用 defineComponent 确保拥有独立 render effect，当 showcaseComponent 异步更新时能自主重渲染
 */
const Demo = defineComponent({
  setup() {
    return () =>
      h('div', { class: 'props-playground-demo' }, [
        h('div', { class: 'props-playground-content' }, [h(showcaseComponent.value)]),
        h('div', { class: 'props-playground-operator' }, [
          h(OperatorView, { schema: props.schema, state: state, checkboxGroupValue: checkboxGroupValue.value }),
        ]),
      ]);
  },
}) as DemoComponent;
// 将DemoSource组件保存到Demo中，会被 DemoContainer 渲染为源码
Demo.DemoSource = () => {
  if (sourceCode.value) {
    return h(
      CodeContainer,
      { lang: 'vue', contentEncoded: encodeURIComponent(sourceCode.value), lineNumbers: true },
      {
        default: () =>
          h('pre', { [LINENUMBER_TAG_ATTR]: '1' }, [
            h('code', { class: 'language-vue', style: `${LINENUMBER_CSS_ATTR}: 1;`, innerHTML: highlightedCode.value }),
          ]),
      },
    );
  }
};

watchEffect(() => {
  createShowcaseComponent(state, props.style).then((component) => (showcaseComponent.value = component));
  Demo.__docs = props.docs;
});
</script>
<template>
  <DemoContainer :demo="Demo" :active-themes="props.activeThemes" class="props-playground" />
</template>
<style lang="scss" scoped>
.props-playground {
  :deep(.demo) {
    padding: 0;
  }
}
:deep(.props-playground-demo) {
  display: flex;
  @include respond-to('<=pad') {
    flex-direction: column;
  }
}
:deep(.props-playground-content) {
  padding: var(--o3-gap-4);
  flex: 1;
}
:deep(.props-playground-operator) {
  padding: var(--o3-gap-4);
  border-left: 1px solid var(--o-color-control1-light);
  max-width: 40%;
  @include respond-to('<=pad') {
    max-width: none;
    border-top: 1px solid var(--o-color-control1-light);
    border-left: none;
  }
}
:deep(.checkbox-group),
:deep(.radio-group) {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: var(--o3-gap-3);
  column-gap: var(--o3-gap-6);
  row-gap: var(--o3-gap-2);

  .o-checkbox {
    margin-left: 0;
  }
}
:deep(.operator-group) {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: var(--o3-gap-3);
}
:deep(.props-playground-selector-name) {
  display: flex;
  align-items: center;
}
:deep(.props-playground-operator) {
  .o-input-number {
    width: 100%;
  }
}
:deep(.props-playground-textarea) {
  height: calc(var(--row) * var(--_box-text-height));
}
</style>
