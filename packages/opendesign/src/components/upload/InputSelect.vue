<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  accept?: String;
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
  const files = (e.target as HTMLInputElement).files;
  if (files && files.length > 0) {
    emits('selected', files);
  }
};

/**
 * 选择文件
 * @param multiple 多选
 */
const select = (multiple: boolean) => {
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
    <input ref="multipleInputRef" type="file" class="o-upload-input" multiple :accept="props.accept" @change="onInputChange" />
    <input ref="inputRef" type="file" class="o-upload-input" :accept="props.accept" @change="onInputChange" />
  </div>
</template>
