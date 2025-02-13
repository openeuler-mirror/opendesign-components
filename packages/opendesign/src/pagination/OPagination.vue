<script setup lang="ts">
import { computed, ref, watch } from 'vue';
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
  (e: 'change', newValue: { page: number; pageSize: number }, oldValue: { page: number; pageSize: number }): void;
}>();

const { t } = useI18n();

const simpleLayout = ['pager'];
const pages = ref<ReturnType<typeof getPagerList>>([]);
// 每页数据项
const pageSize = defineModel<number>('pageSize');

// 纠正传入的值
if (!pageSize.value) {
  pageSize.value = props.pageSizes[0];
} else if (!props.pageSizes.includes(pageSize.value)) {
  log.warn(`pageSize[${pageSize.value}] is not in pageSizes[${props.pageSizes}]! set to first value of pageSizes[${props.pageSizes[0]}]`);
  pageSize.value = props.pageSizes[0];
}

const totalPage = computed(() => Math.ceil(props.total / pageSize.value!));

// 当前页码
const pageVal = defineModel<number>('page');

// 纠正传入的值
if (!pageVal.value) {
  pageVal.value = 1;
}

// 刷新页码列表
pages.value = getPagerList(totalPage.value, pageVal.value, props.showPageCount);

const pageSizeList = computed(() => {
  return getSizeOptions(props.pageSizes, t('pagination.countPerPage'), pageSize.value);
});

const defaultSizeLabel = computed(() => pageSize.value + t('pagination.countPerPage'));

const layout = computed(() => {
  return props.simple ? simpleLayout : props.layout;
});

watch(
  () => [totalPage.value, pageVal.value],
  () => {
    pages.value = getPagerList(totalPage.value, pageVal.value, props.showPageCount);
  }
);

// 处理page和pageSize变化
const updatePageAndPageSize = (page: number, size: number) => {
  let changed = false;
  const oldPage = pageVal.value!;
  const oldPageSize = pageSize.value!;

  if (pageVal.value !== page) {
    changed = true;
    pageVal.value = page;
  }
  if (pageSize.value !== size) {
    changed = true;
    pageSize.value = size;
  }

  if (changed) {
    emits('change', { page, pageSize: size }, { page: oldPage, pageSize: oldPageSize });
  }
};

const selectPage = (page: number | string) => {
  updatePageAndPageSize(Number(page), pageSize.value!);
};
// 点击页码按钮（Increase：true 上一页、false下一页）
const clickPageBtn = (Increase: boolean) => {
  updatePageAndPageSize(Increase ? pageVal.value! + 1 : pageVal.value! - 1, pageSize.value!);
};
// 点击收起的更多箭头
const moreClick = (more: PagerItemT) => {
  const { value, list } = more;
  if (!list || typeof value !== 'string') {
    return;
  }

  if (value === 'left') {
    updatePageAndPageSize(list[list.length - 1], pageSize.value!);
  } else if (value === 'right') {
    updatePageAndPageSize(list[0], pageSize.value!);
  }
  // 隐藏浮层
  moreVisible.value[value] = false;
};
// 通过输入框指定跳转到某一页
const goToPage = (val: string | number) => {
  let v = Math.round(Number(val));
  if (v < 1 || isNaN(v)) {
    v = 1;
  } else if (v > totalPage.value) {
    v = totalPage.value;
  }
  updatePageAndPageSize(v, pageSize.value!);
};

const selectPageSize = (val: SelectValueT) => {
  const size = Number(val);
  if (!size) {
    return;
  }
  const currentIndex = pageSize.value! * (pageVal.value! - 1);

  const newPage = Math.floor(currentIndex / size!) + 1;

  updatePageAndPageSize(newPage, size);
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

const validateInput = (value: number) => {
  return value === Math.round(Number(value));
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
            :model-value="pageSize"
            class="o-pagination-select"
            :default-label="defaultSizeLabel"
            :round="props.round"
            :variant="props.variant"
            @change="selectPageSize"
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
            'is-disabled': pageVal === 1,
          }"
          tabindex="-1"
          @click="() => pageVal !== 1 && clickPageBtn(false)"
        >
          <IconChevronLeft />
        </div>
        <div class="o-pagination-pages">
          <template v-if="props.simple">
            <div class="o-pagination-simple">
              <OInputNumber
                :model-value="pageVal"
                :clearable="false"
                class="o-pagination-input"
                controls="none"
                :min="1"
                :max="totalPage"
                :round="props.round"
                :variant="props.variant"
                :empty-value="pageVal"
                :validate="validateInput"
                @change="goToPage"
              />&nbsp;/&nbsp;<span>{{ totalPage }}</span>
            </div>
          </template>
          <template v-else>
            <div
              v-for="item in pages"
              :key="item.value"
              class="o-pagination-item"
              :class="{ active: item.value === pageVal }"
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
            'is-disabled': pageVal === totalPage,
          }"
          tabindex="-1"
          @click="() => pageVal !== totalPage && clickPageBtn(true)"
        >
          <IconChevronRight />
        </div>
      </div>
      <!-- jumper -->
      <template v-if="layout.includes('jumper')">
        <div class="o-pagination-goto">
          <span>{{ t('pagination.goto') }}</span>
          <OInputNumber
            :model-value="pageVal"
            class="o-pagination-input"
            controls="none"
            :min="1"
            :max="totalPage"
            :round="props.round"
            :variant="props.variant"
            :validate="validateInput"
            :empty-value="pageVal"
            @change="goToPage"
          />
        </div>
      </template>
    </div>
  </div>
</template>
