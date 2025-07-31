<script setup lang="ts">
import { OButton, useMessage, OScroller } from '@opensig/opendesign';
import { computed } from 'vue';
import { DocIconCopy } from '@/icon-components';

const props = defineProps<{
  /** 代码块的源码（未经高亮的源码）*/
  contentEncoded: string;
  /** 代码块的语言 */
  lang?: string;
}>();

const content = computed(() => decodeURIComponent(props.contentEncoded));
const copyCode = async () => {
  try {
    await navigator.clipboard.writeText(content.value);
    await useMessage(null).success({ content: 'Copied' });
  } catch (err) {
    await useMessage(null).danger({ content: 'Copy Failed' });
    throw err;
  }
};
</script>

<template>
  <div class="code-container">
    <OScroller show-type="always">
      <slot></slot>
    </OScroller>
    <div v-if="props.lang" class="lang-mark">{{ props.lang }}</div>
    <OButton class="copy-block" variant="outline" size="small" @click="copyCode">
      <template #icon><DocIconCopy /></template>
    </OButton>
  </div>
</template>

<style lang="scss" scoped>
.code-container {
  background-color: var(--o-color-fill2);
  position: relative;

  .lang-mark,
  .copy-block {
    position: absolute;
    z-index: 2;
    color: var(--o-color-info3);
  }
  .lang-mark {
    top: var(--o3-gap-3);
    right: var(--o3-gap-4);
  }
  .copy-block {
    display: none;
    top: var(--o3-gap-2);
    right: var(--o3-gap-4);
    --btn-height: var(--o3-icon_size-l);
  }

  &:hover {
    .lang-mark {
      display: none;
    }
    .copy-block {
      display: block;
    }
  }

  :deep(pre) {
    padding: var(--o3-gap-3) var(--o3-gap-5);
    margin: 0;
    width: max-content;
  }
}
:deep(pre[data-linenumber-start]) {
  position: relative;
  padding-left: calc(2em + var(--o3-gap-4));
  white-space: pre-wrap;
  width: auto;
  counter-reset: line-number var(--linenumber-start, 1);
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(2em + var(--o3-gap-4) - 4px);
    width: 1px;
    background-color: var(--o-color-control1);
  }
  .line {
    counter-increment: line-number;
    &:first-child {
      counter-increment: none;
    }
    &::before {
      content: counter(line-number);
      position: absolute;
      left: 2em;
      color: var(--o-color-info2);
      transform: translateX(-100%);
      user-select: none;
      white-space: nowrap;
    }
    &:last-child::before {
      content: none;
    }
  }
}
</style>
