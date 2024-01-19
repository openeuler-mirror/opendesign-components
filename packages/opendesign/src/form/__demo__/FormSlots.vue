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
</script>
<template>
  <h4>插槽</h4>
  <section>
    <div class="row">
      <OForm class="form" has-required layout="h">
        <OFormItem label="标题文本1" required>
          <OInput />
          <template #extra> 这是一段额外的消息 </template>
        </OFormItem>
        <OFormItem label="标题文本2标题文本2标题文本2标题文本2标题文本2标题文本2标题文本2">
          <OSelect>
            <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
          </OSelect>
        </OFormItem>
        <OFormItem label="标题文本2 ">
          <OTextarea />
          <template #extra> 这是一段额外的消息 </template>
        </OFormItem>
      </OForm>
    </div>
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
