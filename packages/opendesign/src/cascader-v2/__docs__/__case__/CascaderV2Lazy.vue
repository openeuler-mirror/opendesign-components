<script lang="ts" setup>
import { ref } from 'vue';
import { OCascaderV2 } from '@opensig/opendesign';
import type { CascaderV2LazyNodeT, CascaderV2OptionT, CascaderV2LazyloadFn } from '../../types';

const modelValue = ref(undefined);
const errorLog = ref<string[]>([]);

const options = [
  {
    label: 'Option 1',
    value: '1',
    children: [
      {
        label: 'Sub-option 1-1',
        value: '1-1',
        children: [
          { label: 'Sub-option 1-1-1', value: '1-1-1' },
          { label: 'Sub-option 1-1-2', value: '1-1-2' },
          { label: 'Sub-option 1-1-3', value: '1-1-3' },
        ],
      },
      { label: 'Sub-option 1-2', value: '1-2' },
      { label: 'Sub-option 1-3', value: '1-3' },
    ],
  },
  {
    label: 'Option 2 (随机报错)',
    value: '2',
    children: [
      {
        label: 'Sub-option 2-1',
        value: '2-1',
        children: [{ label: 'Sub-option 2-1-1', value: '2-1-1' }],
      },
      { label: 'Sub-option 2-2', value: '2-2' },
    ],
  },
  { label: 'Option 3', value: '3' },
  { label: 'Option 4', value: '4', disabled: true },
  { label: 'Option 5', value: '5' },
];

const findNode = (opts: any[], val: string | number): any => {
  for (const opt of opts) {
    if (opt.value === val) return opt;
    if (Array.isArray(opt.children)) {
      const found = findNode(opt.children, val);
      if (found) return found;
    }
  }
  return null;
};

type RawOption = { value: string | number; label?: string; disabled?: boolean; children?: RawOption[] };

const toItem = (opt: RawOption) => ({
  value: opt.value,
  label: opt.label,
  disabled: opt.disabled,
  leaf: !Array.isArray(opt.children) || opt.children.length === 0,
});

// 根节点同步返回（下拉无延迟），展开子目录模拟异步延迟
const lazyload: CascaderV2LazyloadFn = (node) => {
  if (node.value === null) {
    return Promise.resolve(options.map(toItem) as unknown as CascaderV2OptionT[]);
  }

  const nodeValue = node.value;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Option 2 的子节点随机模拟请求失败
      if (String(nodeValue).startsWith('2') && Math.random() < 0.6) {
        reject(new Error('Network error'));
        return;
      }
      const found = findNode(options, nodeValue);
      const children = Array.isArray(found?.children) ? found.children.map(toItem) : [];
      resolve(children as unknown as CascaderV2OptionT[]);
    }, 800);
  });
};

const onLazyloadError = (node: CascaderV2LazyNodeT) => {
  const msg = `加载失败：${node.label || 'root'}（value: ${node.value}）— 点击可重试`;
  errorLog.value.unshift(msg);
};
</script>

<template>
  <div class="demo-cascader-v2-lazy-wrap">
    <OCascaderV2
      v-model="modelValue"
      :lazy="true"
      :lazyload="lazyload"
      placeholder="请选择（Option 2 子节点随机报错）"
      class="demo-cascader-v2-lazy"
      @lazyload-error="onLazyloadError"
    />
  </div>

  <template v-if="errorLog.length">
    <p style="margin-top: 12px; color: var(--o-color-danger1, #f53f3f); font-size: 13px">错误记录（失败后点击节点可重试）：</p>
    <ul style="margin: 4px 0 0; padding-left: 18px; font-size: 13px">
      <li v-for="(msg, i) in errorLog" :key="i">{{ msg }}</li>
    </ul>
  </template>

  <p>Selected:</p>
  <pre>{{ modelValue }}</pre>
</template>

<style lang="scss">
.demo-cascader-v2-lazy-wrap {
  .demo-cascader-v2-lazy {
    width: 100%;
    max-width: 320px;
  }
}
</style>
