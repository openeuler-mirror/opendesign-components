<script setup lang="ts">
import { ref } from 'vue';
import { OSelect } from '../index';
import { OOption } from '../../option';
const options = [
  { label: 'option 1', value: 'opt1' },
  { label: 'long long long long long long long long long long long long text option 2', value: 'opt2' },
  { label: 'option 3', value: 'opt3' },
  { label: 'option 4', value: 'opt4' },
];
const selectVal1 = ref('opt1');
const changeVal = () => {
  selectVal1.value = 'opt3';
};
</script>
<template>
  <h4>Color & Variant</h4>
  <section>
    <div @click="changeVal">Text</div>
    <div class="row">
      <OSelect v-model="selectVal1" variant="text" placeholder="normal + outline" loading>
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <OSelect v-model="selectVal1" variant="text" color="success" placeholder="normal + success">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <OSelect v-model="selectVal1" variant="text" color="warning" placeholder="normal + warning">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <OSelect v-model="selectVal1" variant="text" color="danger" placeholder="normal + danger">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
    <div @click="changeVal">Outline</div>
    <div class="row">
      <OSelect v-model="selectVal1" placeholder="normal + outline" loading>
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <OSelect v-model="selectVal1" color="success" placeholder="normal + success">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <OSelect v-model="selectVal1" color="warning" placeholder="normal + warning">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <OSelect v-model="selectVal1" color="danger" placeholder="normal + danger">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
    <div>Solid</div>
    <div class="row">
      <OSelect v-model="selectVal1" placeholder="normal + outline" variant="solid">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <OSelect v-model="selectVal1" color="success" variant="solid" placeholder="normal + success">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <OSelect v-model="selectVal1" color="warning" variant="solid" placeholder="normal + warning">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <OSelect v-model="selectVal1" color="danger" variant="solid" placeholder="normal + danger">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
  </section>
  <h4>Round & Size</h4>
  <section>
    <div>default</div>
    <div class="row">
      <OSelect v-model="selectVal1" size="small">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>

      <OSelect v-model="selectVal1">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>

      <OSelect v-model="selectVal1" size="large">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
    <div>round="pill"</div>
    <div class="row">
      <OSelect v-model="selectVal1" size="small" round="pill">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>

      <OSelect v-model="selectVal1" round="pill">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>

      <OSelect v-model="selectVal1" size="large" round="pill">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
    <div>round="12px"</div>
    <div class="row">
      <OSelect v-model="selectVal1" size="small" round="12px">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>

      <OSelect v-model="selectVal1" round="12px">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>

      <OSelect v-model="selectVal1" size="large" round="12px">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
  </section>
  <h4>Disabled</h4>
  <section>
    <div>Select disabled</div>
    <div class="row">
      <OSelect v-model="selectVal1" placeholder="normal + outline" disabled>
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <OSelect v-model="selectVal1" color="success" placeholder="normal + success" disabled>
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <OSelect v-model="selectVal1" color="warning" placeholder="normal + warning" disabled>
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <OSelect v-model="selectVal1" color="danger" placeholder="normal + danger" disabled>
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
    <div class="row">
      <OSelect v-model="selectVal1" placeholder="normal + outline" variant="solid" disabled>
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <OSelect v-model="selectVal1" color="success" variant="solid" placeholder="normal + success" disabled>
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <OSelect v-model="selectVal1" color="warning" variant="solid" placeholder="normal + warning" disabled>
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <OSelect v-model="selectVal1" color="danger" variant="solid" placeholder="normal + danger" disabled>
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </div>
    <div>Option disabled</div>
    <div class="row">
      <OSelect v-model="selectVal1" placeholder="normal + outline">
        <OOption :label="options[0].label" :value="options[0].value" />
        <OOption :label="options[1].label" :value="options[1].value" disabled />
        <OOption :label="options[2].label" :value="options[2].value" disabled />
        <OOption :label="options[3].label" :value="options[3].value" />
      </OSelect>
    </div>
  </section>
  <h4>Clearable</h4>
  <section>
    <OSelect v-model="selectVal1" placeholder="select..." clearable loading>
      <OOption :label="options[0].label" :value="options[0].value" />
      <OOption :label="options[1].label" :value="options[1].value" />
      <OOption :label="options[2].label" :value="options[2].value" />
      <OOption :label="options[3].label" :value="options[3].value" />
    </OSelect>
  </section>
</template>
<style lang="scss"></style>
