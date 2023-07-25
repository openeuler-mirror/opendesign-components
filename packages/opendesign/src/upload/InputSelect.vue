<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  accept?: string;
  disabled?: boolean;
}>();
const emits = defineEmits<{
  (e: 'selected', files: FileList): void;
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const multipleInputRef = ref<HTMLInputElement | null>(null);

/**
 * 上传按钮
 */
const onInputChange = function (e: Event) {
  const target = e.target as HTMLInputElement;

  const files = target.files;
  if (files && files.length > 0) {
    emits('selected', files);
  }
  // 解决重复选择文件，无法触发change事件问题
  target.value = '';
};

/**
 * 选择文件
 * @param multiple 多选
 */
const select = (multiple: boolean) => {
  if (props.disabled) {
    return;
  }

  if (multiple) {
    multipleInputRef.value?.click();
  } else {
    inputRef.value?.click();
  }
};

defineExpose({
  select,
});
</script>
<template>
  <div class="o-upload-select-input">
    <input ref="multipleInputRef" type="file" class="o-upload-input" multiple :accept="props.accept" :disabled="props.disabled" @change="onInputChange" />
    <input ref="inputRef" type="file" class="o-upload-input" :accept="props.accept" :disabled="props.disabled" @change="onInputChange" />
  </div>
</template>
