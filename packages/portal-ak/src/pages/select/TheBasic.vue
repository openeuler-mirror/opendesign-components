<script setup lang="ts">
import { OSelect, OOption, OIconAdd, SelectValueT } from '@components/index';
import { ref } from 'vue';
const options = [
  { label: '选项 1', value: '1' },
  { label: '选项 2', value: '2' },
  { label: '选项 3', value: '3' },
  { label: '选项 4', value: '4' },
  { label: '选项 5', value: '5' },
  { label: '选项 6', value: '6' },
  { label: '选项 7', value: '7' },
  { label: '选项 8', value: '8' },
  { label: '选项 9', value: '9' },
];
const selectVal1 = ref('1');
const onChange = (value: SelectValueT) => {
  console.log(value);
};
const selectVal2 = ref(['1']);
const selectVal3 = ref(['1', '3', '5']);

// loading
const lazySelectVal = ref();
const isLoaded = ref(-1); // -1 未加载 0：正在加载 1： 已加载
const lazyOptions = ref<typeof options>([]);
const onOptionsVisible = (visible: boolean) => {
  if (visible && isLoaded.value === -1) {
    isLoaded.value = 0;
  }

  setTimeout(() => {
    isLoaded.value = 1;
    lazyOptions.value = options;
  }, 2000);
};

// loading2
const lazySelectVal2 = ref();
const isLoaded2 = ref(-1); // -1 未加载 0：正在加载 1： 已加载
const lazyOptions2 = ref<typeof options>([]);
const onOptionsVisible2 = (visible: boolean) => {
  if (visible && (isLoaded2.value === -1 || lazyOptions2.value.length === 0)) {
    isLoaded2.value = 0;
  }

  setTimeout(() => {
    isLoaded2.value = 1;
    lazyOptions2.value = [];
  }, 2000);
};

// 确认是否显示下拉选项
const beforeOptionsShow = () => {
  const rlt = confirm('确认展开/隐藏选项吗？');
  return rlt;
};

const beforeSelect = (value: SelectValueT, currentValue: SelectValueT) => {
  if (currentValue == value) {
    return true;
  }
  console.log(currentValue);

  const rlt = confirm(`确认选择选项(val: ${value})吗？`);
  return rlt;
};

const onAdd = () => {
  alert('Add Option');
};
</script>
<template>
  <div class="page-demo">
    <h3>类型 & 尺寸</h3>
    <section>
      <span style="width: 40px"> M:</span>
      <OSelect :default-value="selectVal1" placeholder="normal + outline" style="width: 240px" clearable @change="onChange">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>

      <OSelect v-model="selectVal1" variant="text" no-responsive placeholder="normal + outline" style="width: 160px">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>

      <OSelect v-model="selectVal2" placeholder="normal + outline" style="width: 240px" multiple>
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>

      <OSelect v-model="selectVal2" variant="text" no-responsive placeholder="normal + outline" style="width: 160px" multiple>
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </section>
    <section>
      <span style="width: 40px"> L:</span>
      <OSelect v-model="selectVal1" placeholder="normal + outline" size="large" style="width: 240px">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>

      <OSelect v-model="selectVal1" variant="text" no-responsive placeholder="normal + outline" size="large" style="width: 160px">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <OSelect v-model="selectVal3" placeholder="normal + outline" size="large" style="width: 280px" multiple :max-tag-count="2">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>

      <OSelect v-model="selectVal2" variant="text" no-responsive placeholder="normal + outline" size="large" style="width: 160px" multiple>
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </section>
    <h3>禁用</h3>
    <section>
      <OSelect v-model="selectVal1" placeholder="normal + outline" style="width: 240px" disabled>
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <OSelect v-model="selectVal1" placeholder="normal + outline" size="large" style="width: 240px" disabled>
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>

      <OSelect v-model="selectVal1" variant="text" no-responsive placeholder="normal + outline" size="large" style="width: 160px" disabled>
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <OSelect v-model="selectVal1" placeholder="normal + outline" style="width: 240px">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" :disabled="item.value === '3'" />
      </OSelect>
    </section>
    <h3>Loading & 空状态</h3>
    <section>
      <OSelect v-model="lazySelectVal" placeholder="选项加载2s" style="width: 240px" :loading="isLoaded === 0" @options-visible-change="onOptionsVisible">
        <OOption v-for="item in lazyOptions" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
      <OSelect v-model="lazySelectVal2" placeholder="选项空状态" style="width: 240px" :loading="isLoaded2 === 0" @options-visible-change="onOptionsVisible2">
        <OOption v-for="item in lazyOptions2" :key="item.value" :label="item.label" :value="item.value" />
        <template #empty>很遗憾，没有数据哦</template>
      </OSelect>
    </section>

    <h3>下拉项显示/隐藏前确认</h3>
    <section>
      <OSelect
        v-model="selectVal1"
        placeholder="normal + outline"
        style="width: 160px"
        :before-options-show="beforeOptionsShow"
        :before-options-hide="beforeOptionsShow"
        :before-select="beforeSelect"
      >
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </OSelect>
    </section>

    <h3>扩展菜单</h3>
    <section>
      <OSelect v-model="selectVal1" placeholder="normal + outline" style="width: 160px">
        <OOption v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
        <template #action>
          <div class="select-add" @click="onAdd"><OIconAdd /> 创建新选项</div>
        </template>
      </OSelect>
    </section>
  </div>
</template>
<style lang="scss" scoped>
.page-demo {
  padding-bottom: 400px;
}
.select-add {
  border-top: 1px solid var(--o-color-control1);
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  &:hover {
    color: var(--o-color-link1);
  }
}
</style>
