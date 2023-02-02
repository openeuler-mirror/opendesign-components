<script setup lang="ts">
import { ref } from 'vue';
import { isString } from '../_shared/utils';
import { getPagerItem } from './pagination';

interface PaginationPropT {
  /**
   * 支持选择的每页数据条数
   */
  pageSizes?: number[];
  /**
   * 每页数据条数
   */
  pageSize?: number;
  /**
   * 数据总条数
   */
  total: number;
  /**
   * 当前页码
   */
  currentPage?: number;
  /**
   * 显示页面数 > 3
   */
  showPageCount?: number;
}

const props = withDefaults(defineProps<PaginationPropT>(), {
  pageSizes: () => [6, 12, 24, 48],
  pageSize: 6,
  currentPage: 1,
  showPageCount: 9,
});
const emits = defineEmits<{
  (e: 'update:pageSize', value: number): void;
  (e: 'update:currentPage', value: number): void;
  (e: 'change', value: { current: number; size: number }): void;
}>();

let currentPageSize = ref(props.pageSize || props.pageSizes[0]);
let currentPage = ref(props.currentPage);

const totalPage = Math.ceil(props.total / currentPageSize.value);

const pages = ref(getPagerItem(totalPage, currentPage.value, props.showPageCount));

const selectPage = (page: number | string) => {
  if (isString(page)) {
    return;
  }
  currentPage.value = page;
  emits('update:currentPage', currentPage.value);
  emits('change', {
    current: currentPage.value,
    size: currentPageSize.value,
  });

  pages.value = getPagerItem(totalPage, currentPage.value, props.showPageCount);
};

const clickPageBtn = (Increase: boolean) => {
  currentPage.value = Increase ? currentPage.value + 1 : currentPage.value - 1;
  emits('update:currentPage', currentPage.value);
};
</script>
<template>
  <div class="o-pagination">
    <div class="o-pagination-wrap">
      <div class="o-pagination-prev" :class="{ disabled: currentPage === 1 }" @click="() => currentPage !== 1 && clickPageBtn(false)">&lt;</div>
      <div class="o-pagination-pages">
        <div v-for="item in pages" :key="item.value" class="o-pagination-item" :class="{ active: item.value === currentPage }" @click="selectPage(item.value)">
          <span v-if="!item.isMore">{{ item.value }}</span>
          <span v-else :title="item.list?.join(',')">...</span>
        </div>
      </div>
      <div class="o-pagination-next" :class="{ disabled: currentPage === totalPage }" @click="() => currentPage !== totalPage && clickPageBtn(true)">&gt;</div>
    </div>
  </div>
</template>
