<script setup lang="ts">
import { useMessage, OScroller, OIconChevronUp, OIcon } from '@opensig/opendesign';
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
    <div class="operation-block">
      <span v-if="props.lang" class="lang-mark">{{ props.lang }}</span>
      <div class="right-btn-group">
        <OIcon v-if="docConfig?.['is-show-code']" button :icon="OIconChevronUp" @click="() => docConfig?.['switch-show-code']?.()" class="right-btn" />
        <OIcon :icon="DocIconCopy" button @click="copyCode" class="right-btn" />
      </div>
    </div>
    <OScroller show-type="hover" class="code-container-scroller">
      <slot></slot>
    </OScroller>
  </div>
</template>

<style lang="scss" scoped>
.code-container {
  background-color: var(--o-color-fill2);
  position: relative;

  .operation-block {
    padding: 4px 12px;
    color: var(--o-color-info3);
    background-color: var(--o-color-control1-light);
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .right-btn-group {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 24px;
  }

  :deep(pre) {
    padding: var(--o3-gap-3) var(--o3-gap-5);
    margin: 0;
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
