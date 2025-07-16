<script setup lang="ts">
import * as Vue from 'vue';
import { OSelect, OOption, OCheckbox, OCheckboxGroup } from '@opensig/opendesign';
import * as prettier from 'prettier';
import htmlPlugin from 'prettier/plugins/html';
import babelPlugin from 'prettier/plugins/babel';
import postPlugin from 'prettier/plugins/postcss';
import tsPlugin from 'prettier/plugins/typescript';
import esTreePlugin from 'prettier/plugins/estree';
import { highlight, md } from '../../plugins/markdown/common';
import { LINENUMBER_TAG_ATTR, LINENUMBER_CSS_ATTR } from '../../plugins/markdown/lineNumber';
import CodeContainer from './CodeContainer.vue';
import { compile } from '@vue/compiler-dom';
export type SchemeT =
  | {
      type: 'boolean';
      default?: boolean;
    }
  | {
      type: 'list';
      list: Array<string | number>;
      default?: string | number;
    };
const props = defineProps<{
  /** markdown文档 */
  docs?: Record<string, string>;
  /** 表单控件配置数据 */
  schema: Record<string, SchemeT>;
  /** vue 模板 */
  template: string | ((_props: Record<string, any>) => string);
}>();
const { reactive, h, Fragment, ref, watchEffect, shallowRef } = Vue;
/**
 * 通过表单控制数据，生成表单控件响应式变量的默认值
 * @param schema 表单控件配置数据
 */
function getInitialValues(schema: Record<string, SchemeT>) {
  const checkboxGroupDefaultValue: string[] = [];
  const state: Record<string, any> = {};
  Object.entries(schema).forEach(([key, value]) => {
    switch (value.type) {
      case 'boolean':
        state[key] = Boolean(value.default);
        if (state[key]) {
          checkboxGroupDefaultValue.push(key);
        }
        break;
      case 'list':
        state[key] = value.default ?? value.list[0];
        break;
    }
  });
  return {
    state,
    checkboxGroupDefaultValue,
  };
}
const initialValues = getInitialValues(props.schema);
const state = reactive(initialValues.state);

/**
 * OperatorView 函数式组件，用来渲染表单控件
 * @param param0 表单控件配置数据
 */
function OperatorView({ schema }: { schema: Record<string, SchemeT> }) {
  /** 复选框控件 */
  const checkboxGroup: Vue.VNode[] = [];
  /** 选着框控件 */
  const selectionGroup: Vue.VNode[] = [];
  const operatorGroup: Vue.VNode[] = [];
  Object.entries(schema).forEach(([key, value]) => {
    switch (value.type) {
      case 'boolean':
        checkboxGroup.push(h(OCheckbox, { value: key }, { default: () => key }));
        break;
      case 'list':
        selectionGroup.push(
          h(Fragment, [
            h('span', { class: 'props-playground-selector-name' }, key),
            h(
              OSelect,
              { modelValue: state[key], 'onUpdate:modelValue': (val) => (state[key] = val) },
              {
                default: () => value.list.map((item) => h(OOption, { value: item, label: item.toString() })),
              },
            ),
          ]),
        );
    }
  });
  if (checkboxGroup.length) {
    operatorGroup.push(
      h(
        OCheckboxGroup,
        {
          class: 'checkbox-group',
          defaultValue: initialValues.checkboxGroupDefaultValue,
          onChange: (val) => {
            Object.entries(schema).forEach(([key, value]) => {
              if (value.type === 'boolean') {
                state[key] = false;
              }
            });
            val.forEach((name) => {
              state[name] = true;
            });
          },
        },
        {
          default: () => checkboxGroup,
        },
      ),
    );
  }
  if (selectionGroup.length) {
    operatorGroup.push(h('div', { class: 'operator-group' }, selectionGroup));
  }
  return h(Fragment, operatorGroup);
}
const highlightedCode = ref('');
const sourceCode = ref('');
const showcaseComponent = shallowRef<Vue.Component>(() => {});

/**
 * 通过 props.template 动态编译vue组件，同时格式化并高亮源码
 * 动态编译的组件保存在 showcaseComponent 中，格式化的源码保存在 sourceCode 中，高亮的源码保存在 highlightedCode 中
 * @param demoProps 演示组件的属性
 */
function createShowcaseComponent(demoProps: Record<string, any>) {
  const template = typeof props.template === 'function' ? props.template(demoProps) : props.template;
  const wrapTemplateTag = template.trimStart().startsWith('<template>') ? template : `<template>${template}</template>`;
  prettier
    .format(wrapTemplateTag, {
      parser: 'vue',
      plugins: [htmlPlugin, esTreePlugin, babelPlugin, postPlugin, tsPlugin],
      singleQuote: true,
      printWidth: 120,
    })
    .then((code) => {
      sourceCode.value = code;
      highlightedCode.value = highlight(code, 'vue');
    });
  const showcaseCode = compile(template, { mode: 'function' });
  return new Function('Vue', showcaseCode.code)(Vue);
}
/**
 * 函数式组件，用来渲染 showcaseComponent 的演示组件，以及OperatorView表单控件
 */
const Demo = () =>
  h('div', { class: 'props-playground-demo' }, [
    h('div', { class: 'props-playground-content' }, [h(showcaseComponent.value)]),
    h('div', { class: 'props-playground-operator' }, [h(OperatorView, { schema: props.schema })]),
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
  showcaseComponent.value = createShowcaseComponent(state);
  if (props.docs) {
    Object.keys(props.docs).forEach((key) => {
      props.docs![key] = md.render(props.docs![key]);
    });
  }
});
Demo.__docs = props.docs;
</script>
<template>
  <DemoContainer :demo="Demo" class="props-playground" />
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
  @include respond-to('<=pad') {
    border-top: 1px solid var(--o-color-control1-light);
    border-left: none;
  }
}
:deep(.checkbox-group) {
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
</style>
