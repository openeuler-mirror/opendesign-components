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
import { OVirtualList } from '../virtual-list';
import { log } from '../_utils/log';

const props = defineProps(paginationProps);

const round = getRoundClass(props, 'pagination');

const emits = defineEmits<{
  (e: 'change', value: { page: number; pageSize?: number }): void;
}>();

const { t } = useI18n();

const simpleLayout = ['pager'];

// 每页数据项
const pageSize = defineModel<number>('pageSize');
// 当前页码
const pageVal = defineModel<number>('page');
// 内部记录当前页数
const currentPage = computed(() => {
  const p = Number(pageVal.value);
  if (p < 1 || isNaN(p)) {
    return 1;
  } else if (p > totalPage.value) {
    return totalPage.value;
  } else {
    return p;
  }
});

const currentPageSize = computed(() => {
  if (!pageSize.value || !props.pageSizes.includes(pageSize.value)) {
    log.warn('pageSize is not in pageSizes!');
  }
  return pageSize.value;
});

const pageSizeList = computed(() => {
  return getSizeOptions(props.pageSizes, t('pagination.countPerPage'), pageSize.value);
});

const defaultSizeLabel = computed(() => currentPageSize.value + t('pagination.countPerPage'));

const layout = computed(() => {
  return props.simple ? simpleLayout : props.layout;
});

const totalPage = computed(() => Math.ceil(props.total / (pageSize.value ?? props.pageSizes[0])));

const pages = ref(getPagerList(totalPage.value, currentPage.value, props.showPageCount));

watch(
  () => totalPage.value,
  () => {
    pages.value = getPagerList(totalPage.value, currentPage.value, props.showPageCount);
  }
);
watch(
  () => currentPage.value,
  () => {
    pages.value = getPagerList(totalPage.value, currentPage.value, props.showPageCount);
  }
);

const updateCurrentPage = (page: number) => {
  pageVal.value = page;

  emits('change', {
    page: currentPage.value,
    pageSize: pageSize.value,
  });
};

const selectPage = (page: number | string) => {
  updateCurrentPage(Number(page));
};

const clickPageBtn = (Increase: boolean) => {
  updateCurrentPage(Increase ? currentPage.value + 1 : currentPage.value - 1);
};
// 点击收起的更多箭头
const moreClick = (more: PagerItemT) => {
  const { value, list } = more;
  if (!list || typeof value !== 'string') {
    return;
  }

  if (value === 'left') {
    updateCurrentPage(list[list.length - 1]);
  } else if (value === 'right') {
    updateCurrentPage(list[0]);
  }
  // 隐藏浮层
  moreVisible.value[value] = false;
};

const goToChange = (val: string | number) => {
  updateCurrentPage(Number(val));
};

const parseJumperVal = (val: string | number) => {
  return Math.round(Number(val));
};

const pageSizeChange = (val: SelectValueT) => {
  const currentIndex = (pageSize.value ?? props.pageSizes[0]) * (currentPage.value - 1);
  pageSize.value = Number(val);
  if (!pageSize.value) {
    return;
  }
  nextTick(() => {
    const newPage = Math.floor(currentIndex / pageSize.value!) + 1;

    pageVal.value = newPage;
    pages.value = getPagerList(totalPage.value, currentPage.value, props.showPageCount);

    emits('change', {
      page: currentPage.value,
      pageSize: currentPageSize.value,
    });
  });
};

const moreVisible = ref<{ left: boolean; right: boolean }>({
  left: false,
  right: false,
});

// 选择弹层中的页码
const onMoreItemClick = (item: number, value: number | 'left' | 'right') => {
  selectPage(item);

  // 点击选择页码后，隐藏弹层
  if (value === 'left' || value === 'right') {
    moreVisible.value[value] = false;
  }
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
              <OPopover
                position="bottom"
                wrap-class="o-options-popup"
                v-else
                :disabled="!props.showMore"
                v-model:visible="moreVisible[item.value as 'left'|'right']"
              >
                <OOptionList scrollbar>
                  <!-- 当下拉项大于50，采用虚拟列表 -->
                  <template v-if="item.list && item.list.length > 50">
                    <OVirtualList :list="item.list" class="o-pagination-virtual-more-list" :scrollbar="{ showType: 'hover', size: 'small' }">
                      <template #default="data">
                        <OOption
                          :key="data.item"
                          class="o-pagination-more-item"
                          :label="String(data.item)"
                          :value="data.item"
                          @click="onMoreItemClick(data.item, item.value)"
                        />
                      </template>
                    </OVirtualList>
                  </template>
                  <template v-else-if="item.list">
                    <OOption
                      v-for="opt in item.list"
                      :key="opt"
                      class="o-pagination-more-item"
                      :label="String(opt)"
                      :value="opt"
                      @click="onMoreItemClick(opt, item.value)"
                    />
                  </template>
                </OOptionList>
                <template #target>
                  <span @click.stop="moreClick(item)" class="o-pagination-more-icon-wrap">
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
