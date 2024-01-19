<script setup lang="ts">
import { ref } from 'vue';
import { OForm, OFormItem } from '../index';
import '../../input/style';
import { OInput } from '../../input';
import '../../select/style';
import { OSelect } from '../../select';
import '../../option/style';
import { OOption } from '../../option';
import '../../textarea/style';
import { OTextarea } from '../../textarea';

const options = [
  { label: 'option 1', value: 'opt1' },
  { label: 'long long long long long long long long long long long long text option 2', value: 'opt2' },
  { label: 'option 3', value: 'opt3' },
  { label: 'option 4', value: 'opt4' },
];
const layout = ref<'h' | 'v' | 'inline'>('h');
const changeLayout = (l: 'h' | 'v' | 'inline') => {
  layout.value = l;
};
const labelAlign = ref<'top' | 'bottom' | 'center'>('top');
const changelabelAlign = (l: 'top' | 'bottom' | 'center') => {
  labelAlign.value = l;
};
const labelJustify = ref<'left' | 'right' | 'center'>('left');
const changelabelJustify = (l: 'left' | 'right' | 'center') => {
  labelJustify.value = l;
};
const labelWidth = ref<string>('30%');
const changelabelWidth = (l: '30%' | '15%' | '200px') => {
  labelWidth.value = l;
};
</script>
<template>
  <h4>基本</h4>

  <section>
    <div class="row">
      Layout:
      <span class="link" :class="{ current: layout === 'h' }" @click="changeLayout('h')">水平</span>
      <span class="link" :class="{ current: layout === 'v' }" @click="changeLayout('v')">垂直</span>
      <span class="link" :class="{ current: layout === 'inline' }" @click="changeLayout('inline')">行内</span>

      Label Align:
      <span class="link" :class="{ current: labelAlign === 'top' }" @click="changelabelAlign('top')">顶部对齐</span>
      <span class="link" :class="{ current: labelAlign === 'bottom' }" @click="changelabelAlign('bottom')">底部对齐</span>
      <span class="link" :class="{ current: labelAlign === 'center' }" @click="changelabelAlign('center')">居中</span>

      Label Justify:
      <span class="link" :class="{ current: labelJustify === 'left' }" @click="changelabelJustify('left')">左对齐</span>
      <span class="link" :class="{ current: labelJustify === 'right' }" @click="changelabelJustify('right')">右对齐</span>
      <span class="link" :class="{ current: labelJustify === 'center' }" @click="changelabelJustify('center')">居中</span>
    </div>
    <div class="row">
      Label Width:
      <span class="link" :class="{ current: labelWidth === '30%' }" @click="changelabelWidth('30%')">30%</span>
      <span class="link" :class="{ current: labelWidth === '15%' }" @click="changelabelWidth('15%')">15%</span>
      <span class="link" :class="{ current: labelWidth === '200px' }" @click="changelabelWidth('200px')">200px</span>
    </div>
    <OForm class="form" has-required :layout="layout" :label-align="labelAlign" :label-justify="labelJustify" :label-width="labelWidth">
      <OFormItem label="标题文本1" required>
        <OInput />
      </OFormItem>
      <OFormItem label="标题文本2标题文本2标题文本2标题文本2标题文本2标题文本2标题文本2">
        <OSelect>
          <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        </OSelect>
      </OFormItem>
      <OFormItem label="标题文本2 width：20%" label-width="20%">
        <OTextarea />
      </OFormItem>
    </OForm>
  </section>
</template>
<style lang="scss">
.form {
  width: 100%;
}
.link {
  cursor: pointer;
  color: var(--o-color-success1);
  &.current {
    color: var(--o-color-danger1);
  }
}
</style>
