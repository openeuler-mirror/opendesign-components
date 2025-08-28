<script setup lang="ts">
import { OButton, useMessage, OScroller, OIconChevronUp } from '@opensig/opendesign';
import { computed, inject } from 'vue';
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
const docConfig = inject<any>('docs-config');
</script>

<template>
  <div class="code-container">
    <OScroller show-type="always" class="code-container-scroller">
      <slot></slot>
    </OScroller>
    <div v-if="props.lang" class="lang-mark">{{ props.lang }}</div>
    <div class="operation-block">
      <OButton variant="outline" size="small" @click="copyCode">
        <template #icon><DocIconCopy /></template>
      </OButton>
      <OButton v-if="docConfig?.['is-show-code']" variant="outline" size="small" @click="() => docConfig?.['switch-show-code']?.()">
        <template #icon><OIconChevronUp /></template>
      </OButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.code-container {
  background-color: var(--o-color-fill2);
  position: relative;

  .lang-mark,
  .operation-block {
    position: absolute;
    z-index: 2;
    color: var(--o-color-info3);
  }
  .lang-mark {
    top: var(--o3-gap-3);
    right: var(--o3-gap-4);
  }
  .operation-block {
    display: none;
    top: var(--o3-gap-2);
    right: var(--o3-gap-4);
    :deep(.o-btn) {
      --btn-height: var(--o3-icon_size-l);
      --btn-icon-size: var(--o3-icon_size-m);
      & + .o-btn {
        margin-left: var(--o3-gap-2);
      }
    }
  }

  &:hover {
    .lang-mark {
      display: none;
    }
    .operation-block {
      display: block;
    }
  }

  :deep(pre) {
    padding: var(--o3-gap-3) var(--o3-gap-5);
    margin: 0;
    width: max-content;
  }
}
.code-container-scroller {
  max-height: 70vh;
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
