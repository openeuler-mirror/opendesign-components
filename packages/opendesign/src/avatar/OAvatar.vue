<script setup lang="ts">
import { computed, ref } from 'vue';

import { IconAvatar, IconEdit } from '../_utils/icons';

import { avatarProps } from './types.ts';
import { normalizeSize } from './utils.ts';

const props = defineProps(avatarProps);

const emit = defineEmits<{
  /**
   * @zh-CN 点击头像时触发，仅在 clickable 为 true 时生效
   * @en-US Emitted when avatar is clicked, only when clickable is true
   */
  (e: 'click', evt: MouseEvent): void;
  /**
   * @zh-CN 图片加载失败时触发
   * @en-US Emitted when image loading fails
   */
  (e: 'error'): void;
  /**
   * @zh-CN 图片加载成功时触发
   * @en-US Emitted when image loads successfully
   */
  (e: 'load'): void;
}>();

defineSlots<{
  /**
   * @zh-CN 名称文字自定义内容，默认显示首字符或 nameFormatter 渲染结果
   * @en-US Custom name text content, default shows first character or nameFormatter result
   */
  name(): any;
  /**
   * @zh-CN 可点击时触发图标自定义内容，默认显示编辑图标
   * @en-US Custom trigger icon content when clickable, default shows edit icon
   */
  'trigger-icon'(): any;
}>();

const hasError = ref(false);
const isLoaded = ref(false);

const showText = computed(() => props.name && !props.url);
const showDefault = computed(() => !props.url && !props.name);

const outerStyle = computed(() => {
  const style: Record<string, any> = {};
  if (props.size) {
    style['--avatar-size'] = normalizeSize(props.size);
  }
  if (showText.value) {
    style['--avatar-bg'] = props.background || `var(--o-color-auxiliary${Math.floor(Math.random() * 8) + 1})`;
  } else if (!showDefault.value && !hasError.value) {
    style['--avatar-bg'] = `var(--o-color-fill2)`;
  }
  return style;
});

const handleImgLoad = () => {
  isLoaded.value = true;
  emit('load');
};

const handleImgError = () => {
  hasError.value = true;
  emit('error');
};

const onClick = (e: MouseEvent) => {
  if (props.clickable) {
    emit('click', e);
  }
};
</script>

<template>
  <div
    :style="outerStyle"
    :class="[
      'o-avatar',
      'o-avatar-circle',
      {
        'o-avatar-img': isLoaded,
        'o-avatar-default': !showText && !isLoaded,
        'o-avatar-text': showText,
        'o-avatar-clickable': props.clickable,
      },
    ]"
    @click="onClick"
  >
    <img v-if="url && !hasError" :src="url" :style="{ objectFit: props.objectFit }" alt="avatar" @load="handleImgLoad" @error="handleImgError" />
    <template v-else-if="showText">
      <slot name="name">
        <component :is="props.nameFormatter({ name: props.name })" v-if="props.nameFormatter" />
        <span v-else>{{ props.name?.[0] }}</span>
      </slot>
    </template>
    <IconAvatar v-else-if="showDefault || hasError" class="o-avatar-default-icon" />

    <div v-if="props.clickable" class="o-avatar-trigger-icon">
      <slot name="trigger-icon"><IconEdit /></slot>
    </div>
  </div>
</template>
