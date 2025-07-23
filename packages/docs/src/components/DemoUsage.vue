<script setup lang="ts">
import { h, Fragment, reactive, ref, watchEffect, watch, shallowRef, type VNode, type Component, shallowReactive, onBeforeMount, onBeforeUnmount } from 'vue';
import { OSelect, OOption, OInput, OInputNumber, OCheckbox, OCheckboxGroup, OTextarea, ORadio, ORadioGroup } from '@opensig/opendesign';
import * as prettier from 'prettier';
import htmlPlugin from 'prettier/plugins/html';
import babelPlugin from 'prettier/plugins/babel';
import postPlugin from 'prettier/plugins/postcss';
import tsPlugin from 'prettier/plugins/typescript';
import esTreePlugin from 'prettier/plugins/estree';
import { highlight, md } from '../../plugins/markdown/common';
import { LINENUMBER_TAG_ATTR, LINENUMBER_CSS_ATTR } from '../../plugins/markdown/lineNumber';
import CodeContainer from './CodeContainer.vue';
import { compileComponent } from '@/utils/compileComponent';
import { compileString } from 'sass';
export type SchemeT =
  | {
      type: 'boolean';
      default?: boolean;
      label?: string;
    }
  | {
      type: 'list';
      list: Array<string | number>;
      default?: string | number;
      label?: string;
    }
  | {
      type: 'string';
      default?: string;
      label?: string;
    }
  | {
      type: 'textarea';
      default?: string;
      label?: string;
      row?: number;
    }
  | {
      type: 'number';
      step?: number;
      min?: number;
      max?: number;
      default?: number;
      label?: string;
    }
  | {
      type: 'radio';
      default?: string | number;
      list: Array<string | number>;
    };
const props = defineProps<{
  /** markdown文档 */
  docs?: Record<string, string>;
  /** 表单控件配置数据 */
  schema: Record<string, SchemeT>;
  /** vue 模板 */
  template: string | ((_props: Record<string, any>) => string);
  /** 样式表字符串 */
  style?: string | ((_props: Record<string, any>) => string);
  /** 传给 template 的上下文，在模板中使用 */
  ctx?: any;
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

/**
 * OperatorView 函数式组件，用来渲染表单控件
 * @param param0 表单控件配置数据
 */
function OperatorView({ schema }: { schema: Record<string, SchemeT> }) {
  /** 复选框控件 */
  const checkboxGroup: VNode[] = [];
  /** 选着框控件 */
  const selectionOrInputGroup: VNode[] = [];
  /** 单选框控件 */
  const radioGroup: VNode[] = [];
  const operatorGroup: VNode[] = [];
  Object.entries(schema).forEach(([key, value]) => {
    switch (value.type) {
      case 'boolean':
        checkboxGroup.push(h(OCheckbox, { value: key }, { default: () => value.label || key }));
        break;
      case 'list':
        selectionOrInputGroup.push(
          h(Fragment, [
            h('span', { class: 'props-playground-selector-name' }, value.label || key),
            h(
              OSelect,
              { modelValue: state[key], 'onUpdate:modelValue': (val) => (state[key] = val) },
              {
                default: () => value.list.map((item) => h(OOption, { value: item, label: item.toString() })),
              },
            ),
          ]),
        );
        break;
      case 'string':
        selectionOrInputGroup.push(
          h(Fragment, [
            h('span', { class: 'props-playground-selector-name' }, value.label || key),
            h(OInput, { modelValue: state[key], 'onUpdate:modelValue': (val) => (state[key] = val) }),
          ]),
        );
        break;
      case 'textarea':
        selectionOrInputGroup.push(
          h(Fragment, [
            h('span', { class: 'props-playground-selector-name' }, value.label || key),
            h(OTextarea, {
              modelValue: state[key],
              style: { '--row': value.row || 3 },
              class: 'props-playground-textarea',
              'onUpdate:modelValue': (val) => (state[key] = val),
            }),
          ]),
        );
        break;
      case 'number':
        selectionOrInputGroup.push(
          h(Fragment, [
            h('span', { class: 'props-playground-selector-name' }, value.label || key),
            h(OInputNumber, {
              modelValue: state[key],
              min: value.min,
              max: value.max,
              step: value.step,
              'onUpdate:modelValue': (val) => (state[key] = val),
            }),
          ]),
        );
        break;
      case 'radio':
        radioGroup.push(
          h(
            ORadioGroup,
            { modelValue: state[key], class: 'radio-group', 'onUpdate:modelValue': (val) => (state[key] = val) },
            { default: () => value.list.map((item) => h(ORadio, { value: item }, { default: () => item })) },
          ),
        );
        break;
    }
  });
  if (radioGroup.length) {
    operatorGroup.push(h(Fragment, radioGroup));
  }
  if (checkboxGroup.length) {
    operatorGroup.push(
      h(
        OCheckboxGroup,
        {
          class: 'checkbox-group',
          modelValue: checkboxGroupValue.value,
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
  if (selectionOrInputGroup.length) {
    operatorGroup.push(h('div', { class: 'operator-group' }, selectionOrInputGroup));
  }
  return h(Fragment, operatorGroup);
}
const highlightedCode = ref('');
const sourceCode = ref('');
const showcaseComponent = shallowRef<Component>(() => {});

/**
 * 通过 props.template 动态编译vue组件，同时格式化并高亮源码
 * 动态编译的组件保存在 showcaseComponent 中，格式化的源码保存在 sourceCode 中，高亮的源码保存在 highlightedCode 中
 * @param demoProps 演示组件的属性
 */
function createShowcaseComponent(demoProps: Record<string, any>, style: string | ((demoProps: Record<string, any>) => string) = '') {
  const template = typeof props.template === 'function' ? props.template(demoProps) : props.template;
  let sfcCode = template.trimStart().startsWith('<template>') ? template : `<template>${template}</template>`;
  if (style) {
    sfcCode = `${sfcCode}\n<style lang="scss">${typeof style === 'string' ? style : style(demoProps)}</style>`;
  }
  prettier
    .format(sfcCode, {
      parser: 'vue',
      plugins: [htmlPlugin, esTreePlugin, babelPlugin, postPlugin, tsPlugin],
      singleQuote: true,
      printWidth: 120,
    })
    .then((code) => {
      sourceCode.value = code;
      highlightedCode.value = highlight(code, 'vue');
    });
  return compileComponent(template, props.ctx);
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
const docs = shallowReactive<Record<string, Component | string>>({});
watchEffect(() => {
  showcaseComponent.value = createShowcaseComponent(state, props.style);
  if (props.docs) {
    Object.keys(props.docs).forEach((key) => {
      const htmlCode = md.render(props.docs![key]);
      try {
        docs[key] = compileComponent(htmlCode);
      } catch (e) {
        docs[key] = htmlCode;
        if (process.env.NODE_ENV === 'development') {
          console.warn(e);
          console.warn(`${key}:\n${htmlCode}`);
        }
      }
    });
  } else {
    Object.keys(docs).forEach((key) => {
      delete docs[key]; // 清除之前的文档组件
    });
  }
});

Demo.__docs = docs;
// 设置样式表
let styleDom: HTMLStyleElement | null = null;
onBeforeMount(() => {
  styleDom = document.createElement('style');
  watchEffect(() => {
    styleDom!.innerHTML = compileString(typeof props.style === 'function' ? props.style(state) : props.style || '').css;
  });
  document.head.appendChild(styleDom!);
});
onBeforeUnmount(() => {
  styleDom?.remove();
});
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
