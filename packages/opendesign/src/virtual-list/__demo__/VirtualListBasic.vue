<script setup lang="ts">
import { ref } from 'vue';
import { OVirtualList } from '../index';
import '../style';

const list = ref(new Array(50).fill(1).map((_, idx) => idx + 1));
</script>
<template>
  <h4>Scroller basic</h4>
  <div class="row">
    <div style="width: 50%">
      <OVirtualList class="container" :list="list" :default-start-index="10" :item-size="80">
        <template #default="{ item, index }">
          <div :key="item" class="section" :class="`item-${index + 1}`">
            <span>Row:</span> <span>{{ item }}</span>
          </div>
        </template>
      </OVirtualList>
    </div>
  </div>

  <br />
</template>
<style lang="scss" scoped>
.scrollbar-wrapper {
  position: relative;
}
.container {
  width: 100%;
  height: 300px;
  border: 2px solid rgb(111, 45, 234);
  box-sizing: border-box;
}

section > div {
  flex: 0 1 30%;
}
.section {
  height: 80px;
  // width: 150%;
  display: flex;
  align-items: center;
  justify-content: center;
}

@for $i from 1 through 50 {
  .item-#{$i} {
    background-color: rgba(random(255), random(255), random(255), 1);
  }
}
</style>
