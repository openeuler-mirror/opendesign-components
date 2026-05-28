<docs lang="md">
<!-- zh-CN -->

### 使用

范围选择器组件支持 `v-model:start` 和 `v-model:end` 绑定起止值：

- `ODateRangePicker` — 日期范围（年月日）
- `ODateTimeRangePicker` — 日期时间范围（年月日 + 时分秒）
- `OMonthRangePicker` — 月份范围（年月）
- `OYearRangePicker` — 年份范围

所有范围选择器均支持 `shortcut` slot 提供快捷入口，slot 提供 `setValue(start, end)` 和 `emitChange()` 方法。其他 props（size、color、variant、disabled、readonly、clearable、round 等）与单选选择器一致。

移动端提示：建议使用两个独立的选择器分别设置开始和结束时间，并通过 `minDate` / `maxDate` 约束来保证时间顺序，以获得更好的交互体验。

<!-- en-US -->

### Usage

Range picker components bind start and end values via `v-model:start` and `v-model:end`:

- `ODateRangePicker` — date range (year-month-day)
- `ODateTimeRangePicker` — datetime range (year-month-day + hour-minute-second)
- `OMonthRangePicker` — month range (year-month)
- `OYearRangePicker` — year range

All range pickers support `shortcut` slot for preset options. The slot exposes `setValue(start, end)` and `emitChange()`. Other props (size, color, variant, disabled, readonly, clearable, round, etc.) are consistent with single pickers.

Mobile Tip: We recommend using two separate pickers for start and end times, using `minDate` / `maxDate` constraints to ensure chronological order, for better interaction experience.
</docs>
<script setup lang="ts">
import { ref } from 'vue';
import dayjs from 'dayjs';
import {
  ODateRangePicker,
  ODateTimeRangePicker,
  OMonthRangePicker,
  OYearRangePicker,
  ODatePicker,
  ODateTimePicker,
  OMonthPicker,
  OYearPicker,
  OLink,
  OForm,
  OFormItem,
  type DatePickerRangeShortcutSlotProps,
} from '@opensig/opendesign';
import { useScreen } from '@/utils/useScreen';

const { lePadV } = useScreen();

const dateStart = ref<number>();
const dateEnd = ref<number>();
const datetimeStart = ref<number>();
const datetimeEnd = ref<number>();
const monthStart = ref<number>();
const monthEnd = ref<number>();
const yearStart = ref<number>();
const yearEnd = ref<number>();

type Shortcut = { label: string; handler: (slot: DatePickerRangeShortcutSlotProps) => void };

const dateShortcuts: Shortcut[] = [
  {
    label: '今天',
    handler: ({ setValue, emitChange }) => {
      setValue(dayjs().startOf('day').valueOf(), dayjs().endOf('day').valueOf());
      emitChange();
    },
  },
  {
    label: '最近7天',
    handler: ({ setValue, emitChange }) => {
      setValue(dayjs().subtract(6, 'day').startOf('day').valueOf(), dayjs().endOf('day').valueOf());
      emitChange();
    },
  },
  {
    label: '最近30天',
    handler: ({ setValue, emitChange }) => {
      setValue(dayjs().subtract(29, 'day').startOf('day').valueOf(), dayjs().endOf('day').valueOf());
      emitChange();
    },
  },
];

const monthShortcuts: Shortcut[] = [
  {
    label: '最近3个月',
    handler: ({ setValue, emitChange }) => {
      setValue(dayjs().subtract(2, 'month').startOf('month').valueOf(), dayjs().endOf('month').valueOf());
      emitChange();
    },
  },
  {
    label: '最近6个月',
    handler: ({ setValue, emitChange }) => {
      setValue(dayjs().subtract(5, 'month').startOf('month').valueOf(), dayjs().endOf('month').valueOf());
      emitChange();
    },
  },
  {
    label: '最近12个月',
    handler: ({ setValue, emitChange }) => {
      setValue(dayjs().subtract(11, 'month').startOf('month').valueOf(), dayjs().endOf('month').valueOf());
      emitChange();
    },
  },
];

