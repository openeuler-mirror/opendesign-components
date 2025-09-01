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
    <div class="operation-block">
      <OButton v-if="docConfig?.['is-show-code']" variant="outline" size="small" class="operation-btn" @click="() => docConfig?.['switch-show-code']?.()">
        <template #icon><OIconChevronUp /></template>
      </OButton>
      <OButton variant="outline" size="small" class="operation-btn" @click="copyCode">
        <template #icon><DocIconCopy /></template>
      </OButton>
      <span v-if="props.lang" class="lang-mark">{{ props.lang }}</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.code-container {
  background-color: var(--o-color-fill2);
  position: relative;

  .operation-block {
    position: absolute;
    z-index: 2;
    color: var(--o-color-info3);
    top: var(--o3-gap-2);
    right: var(--o3-gap-4);
    display: flex;
    align-items: center;
    .operation-btn {
      --btn-height: var(--o3-icon_size-l);
      --btn-icon-size: calc(var(--btn-height) - 8px);
      background-color: var(--o-color-fill2);
      margin-right: var(--o3-gap-2);
    }
  }

  :deep(pre) {
    padding: var(--o3-gap-3) var(--o3-gap-5);
    margin: 0;
  }
}
@media (hover: hover) {
  .operation-btn {
    display: none;
  }
  .code-container:hover {
    .operation-btn {
      display: inline-flex;
    }
    .lang-mark {
      display: none;
    }
  }
}
.code-container-scroller {
  max-height: 70vh;
}
@include respond-to('>pad_v') {
  :deep(pre[data-linenumber-start]) {
    position: relative;
    padding-left: calc(2em + var(--o3-gap-4));
    white-space: pre-wrap;
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
        transform: translate(-100%);
        user-select: none;
        white-space: nowrap;
      }
      &:last-child::before {
        content: none;
      }
    }
  }
}
</style>
