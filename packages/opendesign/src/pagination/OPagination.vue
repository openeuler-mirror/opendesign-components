<script setup lang="ts">
import { computed, ref, nextTick, watch } from 'vue';
import { getPagerList, PagerItemT, getSizeOptions } from './pagination';
import { OPopover } from '../popover';
import { OInputNumber } from '../input-number';
import { OSelect, SelectValueT } from '../select';
import { OOption } from '../option';
import { IconChevronLeft, IconChevronRight, IconEllipsis, IconArrowRight, IconArrowLeft } from '../_utils/icons';
import { paginationProps } from './types';
import { getRoundClass } from '../_utils/style-class';
import { OIcon } from '../icon';
import { OOptionList } from '../option';
import { useI18n } from '../locale';

const props = defineProps(paginationProps);

const round = getRoundClass(props, 'pagination');

const emits = defineEmits<{
  (e: 'update:pageSize', value: number): void;
  (e: 'update:page', value: number): void;
  (e: 'change', value: { page: number; pageSize: number }): void;
}>();

const { t } = useI18n();

const simpleLayout = ['pager'];

let currentPageSize = ref(props.pageSize || props.pageSizes[0]);
let currentPage = ref(Math.round(props.page));

const pageSizeList = computed(() => {
  return getSizeOptions(currentPageSize.value, props.pageSizes, t('pagination.countPerPage'));
});

const defaultSizeLabel = computed(() => currentPageSize.value + t('pagination.countPerPage'));

const layout = computed(() => {
  return props.simple ? simpleLayout : props.layout;
});

const totalPage = computed(() => Math.ceil(props.total / currentPageSize.value));

const pages = ref(getPagerList(totalPage.value, currentPage.value, props.showPageCount));

watch(
  () => totalPage.value,
  () => {
    pages.value = getPagerList(totalPage.value, currentPage.value, props.showPageCount);
  }
);

const setCurrentPage = (page: number) => {
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
  pages.value = getPagerList(totalPage.value, currentPage.value, props.showPageCount);
};

const updateCurrentPage = (page: number) => {
  setCurrentPage(page);
  emits('update:page', currentPage.value);
  emits('change', {
    page: currentPage.value,
    pageSize: currentPageSize.value,
  });
};

watch(
  () => props.page,
  (val) => {
    if (val !== currentPage.value) {
      setCurrentPage(val);
    }
  }
);

const selectPage = (page: number | string) => {
  updateCurrentPage(page as number);
};

const clickPageBtn = (Increase: boolean) => {
  updateCurrentPage(Increase ? currentPage.value + 1 : currentPage.value - 1);
};

const moreClick = (more: PagerItemT) => {
  const { value, list } = more;
  if (value === 'left' && list) {
    updateCurrentPage(list[list.length - 1]);
  } else if (value === 'right' && list) {
    updateCurrentPage(list[0]);
  }
};

const goToChange = (val: string | number) => {
  updateCurrentPage(val as number);
};

const parseJumperVal = (val: string | number) => {
  return Math.round(Number(val));
};

const pageSizeChange = (val: SelectValueT) => {
  // updateCurrentPage(Number(val));
  const currentIndex = currentPageSize.value * (currentPage.value - 1);
  const oldPage = currentPage.value;
  currentPageSize.value = Number(val);
  nextTick(() => {
    currentPage.value = Math.floor(currentIndex / currentPageSize.value) + 1;

    pages.value = getPagerList(totalPage.value, currentPage.value, props.showPageCount);

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

const onMoreItemClick = (item: number) => {
  selectPage(item);
};

defineExpose({
  pageCount: totalPage,
});
</script>
<template>
  <div class="o-pagination" :class="[`o-pagination-${props.variant}`, round.class.value]" :style="round.style.value">
    <div class="o-pagination-wrap">
      <!-- total -->
      <div v-if="layout.includes('total') || $props.showTotal" class="o-pagination-total">
        <slot name="total" :total="props.total">{{ t('pagination.total', props.total) }}</slot>
      </div>
      <!-- sizes -->
      <template v-if="layout.includes('pagesize')">
        <div class="o-pagination-size">
          <OSelect
            v-if="pageSizeList.length > 1"
            :model-value="currentPageSize"
            class="o-pagination-select"
            :default-label="defaultSizeLabel"
            :round="props.round"
            :variant="props.variant"
            @change="pageSizeChange"
          >
            <OOption v-for="item in pageSizeList" :key="item.value" :label="item.label" :value="item.value" />
          </OSelect>
          <div v-else class="o-pagination-page-size">{{ pageSizeList[0].label }}</div>
        </div>
      </template>
      <!-- pager -->
      <div v-if="layout.includes('pager')" class="o-pagination-pager">
        <div
          class="o-pagination-prev"
          :class="{
            'is-disabled': currentPage === 1,
          }"
          tabindex="-1"
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
                :variant="props.variant"
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
              tabindex="-1"
              @click="selectPage(item.value)"
            >
              <span v-if="!item.isMore">{{ item.value }}</span>
              <OPopover position="bottom" wrap-class="o-options-popup" v-else :disabled="!props.showMore">
                <OOptionList scroller>
                  <OOption v-for="opt in item.list" :key="opt" class="o-pagination-more-item" :label="String(opt)" :value="opt" @click="onMoreItemClick(opt)" />
                </OOptionList>
                <template #target>
                  <span @click="moreClick(item)" class="o-pagination-more-icon-wrap">
                    <OIcon class="o-pagination-more-icon" :icon="IconEllipsis" />
                    <OIcon class="o-pagination-more-arrow-icon" :icon="item.value === 'left' ? IconArrowLeft : IconArrowRight" />
                  </span>
                </template>
              </OPopover>
            </div>
          </template>
        </div>
        <div
          class="o-pagination-next"
          :class="{
            'is-disabled': currentPage === totalPage,
          }"
          tabindex="-1"
          @click="() => currentPage !== totalPage && clickPageBtn(true)"
        >
          <IconChevronRight />
        </div>
      </div>
      <!-- jumper -->
      <template v-if="layout.includes('jumper')">
        <div class="o-pagination-goto">
          <span>{{ t('pagination.goto') }}</span>
          <OInputNumber
            :model-value="currentPage"
            class="o-pagination-input"
            controls="none"
            :min="1"
            :max="totalPage"
            :round="props.round"
            :variant="props.variant"
            :parse="parseJumperVal"
            @change="goToChange"
          />
        </div>
      </template>
    </div>
  </div>
</template>
