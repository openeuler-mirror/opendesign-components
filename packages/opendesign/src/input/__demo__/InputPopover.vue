<script setup lang="ts">
import { ref } from 'vue';
import { OInput } from '../index';
import { OPopover } from '../../popover/index';
import '../../popover/style';

const codeValue = ref('');
</script>
<template>
  <div class="block">
    <h4>input + popover</h4>
    <div>
      <OPopover trigger="click">
        <template #target>
          <OInput v-model="codeValue" type="password" style="width: 200px" show-password-event="pointerdown" />
        </template>
        <div>this is popup content this is popup content this is popup content</div>
      </OPopover>
    </div>
    <br />
  </div>
</template>
<style lang="scss" scoped>
.code-verify-result {
  margin-top: 4px;
  margin-left: 16px;
  font-size: var(--o-font_size-tip2);
  line-height: var(--o-line_height-tip2);
}
.icon-success {
  color: var(--o-color-success1);
  font-size: var(--o-font_size-text1);
  margin-right: 2px;
}
</style>
