<script setup lang="ts">
import { OButton, useMessage, OScroller } from '@opensig/opendesign';
import { computed } from 'vue';

const props = defineProps<{
  contentEncoded: string;
  lang?: string;
  lineNumbers?: boolean;
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
  <div class="code-container" :class="{ 'line-numbers': props.lineNumbers }">
    <slot v-if="props.lineNumbers"></slot>
    <OScroller v-else disabled-y>
      <slot></slot>
    </OScroller>
    <div v-if="props.lang" class="lang-mark">{{ props.lang }}</div>
    <OButton class="copy-block" variant="outline" size="small" @click="copyCode">
      <template #icon>
        <svg viewBox="0 0 28 28" class="o-svg-icon">
          <path
            fill-rule="nonzero"
            fill="currentColor"
            d="M25.096 0C26.7 0 28 1.3 28 2.902v15.756c0 1.604-1.3 2.904-2.904 2.904h-3.534V25.5a2.5 2.5 0 0 1-2.5 2.5H2.5A2.5 2.5 0 0 1 0 25.5V8.936a2.5 2.5 0 0 1 2.5-2.5h3.968V2.902C6.468 1.298 7.768 0 9.372 0zm-6.034 26.124c.346 0 .626-.28.626-.624V8.936a.624.624 0 0 0-.626-.626H2.5a.626.626 0 0 0-.626.626v16.56c0 .346.28.626.626.626h16.562zm7.094-7.466V2.902c0-.568-.46-1.028-1.028-1.028H9.372c-.568 0-1.028.46-1.028 1.028v3.536h10.75a2.5 2.5 0 0 1 2.5 2.5v10.75h3.534c.568 0 1.028-.46 1.028-1.03m-11.206-5.19a.938.938 0 0 1-.02 1.876H6.64a.938.938 0 0 1 .02-1.876h8.292zm0 5.626a.938.938 0 1 1-.02 1.874H6.64a.938.938 0 1 1 .02-1.874h8.292z"
          ></path>
        </svg>
      </template>
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
    top: var(--o-gap-4);
    right: var(--o-gap-4);
  }
  .copy-block {
    display: none;
    top: var(--o-gap-4);
    right: var(--o-gap-4);
    --btn-height: var(--o-icon_size-l);
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
    padding: var(--o-gap-3) var(--o-gap-5);
    margin: 0;
  }
}
.line-numbers {
  :deep(pre) {
    position: relative;
    padding-left: calc(2em + 16px);
    white-space: pre-wrap;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: calc(2em + 8px);
      width: 1px;
      background-color: var(--o-color-control1);
    }
    .line-number {
      position: absolute;
      left: 2em;
      color: var(--o-color-info2);
      transform: translateX(-100%);
      user-select: none;
      white-space: nowrap;
    }
  }
}
</style>