const yearShortcuts: Shortcut[] = [
  {
    label: '最近3年',
    handler: ({ setValue, emitChange }) => {
      setValue(dayjs().subtract(2, 'year').startOf('year').valueOf(), dayjs().endOf('year').valueOf());
      emitChange();
    },
  },
  {
    label: '最近5年',
    handler: ({ setValue, emitChange }) => {
      setValue(dayjs().subtract(4, 'year').startOf('year').valueOf(), dayjs().endOf('year').valueOf());
      emitChange();
    },
  },
];
</script>
<template>
  <OForm :layout="lePadV ? 'v' : 'h'" label-width="180px">
    <!-- ODateRangePicker -->
    <template v-if="!lePadV">
      <OFormItem label="ODateRangePicker">
        <ODateRangePicker v-model:start="dateStart" v-model:end="dateEnd" clearable>
          <template #shortcut="{ setValue, emitChange }">
            <OLink v-for="item in dateShortcuts" :key="item.label" :hover-underline="false" @click="item.handler({ setValue, emitChange })">{{
              item.label
            }}</OLink>
          </template>
        </ODateRangePicker>
        <template #extra>
          start: {{ dateStart }} <u v-if="dateStart">{{ dayjs(dateStart).format('YYYY-MM-DD HH:mm:ss') }}</u> &nbsp; end: {{ dateEnd }}
          <u v-if="dateEnd">{{ dayjs(dateEnd).format('YYYY-MM-DD HH:mm:ss') }}</u>
        </template>
      </OFormItem>
    </template>
    <template v-else>
      <OFormItem label="开始">
        <ODatePicker v-model="dateStart" :max-date="dateEnd" clearable />
        <template #extra
          >{{ dateStart }} <u v-if="dateStart">{{ dayjs(dateStart).format('YYYY-MM-DD HH:mm:ss') }}</u></template
        >
      </OFormItem>
      <OFormItem label="结束">
        <ODatePicker v-model="dateEnd" :min-date="dateStart" clearable />
        <template #extra
          >{{ dateEnd }} <u v-if="dateEnd">{{ dayjs(dateEnd).format('YYYY-MM-DD HH:mm:ss') }}</u></template
        >
      </OFormItem>
    </template>

    <!-- ODateTimeRangePicker -->
    <template v-if="!lePadV">
      <OFormItem label="ODateTimeRangePicker">
        <ODateTimeRangePicker v-model:start="datetimeStart" v-model:end="datetimeEnd" clearable>
          <template #shortcut="{ setValue, emitChange }">
            <OLink v-for="item in dateShortcuts" :key="item.label" :hover-underline="false" @click="item.handler({ setValue, emitChange })">{{
              item.label
            }}</OLink>
          </template>
        </ODateTimeRangePicker>
        <template #extra>
          start: {{ datetimeStart }} <u v-if="datetimeStart">{{ dayjs(datetimeStart).format('YYYY-MM-DD HH:mm:ss') }}</u> &nbsp; end: {{ datetimeEnd }}
          <u v-if="datetimeEnd">{{ dayjs(datetimeEnd).format('YYYY-MM-DD HH:mm:ss') }}</u>
        </template>
      </OFormItem>
    </template>
    <template v-else>
      <OFormItem label="开始">
        <ODateTimePicker v-model="datetimeStart" :max-date="datetimeEnd" clearable />
        <template #extra
          >{{ datetimeStart }} <u v-if="datetimeStart">{{ dayjs(datetimeStart).format('YYYY-MM-DD HH:mm:ss') }}</u></template
        >
      </OFormItem>
      <OFormItem label="结束">
        <ODateTimePicker v-model="datetimeEnd" :min-date="datetimeStart" clearable />
        <template #extra
          >{{ datetimeEnd }} <u v-if="datetimeEnd">{{ dayjs(datetimeEnd).format('YYYY-MM-DD HH:mm:ss') }}</u></template
        >
      </OFormItem>
    </template>

    <!-- OMonthRangePicker -->
    <template v-if="!lePadV">
      <OFormItem label="OMonthRangePicker">
        <OMonthRangePicker v-model:start="monthStart" v-model:end="monthEnd" clearable>
          <template #shortcut="{ setValue, emitChange }">
            <OLink v-for="item in monthShortcuts" :key="item.label" :hover-underline="false" @click="item.handler({ setValue, emitChange })">{{
              item.label
            }}</OLink>
          </template>
        </OMonthRangePicker>
        <template #extra>
          start: {{ monthStart }} <u v-if="monthStart">{{ dayjs(monthStart).format('YYYY-MM-DD HH:mm:ss') }}</u> &nbsp; end: {{ monthEnd }}
          <u v-if="monthEnd">{{ dayjs(monthEnd).format('YYYY-MM-DD HH:mm:ss') }}</u>
        </template>
      </OFormItem>
    </template>
    <template v-else>
      <OFormItem label="开始">
        <OMonthPicker
          v-model="monthStart"
          :disabled-year="({ year }) => !!monthEnd && year > dayjs(monthEnd).year()"
          :disabled-month="({ year, month }) => !!monthEnd && year === dayjs(monthEnd).year() && month > dayjs(monthEnd).month()"
          clearable
        />
        <template #extra
          >{{ monthStart }} <u v-if="monthStart">{{ dayjs(monthStart).format('YYYY-MM-DD HH:mm:ss') }}</u></template
        >
      </OFormItem>
      <OFormItem label="结束">
        <OMonthPicker
          v-model="monthEnd"
          :disabled-year="({ year }) => !!monthStart && year < dayjs(monthStart).year()"
          :disabled-month="({ year, month }) => !!monthStart && year === dayjs(monthStart).year() && month < dayjs(monthStart).month()"
          clearable
        />
        <template #extra
          >{{ monthEnd }} <u v-if="monthEnd">{{ dayjs(monthEnd).format('YYYY-MM-DD HH:mm:ss') }}</u></template
        >
      </OFormItem>
    </template>

    <!-- OYearRangePicker -->
    <template v-if="!lePadV">
      <OFormItem label="OYearRangePicker">
        <OYearRangePicker v-model:start="yearStart" v-model:end="yearEnd" clearable>
          <template #shortcut="{ setValue, emitChange }">
            <OLink v-for="item in yearShortcuts" :key="item.label" :hover-underline="false" @click="item.handler({ setValue, emitChange })">{{
              item.label
            }}</OLink>
          </template>
        </OYearRangePicker>
        <template #extra>
          start: {{ yearStart }} <u v-if="yearStart">{{ dayjs(yearStart).format('YYYY-MM-DD HH:mm:ss') }}</u> &nbsp; end: {{ yearEnd }}
          <u v-if="yearEnd">{{ dayjs(yearEnd).format('YYYY-MM-DD HH:mm:ss') }}</u>
        </template>
      </OFormItem>
    </template>
    <template v-else>
      <OFormItem label="开始">
        <OYearPicker v-model="yearStart" :disabled-year="({ year }) => !!yearEnd && year > dayjs(yearEnd).year()" clearable />
        <template #extra
          >{{ yearStart }} <u v-if="yearStart">{{ dayjs(yearStart).format('YYYY-MM-DD HH:mm:ss') }}</u></template
        >
      </OFormItem>
      <OFormItem label="结束">
        <OYearPicker v-model="yearEnd" :disabled-year="({ year }) => !!yearStart && year < dayjs(yearStart).year()" clearable />
        <template #extra
          >{{ yearEnd }} <u v-if="yearEnd">{{ dayjs(yearEnd).format('YYYY-MM-DD HH:mm:ss') }}</u></template
        >
      </OFormItem>
    </template>
  </OForm>
</template>
