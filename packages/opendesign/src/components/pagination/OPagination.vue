<script setup lang="ts">
import { computed, ref, nextTick, watch, Ref } from 'vue';
import { getPagerItem, PagerItemT, getSizeOptions } from './pagination';
import { OPopover } from '../popover';
import { OInputNumber } from '../input-number';
import { OSelect } from '../select';
import { OOption } from '../option';
import { IconChevronLeft, IconChevronRight, IconEllipsis } from '../_shared/icons';
import { paginationProps } from './types';
import { getRoundClass } from '../_shared/style-class';

const props = defineProps(paginationProps);

const round = getRoundClass(props, 'pagination');

const emits = defineEmits<{
  (e: 'update:pageSize', value: number): void;
  (e: 'update:page', value: number): void;
  (e: 'change', value: { page: number; pageSize: number }): void;
}>();

const Labels = {
  total: '总条数:',
  goto: '跳转至',
  page: '页',
  sizeLabel: '条/页',
};

let currentPageSize = ref(props.pageSize || props.pageSizes[0]);
let currentPage = ref(props.page);

const pageSizeList = getSizeOptions(props.pageSizes, Labels.sizeLabel, currentPageSize.value);
const defaultSizeLabel = currentPageSize.value + Labels.sizeLabel;

const totalPage = computed(() => Math.ceil(props.total / currentPageSize.value));

const pages = ref(getPagerItem(totalPage.value, currentPage.value, props.showPageCount));
watch(
  () => totalPage.value,
  () => {
    pages.value = getPagerItem(totalPage.value, currentPage.value, props.showPageCount);
  }
);

const updateCurrentPage = (page: number) => {
  if (isNaN(page)) {
    return;
  }

  if (page < 1) {
    currentPage.value = 1;
  } else if (page > totalPage.value) {
    currentPage.value = totalPage.value;
  } else {
    currentPage.value = page;
  }

  emits('update:page', currentPage.value);
  emits('change', {
    page: currentPage.value,
    pageSize: currentPageSize.value,
  });
  pages.value = getPagerItem(totalPage.value, currentPage.value, props.showPageCount);
};

const selectPage = (page: number | string) => {
  updateCurrentPage(page as number);
};

const clickPageBtn = (Increase: boolean) => {
  updateCurrentPage(Increase ? currentPage.value + 1 : currentPage.value - 1);
};

const moreClick = (more: PagerItemT[0]) => {
  const { value, list } = more;
  if (value === 'left' && list) {
    updateCurrentPage(list[list.length - 1]);
  } else if (value === 'right' && list) {
    updateCurrentPage(list[0]);
  }
};

const goToChange = (val: string | number) => {
  updateCurrentPage(Number(val));
};

const pageSizeChange = (val: string | number) => {
  // updateCurrentPage(Number(val));
  const currentIndex = currentPageSize.value * (currentPage.value - 1);
  const oldPage = currentPage.value;
  currentPageSize.value = Number(val);
  nextTick(() => {
    currentPage.value = Math.floor(currentIndex / currentPageSize.value) + 1;
    console.log(currentIndex, totalPage.value, currentPage.value, currentPageSize.value);

    pages.value = getPagerItem(totalPage.value, currentPage.value, props.showPageCount);

    if (oldPage !== currentPage.value) {
      emits('update:page', currentPage.value);
    }
    emits('update:pageSize', currentPageSize.value);
    emits('change', {
      page: currentPage.value,
      pageSize: currentPageSize.value,
    });
  });
};

defineExpose({
  pageCount: totalPage,
});
</script>
<template>
  <div class="o-pagination" :class="[`o-pagination-${props.variant}`, round.class.value]" :style="round.style.value">
    <div class="o-pagination-wrap">
      <!-- total -->
      <div class="o-pagination-total">{{ Labels.total }}&nbsp;{{ props.total }}</div>
      <!-- sizes -->
      <template v-if="!props.simple">
        <div class="o-pagination-size">
          <OSelect :model-value="currentPageSize" class="o-pagination-select" :default-label="defaultSizeLabel" :round="props.round" @change="pageSizeChange">
            <OOption v-for="item in pageSizeList" :key="item.value" :label="item.label" :value="item.value" />
          </OSelect>
        </div>
      </template>
      <!-- pager -->
      <div class="o-pagination-pager">
        <div
          class="o-pagination-prev"
          :class="{
            'is-disabled': currentPage === 1,
          }"
          tabindex="1"
          @click="() => currentPage !== 1 && clickPageBtn(false)"
        >
          <IconChevronLeft />
        </div>
        <div class="o-pagination-pages">
          <template v-if="props.simple">
            <div class="o-pagination-simple">
              <OInputNumber
                :model-value="currentPage"
                :clearable="false"
                class="o-pagination-input"
                controls="none"
                :min="1"
                :max="totalPage"
                :round="props.round"
                @change="goToChange"
              />&nbsp;/&nbsp;<span>{{ totalPage }}</span>
            </div>
          </template>
          <template v-else>
            <div
              v-for="item in pages"
              :key="item.value"
              class="o-pagination-item"
              :class="{ active: item.value === currentPage }"
              tabindex="1"
              @click="selectPage(item.value)"
            >
              <span v-if="!item.isMore">{{ item.value }}</span>
              <template v-else>
                <OPopover position="bottom" class="o-pagination-more-popup">
                  <div class="o-pagination-more-list">
                    <div v-for="p in item.list" :key="p" class="o-pagination-more-item">{{ p }}</div>
                  </div>
                  <template #target>
                    <span @click="moreClick(item)"><IconEllipsis /></span>
                  </template>
                </OPopover>
              </template>
            </div>
          </template>
        </div>
        <div
          class="o-pagination-next"
          :class="{
            'is-disabled': currentPage === totalPage,
          }"
          tabindex="1"
          @click="() => currentPage !== totalPage && clickPageBtn(true)"
        >
          <IconChevronRight />
        </div>
      </div>
      <!-- jumper -->
      <template v-if="props.showJumper && !props.simple">
        <div class="o-pagination-goto">
          {{ Labels.goto }}&nbsp;<OInputNumber
            :model-value="currentPage"
            class="o-pagination-input"
            controls="none"
            :min="1"
            :max="totalPage"
            :round="props.round"
            @change="goToChange"
          />
        </div>
      </template>
    </div>
  </div>
</template>
