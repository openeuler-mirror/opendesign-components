<script setup lang="ts">
import { ref, Ref } from 'vue';
import OToast from './OToast.vue';
import { isString, isFunction } from '../_utils/is';
import { toastListProps, type ToastParamsT } from './types';

const props = defineProps(toastListProps);

const getUniqueId = (() => {
  let id = 0;
  return () => {
    id += 1;
    return id;
  };
})();

type ToastListOptionT = ToastParamsT & { id: number };

const optionList: Ref<Array<ToastListOptionT>> = ref([]);

const add = (params: ToastParamsT) => {
  const option = {
    id: getUniqueId(),
    ...params,
  };
  optionList.value.push(option);
  return option.id;
};

const remove = (idx: number) => {
  optionList.value.splice(idx, 1);
};

const removeAll = () => {
  optionList.value = [];
  isFunction(props.onDestroy) && props.onDestroy();
};

const close = (id: number) => {
  const idx = optionList.value.findIndex((option) => option.id === id);
  remove(idx);
};

const handleDurationEnd = (item: ToastListOptionT) => {
  const { id, onDurationEnd } = item;

  onDurationEnd?.();
  close(id);
};

const handleClose = (item: ToastListOptionT, ev?: MouseEvent) => {
  const { id, onClose } = item;
  onClose?.(ev);
  close(id);
};

defineExpose({ add, close, remove, removeAll });
</script>

<template>
  <div v-if="optionList.length" class="o-toast-list" :class="[`o-toast-list-${props.position}`]">
    <TransitionGroup name="o-toast-fade">
      <OToast
        v-for="item in optionList"
        :key="item.id"
        :duration="item.duration"
        @duration-end="handleDurationEnd(item)"
        @close="
          (ev) => {
            handleClose(item, ev);
          }
        "
      >
        <template v-if="isString(item.content)">{{ item.content }}</template>
        <component :is="item.content" v-else />
      </OToast>
    </TransitionGroup>
  </div>
</template>
