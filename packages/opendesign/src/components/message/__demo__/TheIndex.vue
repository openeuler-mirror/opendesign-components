<script setup lang="ts">
import '../style';
import MessageBasic from './MessageBasic.vue';
import MessageClosable from './MessageClosable.vue';
import MessageCustomContent from './MessageCustomContent.vue';
import MessageCustomIcon from './MessageCustomIcon.vue';
import MessageInline from './MessageInline.vue';
import MessageColorful from './MessageColorful.vue';
</script>

<template>
  <div class="page-demo">
    <MessageBasic />
    <MessageCustomContent />
    <MessageCustomIcon />
    <MessageClosable />
    <MessageInline />
    <MessageColorful />
  </div>
</template>
