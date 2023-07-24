<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { Labels, getDate, getDayListByWeek, isSameDay, isSameMonth } from './date';
import type { DateT } from './date';
import { chunk } from '../_utils/helper';
import { startOfMonth } from 'date-fns';

interface CellT {
  data: DateT;
  outView: boolean;
}
const props = withDefaults(
  defineProps<{
    modelValue?: Date;
  }>(),
  {
    modelValue: undefined,
  }
);

const emits = defineEmits<{
  (e: 'update:modelValue', value: Date): void;
  (e: 'cell:click', value: CellT): void;
}>();

const viewMonthDate = ref<DateT>();
watch(
  () => props.modelValue,
  (v: Date | undefined) => {
    viewMonthDate.value = getDate(startOfMonth(v || new Date()));
  },
  {
    immediate: true,
  }
);

const dayListByWeek = computed(() => {
  if (!viewMonthDate.value) {
    return [];
  }

  const dayList = getDayListByWeek(viewMonthDate.value);

  const list: CellT[] = dayList.map((item) => {
    const isOutView = viewMonthDate.value ? !isSameMonth(item, viewMonthDate.value) : false;
    return {
      data: item,
      outView: isOutView,
      today: isSameDay(item, getDate(new Date())),
    };
  });
  return chunk(list, 7);
});

const selectDay = (cell: CellT) => {
  emits('cell:click', cell);
};
</script>
<template>
  <div class="o-calendar">
    <div class="o-calendar">
      <div v-for="item in Labels.weeks" :key="item" class="o-ch-cell">{{ item }}</div>
    </div>
    <div v-for="(week, idx) in dayListByWeek" :key="idx" class="o-calendar-week">
      <div
        v-for="item in week"
        :key="item.data.day"
        class="o-calendar-cell"
        :class="{
          'o-calendar-cell-out-view': item.outView,
          'o-calendar-cell-today': item.today,
        }"
        @click="selectDay(item)"
      >
        <div class="o-calendar-cell-val">{{ item.data.days }}</div>
      </div>
    </div>
  </div>
</template>
