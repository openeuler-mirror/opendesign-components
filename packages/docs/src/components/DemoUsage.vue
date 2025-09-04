<script setup lang="ts">
import { h, reactive, ref, watchEffect, watch, shallowRef, type Component } from 'vue';
import { LINENUMBER_TAG_ATTR, LINENUMBER_CSS_ATTR } from '../../plugins/markdown/lineNumber';
import CodeContainer from './CodeContainer.vue';
import { compileComponent, highlight, prettier } from '@/utils/code';
import DemoContainer, { type DemoComponent } from './DemoContainer.vue';
import OperatorView, { type SchemeT } from './OperatorView';

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
/**
 * 通过表单控制数据，生成表单控件响应式变量的默认值
 * @param schema 表单控件配置数据
 */
function getInitialValues(schema: Record<string, SchemeT>) {
  const _checkboxGroupValue: (string | number)[] = [];
  const _state: Record<string, any> = {};
  Object.entries(schema).forEach(([key, value]) => {
    switch (value.type) {
      case 'boolean':
        _state[key] = Boolean(value.default);
        if (_state[key]) {
          _checkboxGroupValue.push(key);
        }
        break;
      case 'radio':
      case 'list':
        _state[key] = value.default ?? value.list[0];
        break;
      case 'textarea':
      case 'string':
        _state[key] = value.default ?? '';
        break;
      case 'number':
        _state[key] = value.default ?? 0;
        break;
    }
  });
  return {
    state: _state,
    checkboxGroupValue: _checkboxGroupValue,
  };
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

const highlightedCode = ref('');
const sourceCode = ref('');
const showcaseComponent = shallowRef<Component>(() => {});

/**
 * 通过 props.template 动态编译vue组件，同时格式化并高亮源码
 * 动态编译的组件保存在 showcaseComponent 中，格式化的源码保存在 sourceCode 中，高亮的源码保存在 highlightedCode 中
 * @param demoProps 演示组件的属性
 */
function createShowcaseComponent(demoProps: Record<string, any>, style: string = '') {
  const template = typeof props.template === 'function' ? props.template(demoProps) : props.template;
  let sfcCode = template.trimStart().startsWith('<template') ? template : `<template>${template}</template>`;
  if (style) {
    sfcCode = `${sfcCode}\n${style.trimStart().startsWith('<style') ? style : `<style lang="scss">${style}</style>`}`;
  }
  prettier(sfcCode, 'vue')
    .catch((err) => {
      if (process.env.NODE_ENV === 'development') {
        console.error(err);
      }
      return sfcCode;
    })
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
 * 函数式组件，用来渲染 showcaseComponent 的演示组件，以及OperatorView表单控件
 */
const Demo: DemoComponent = () =>
  h('div', { class: 'props-playground-demo' }, [
    h('div', { class: 'props-playground-content' }, [h(showcaseComponent.value)]),
    h('div', { class: 'props-playground-operator' }, [h(OperatorView, { schema: props.schema, state: state, checkboxGroupValue: checkboxGroupValue.value })]),
  ]);
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
:deep(.o-input-number) {
  width: 100%;
}

:deep(.props-playground-textarea) {
  height: calc(var(--row) * var(--_box-text-height));
}
</style>
