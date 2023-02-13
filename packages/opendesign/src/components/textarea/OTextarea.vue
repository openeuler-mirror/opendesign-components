<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { defaultSize, defaultShape, SizeT, ShapeT } from '../_shared/global';
import { isFunction } from '../_shared/is';
import { IconX } from '../icons';
import { trigger } from '../_shared/event';
import { toInputString } from './textarea';
import { OResizeObserver } from '../resize-observer';

interface InputPropT {
  /**
   * 下拉框的值
   * v-model
   */
  modelValue?: string;
  /**
   * 下拉框的默认值
   * 非受控
   */
  defaultValue?: string;
  /**
   * 大小
   */
  size?: SizeT;
  /**
   * 形状
   */
  shape?: ShapeT;
  /**
   * 提示文本
   */
  placeholder?: string;
  /**
   * 状态，显示指定，用于非表单场景
   */
  status?: 'success' | 'warning' | 'error';
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 是否只读
   */
  readonly?: boolean;
  /**
   * 是否可以清除
   */
  clearable?: boolean;
  /**
   * 是否支持调整尺寸
   */
  resize?: 'both' | 'horizontal' | 'vertical' | 'none';
  /**
   * 显示的行数
   */
  rows?: number;
  /**
   * 显示的行数
   */
  cols?: number;
  /**
   * 最大字符长度
   */
  maxLength?: number;
  /**
   * 超过最大字符长度时是否允许输入
   */
  inputOutLimit?: boolean;
  /**
   * 是否自动计算高度
   */
  autoHeight?: boolean;
  /**
   * 获取长度方法
   */
  getLength?: (val: string) => number;
  /**
   * 高度自适应
   */
  autoResize?: boolean;
}
const props = withDefaults(defineProps<InputPropT>(), {
  modelValue: undefined,
  defaultValue: '',
  size: undefined,
  shape: undefined,
  placeholder: '',
  clearable: true,
  status: undefined,
  resize: 'vertical',
  rows: 3,
  cols: 20,
  maxLength: undefined,
  getLength: undefined,
  inputOutLimit: true,
});

const emits = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'change', value: string): void;
  (e: 'input', value: string, evt: Event): void;
  (e: 'blur', value: string, evt: FocusEvent): void;
  (e: 'focus', value: string, evt: FocusEvent): void;
  (e: 'clear', evt: Event): void;
  (e: 'keydown', value: string, evt: KeyboardEvent): void;
}>();

const textareaHeight = ref();

const textareaRef = ref<HTMLElement | null>(null);
// 数字输入框当前值
const realValue = ref(toInputString(props.modelValue ?? props.defaultValue));
// 当前textarea文本值
const textareaText = ref(realValue.value);
// 监听属性变化，刷新值
watch(
  () => props.modelValue,
  (val) => {
    // console.log('watch', val);
    realValue.value = toInputString(val);
    textareaText.value = `${realValue.value}\r\n`;
  }
);

const resizeValue = computed(() => {
  return props.autoHeight || props.disabled ? 'none' : props.resize;
});

const getValueLength = (val: string) => {
  if (isFunction(props.getLength)) {
    return props.getLength(val);
  }
  return val.length ?? 0;
};
// 是否超出最大长度限制
const currentLength = computed(() => getValueLength(realValue.value));
const isOutLengthLimit = computed(() => (props.maxLength !== undefined ? currentLength.value > props.maxLength : false));

const status = computed(() => {
  return props.status ?? (isOutLengthLimit.value ? 'error' : '');
});

// 是否聚焦状态
const isFocus = ref(false);
let lastValue: string = realValue.value;

const updateValue = (val: string) => {
  emits('update:modelValue', val);

  if (lastValue !== val) {
    emits('change', val);
    lastValue = val;
  }
  return val;
};

// 正在输入中文，处理输入过程中触发input事件
let isComposing = false;
// 解决点击组件内的非textarea区域触发focus、blur问题
let clickInside = false;

// 开始中文输入
const onCompositionStart = () => {
  isComposing = true;
};
// 结束中文输入
const onCompositionEnd = (e: Event) => {
  if (!isComposing) {
    return;
  }

  isComposing = false;
  trigger(e.target as HTMLElement, 'input');
};

const onInput = (e: Event) => {
  if (isComposing) {
    return;
  }
  const val = (e.target as HTMLInputElement)?.value;
  emits('input', val, e);
  textareaText.value = `${val}\r\n`;

  emits('update:modelValue', val);
};

const onFocus = (e: FocusEvent) => {
  clickInside = false;
  if (isFocus.value) {
    return;
  }
  isFocus.value = true;
  emits('focus', realValue.value, e);
};

const onBlur = (e: FocusEvent) => {
  if (clickInside) {
    clickInside = false;
    return;
  }
  isFocus.value = false;
  const val = (e.target as HTMLInputElement)?.value;
  const v = updateValue(val);
  emits('blur', v, e);
};

const onKeyDown = (e: KeyboardEvent) => {
  if (!isComposing) {
    const val = (e.target as HTMLInputElement)?.value;
    emits('keydown', val, e);
  }
};
// 清除值
const clearClick = (e: Event) => {
  updateValue('');
  emits('clear', e);
};
const onMouseDown = (e: MouseEvent) => {
  if ((e.target as HTMLInputElement) !== textareaRef.value) {
    clickInside = true;
  }
};

const onMirrorResize = (en: ResizeObserverEntry) => {
  textareaHeight.value = en.target.clientHeight;
  console.log(en);
};
</script>
<template>
  <label
    class="o-textarea"
    :class="[
      `o-textarea-size-${props.size || defaultSize}`,
      `o-textarea-shape-${props.shape || defaultShape}`,
      status ? `o-textarea-status-${status}` : '',
      {
        'o-textarea-disabled': props.disabled,
        'o-textarea-focus': isFocus,
        'o-textarea-auto-height': props.autoHeight,
      },
    ]"
    @mousedown="onMouseDown"
  >
    <div
      class="o-textarea-wrap"
      :class="{
        'o-textarea-clearable': props.clearable && realValue !== '' && !props.disabled,
      }"
    >
      <textarea
        ref="textareaRef"
        class="o-textarea-textarea"
        :placeholder="props.placeholder"
        :value="realValue"
        :readonly="props.readonly"
        :disabled="props.disabled"
        :style="{
          resize: resizeValue,
          height: textareaHeight + 'px',
        }"
        :maxlength="props.inputOutLimit ? '' : props.maxLength"
        :rows="props.rows"
        :cols="props.cols"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
        @keydown="onKeyDown"
        @compositionstart="onCompositionStart"
        @compositionend="onCompositionEnd"
      ></textarea>

      <OResizeObserver v-if="props.autoHeight" @resize="onMirrorResize">
        <div class="o-textarea-mirror">{{ textareaText }}</div>
      </OResizeObserver>
      <div v-if="props.clearable" class="o-textarea-clear" @click="clearClick"><IconX class="o-textarea-clear-icon" /></div>
      <div v-if="props.maxLength" class="o-textarea-limit">
        <span :class="{ 'is-error': isOutLengthLimit }">{{ currentLength }}</span
        >/{{ props.maxLength }}
      </div>
    </div>
  </label>
</template>
