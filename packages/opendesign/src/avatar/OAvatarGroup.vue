<script setup lang="ts">
import { computed } from 'vue';
import { createReusableTemplate } from '@vueuse/core';

import { IconEllipsis } from '../_utils/icons';

import { avatarGroupProps } from './types';
import { OAvatar } from './index';
import { normalizeSize } from './utils.ts';

const props = defineProps(avatarGroupProps);

const size = normalizeSize(props.size);
const total = computed(() => props.urlList.length);

const maxVisible = computed(() => (props.layout === 'horizontal' ? 3 : 4));

const displayedAvatars = computed(() => {
  let list = props.urlList.length > maxVisible.value ? props.urlList.slice(0, maxVisible.value - 1) : [...props.urlList];
  if (props.layout === 'horizontal') {
    list.reverse()
  }
  return list
});

const overflowCount = computed(() => Math.max(0, total.value - displayedAvatars.value.length));

const overflowText = computed(() => {
  if (props.overflowType === 'count') {
    const count = overflowCount.value;
    return count > 99 ? '99+' : `+${count}`;
  }
  return null;
});

const [DefineMoreAvatar, ReuseMoreAvatar] = createReusableTemplate();
</script>

<template>
  <div
    class="o-avatar-group"
    :class="[
      props.layout === 'horizontal' ? 'o-avatar-group-horizontal' : 'o-avatar-group-symmetric',
      {
        'o-avatar-group-single': total < 2,
        'o-avatar-group-triangle': total === 3,
      },
    ]"
    :style="{ '--avatar-size': size }"
  >
    <DefineMoreAvatar>
      <OAvatar v-if="overflowCount > 0" :size="props.size" class="o-avatar-group-more" name="_more">
        <template #name>
          <slot name="more">
            <span v-if="overflowText" class="o-avatar-group-more-text">{{ overflowText }}</span>
            <IconEllipsis v-else />
          </slot>
        </template>
      </OAvatar>
    </DefineMoreAvatar>

    <ReuseMoreAvatar v-if="props.layout === 'horizontal'" />

    <OAvatar
      v-for="(item, index) in displayedAvatars"
      :key="index"
      :url="item.url"
      :name="item.name"
      :background="item.background"
      :size="props.size"
      :name-formatter="props.nameFormatter"
      :object-fit="props.objectFit"
    />

    <ReuseMoreAvatar v-if="props.layout === 'symmetric'" />
  </div>
</template>
