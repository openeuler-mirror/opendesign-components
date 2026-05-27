import { computed, MaybeRefOrGetter, onMounted, Ref, ref, toValue } from 'vue';
import dayjs, { Dayjs } from 'dayjs';

import { isArray } from '../_utils/is';

import { DisabledDateFn } from './types';
import { computeRangeState, RangeStateResult } from './utils';

/** 日历单元格数据结构 */
export interface CalendarCell {
  /** 该单元格对应的 Dayjs 日期对象 */
  date: Dayjs;
  /** 该单元格在月份中的日期数字 */
  day: number;
  /** 是否属于当前显示月份 */
  isCurrentMonth: boolean;
  /** 是否是今天 */
  isToday: boolean;
  /** 是否被选中 */
  isSelected: boolean;
  /** 是否被禁用 */
  isDisabled: boolean;
  /** 是否是范围选择的起始日期 */
  isRangeStart: boolean;
  /** 是否是范围选择的结束日期 */
  isRangeEnd: boolean;
  /** 是否处于范围选择的区间内（不含端点） */
  isInRange: boolean;
}

/** useCalendar 组合式函数的参数 */
interface UseCalendarParams {
  /** 当前显示的年份 */
  displayYear: Ref<number>;
  /** 当前显示的月份（0-11） */
  displayMonth: Ref<number>;
  /** 已选中的日期 */
  selectedDate: MaybeRefOrGetter<Dayjs | null | (Dayjs | null)[]>;
  /** 一周的起始星期几（0=周日，1=周一，...） */
  dayStartOfWeek: Ref<number>;
  /** 自定义禁用日期的函数，month 为 0-indexed（0=一月，11=十二月） */
  disabledDate?: Ref<DisabledDateFn | undefined>;
  /** 可选范围的最小日期 */
  minDate?: Ref<Dayjs | null>;
  /** 可选范围的最大日期 */
  maxDate?: Ref<Dayjs | null>;
  /** 已确认的范围起始日期（排序后，仅选择完成时有值） */
  rangeStart?: Ref<Dayjs | null>;
  /** 已确认的范围结束日期（排序后，仅选择完成时有值） */
  rangeEnd?: Ref<Dayjs | null>;
  /** 第一次点击的锚点日期（选择进行中时有值，顺序无意义） */
  anchorDate?: Ref<Dayjs | null>;
  /** 鼠标悬停的日期（用于范围选择的实时预览） */
  hoverDate?: Ref<Dayjs | null>;
}

const NO_RANGE: RangeStateResult = { isRangeStart: false, isRangeEnd: false, isInRange: false };

interface RangeDeps {
  /** 已确认范围起始 */
  rangeStart?: Ref<Dayjs | null>;
  /** 已确认范围结束 */
  rangeEnd?: Ref<Dayjs | null>;
  /** 选择进行中的锚点 */
  anchorDate?: Ref<Dayjs | null>;
  /** 当前悬停日期 */
  hoverDate?: Ref<Dayjs | null>;
}

/**
 * 将可选 Ref 依赖解析为 computeRangeState 所需的原始值
 * @param rangeStart - 范围起始 Ref
 * @param rangeEnd - 范围结束 Ref
 * @param anchorDate - 锚点 Ref
 * @param hoverDate - 悬停 Ref
 * @returns 解析后的原始值对象
 */
function resolveRangeDeps({ rangeStart, rangeEnd, anchorDate, hoverDate }: RangeDeps) {
  return {
    rangeStart: rangeStart?.value || null,
    rangeEnd: rangeEnd?.value || null,
    anchorDate: anchorDate?.value || null,
    hoverDate: hoverDate?.value || null,
  };
}

/**
 * 根据选中状态计算单元格是否被选中
 * @param date - 格子日期
 * @param selectedValue - 当前选中值（单选或多选）
 * @returns 是否选中
 */
function computeIsSelected(date: Dayjs, selectedValue: Dayjs | null | (Dayjs | null)[]): boolean {
  if (isArray(selectedValue)) {
    return selectedValue.some((v) => v && date.isSame(v));
  }
  return selectedValue ? date.isSame(selectedValue, 'day') : false;
}

interface CellDisabledParams {
  /** 可选范围最小日期 */
  minDate: Dayjs | null;
  /** 可选范围最大日期 */
  maxDate: Dayjs | null;
  /** 自定义禁用日期函数 */
  disabledDateFn: DisabledDateFn | undefined;
}

