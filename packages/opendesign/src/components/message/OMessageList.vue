<script setup lang="ts">
import { Ref, shallowRef } from 'vue';
import { ref } from 'vue';
import { MessagePositionT, MessageParamsT } from './types';
import OMessage from './OMessage.vue';

interface MessageListPropsT {
  position?: MessagePositionT;
  onDestory?: () => void;
}

const props = withDefaults(defineProps<MessageListPropsT>(), {
  position: 'top',
  onDestory: undefined,
});

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

const handleClose = (item: MessageListOptionT) => {
  const { id, onClose } = item;
  onClose?.();

  const idx = optionList.value.findIndex((option) => option.id === id);
  remove(idx);

  if (optionList.value.length === 0 && props.onDestory) {
    props.onDestory();
  }
};

defineExpose({ add, remove, removeAll });
</script>

<template>
  <div v-if="optionList.length" class="o-message-list" :class="[`o-message-${props.position}`]">
    <TransitionGroup name="fade-message">
      <OMessage v-for="item in optionList" :key="item.id" :content="item.content" :status="item.status" :duration="item.duration" @close="handleClose(item)">
        <template v-if="item.icon" #icon>
          <component :is="item.icon" />
        </template>
      </OMessage>
    </TransitionGroup>
  </div>
</template>
