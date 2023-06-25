<script setup lang="ts">
import { ComponentPublicInstance, ref, Ref, shallowRef } from 'vue';
import { messageListProps, MessageParamsT } from './types';
import OMessage from './OMessage.vue';
import { isString } from '../_utils/is';

const props = defineProps(messageListProps);

const getUniqueId = (() => {
  let id = 0;
  return () => {
    id += 1;
    return id;
  };
})();

type MessageListOptionT = MessageParamsT & { id: number };

const optionList: Ref<Array<MessageListOptionT>> = ref([]);

const add = (params: MessageParamsT) => {
  const option = {
    id: getUniqueId(),
    ...params,
  };

  if (params.icon) {
    option.icon = shallowRef(params.icon);
  }
  optionList.value.push(option);
};

const remove = (idx: number) => {
  optionList.value.splice(idx, 1);
};

const removeAll = () => {
  optionList.value = [];
};

const close = (id: number) => {
  const idx = optionList.value.findIndex((option) => option.id === id);
  remove(idx);
  if (optionList.value.length === 0 && props.onDestory) {
    props.onDestory();
  }
};

const handleDurationEnd = (item: MessageListOptionT) => {
  const { id, onDurationEnd } = item;
  onDurationEnd?.();
  close(id);
};

const handleClose = (item: MessageListOptionT, ev?: MouseEvent) => {
  const { id, onClose } = item;
  onClose?.(ev);
  close(id);
};

defineExpose({ add, remove, removeAll });
</script>

<template>
  <div v-if="optionList.length" class="o-message-list" :class="[`o-message-list-${props.position}`]">
    <TransitionGroup name="o-message-fade">
      <OMessage
        v-for="item in optionList"
        :key="item.id"
        :status="item.status"
        :duration="item.duration"
        :closable="item.closable"
        @duration-end="handleDurationEnd(item)"
        @close="
          (ev) => {
            handleClose(item, ev);
          }
        "
      >
        <template v-if="item.icon" #icon>
          <component :is="item.icon" />
        </template>

        <template v-if="isString(item.content)">{{ item.content }}</template>
        <component :is="item.content" v-else />
      </OMessage>
    </TransitionGroup>
  </div>
</template>