/**
 * 判断单元格是否被禁用（超出 min/max 范围或被自定义函数禁用）
 * @param date - 格子日期
 * @param minDate - 可选范围最小日期
 * @param maxDate - 可选范围最大日期
 * @param disabledDateFn - 自定义禁用日期函数
 * @returns 是否禁用
 */
function computeIsDisabled(date: Dayjs, { minDate, maxDate, disabledDateFn }: CellDisabledParams): boolean {
  if (minDate && date.isBefore(minDate, 'day')) return true;
  if (maxDate && date.isAfter(maxDate, 'day')) return true;
  if (disabledDateFn?.({ date: date.toDate(), year: date.year(), month: date.month(), day: date.date() })) return true;
  return false;
}

/**
 * 日历数据组合式函数
 * 根据显示的年月，生成 6 行 × 7 列的日历格子数据，
 * 首尾不足部分由上月/下月的日期填充。
 */
export function useCalendar(params: UseCalendarParams) {
  const { displayYear, displayMonth, selectedDate, dayStartOfWeek, disabledDate, minDate, maxDate, rangeStart, rangeEnd, anchorDate, hoverDate } = params;

  // SSR 期间为 null，mount 后才赋值，避免服务端/客户端时间戳不一致导致水合报错
  const today = ref<Dayjs | null>(null);
  onMounted(() => {
    today.value = dayjs();
  });

  /** 日历格子二维数组（6行 × 7列） */
  const rows = computed<CalendarCell[][]>(() => {
    const year = displayYear.value;
    const month = displayMonth.value;
    // 当前月第一天，时间固定为 00:00:00 确保 valueOf() 在每次重算时稳定（避免 key 变化导致 DOM 重建）
    const firstDay = dayjs().year(year).month(month).date(1).startOf('day');
    const daysInMonth = firstDay.daysInMonth();

    // 第一天是星期几
    const startDow = firstDay.day();
    // 需要在第一天前填充的上月天数
    const leadingBlanks = (startDow - dayStartOfWeek.value + 7) % 7;

    const todayVal = today.value;
    const cells: CalendarCell[] = [];

    // 填充上个月的尾部日期
    const prevMonth = firstDay.subtract(1, 'month');
    const prevDays = prevMonth.daysInMonth();
    for (let i = leadingBlanks - 1; i >= 0; i--) {
      const d = prevMonth.date(prevDays - i);
      cells.push(makeCell(d, false, todayVal));
    }

    // 填充当前月的所有日期
    for (let i = 1; i <= daysInMonth; i++) {
      const d = firstDay.date(i);
      cells.push(makeCell(d, true, todayVal));
    }

    // 填充下个月的头部日期，确保总格子数为 42（6行×7列）
    const remaining = 42 - cells.length;
    const nextMonth = firstDay.add(1, 'month');
    for (let i = 1; i <= remaining; i++) {
      const d = nextMonth.date(i);
      cells.push(makeCell(d, false, todayVal));
    }

    // 将一维数组按每行 7 个切分为二维数组
    const result: CalendarCell[][] = [];
    for (let r = 0; r < 6; r++) {
      result.push(cells.slice(r * 7, r * 7 + 7));
    }
    return result;
  });

  /**
   * 构造单个日历格子的状态数据
   * @param date 该格子对应的日期
   * @param isCurrentMonth 是否属于当前月
   * @param _today 今天的日期（用于判断 isToday）
   */
  function makeCell(date: Dayjs, isCurrentMonth: boolean, _today: Dayjs | null): CalendarCell {
    const isToday = _today ? date.isSame(_today, 'day') : false;
    const isSelected = computeIsSelected(date, toValue(selectedDate));
    const isDisabled = computeIsDisabled(date, {
      minDate: minDate?.value || null,
      maxDate: maxDate?.value || null,
      disabledDateFn: disabledDate?.value,
    });
    const rangeState = isCurrentMonth
      ? computeRangeState({ cell: date, unit: 'day', ...resolveRangeDeps({ rangeStart, rangeEnd, anchorDate, hoverDate }) })
      : NO_RANGE;
    return { date, day: date.date(), isCurrentMonth, isToday, isSelected, isDisabled, ...rangeState };
  }

  /**
   * 表头星期数组，根据 dayStartOfWeek 偏移排列
   * 例如 dayStartOfWeek=1（周一）时返回 [1,2,3,4,5,6,0]
   */
  const weekDayHeaders = computed(() => {
    const base = [0, 1, 2, 3, 4, 5, 6];
    const offset = dayStartOfWeek.value;
    return [...base.slice(offset), ...base.slice(0, offset)];
  });

  return { rows, weekDayHeaders };
}
