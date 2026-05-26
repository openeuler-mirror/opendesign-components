// packages/opendesign/src/_composables/use-form-field.ts
import { computed, inject, onMounted, ref } from 'vue';
import { formItemInjectKey } from '../form';
import { uniqueId } from '../_utils/helper.ts';
import { Color2T } from '../_utils/types.ts';

export interface FormFieldEmits {
  (e: 'focus', evt: FocusEvent): void;
  (e: 'blur'): void;
  (e: 'clear', evt?: Event): void;
  (e: 'pressEnter'): void;
}

export function useFormField(props: { color?: Color2T; inputId?: string }, emit: FormFieldEmits) {
  const formItem = inject(formItemInjectKey, null);

  const effectiveColor = computed<Color2T>(() => {
    const result = formItem?.fieldResult.value;
    return result ? result.type || 'normal' : (props.color ?? 'normal');
  });

  const inputId = ref(props.inputId);
  onMounted(() => {
    if (!inputId.value) {
      inputId.value = uniqueId();
    }
  });

  const isFocus = ref(false);

  const onFocus = (e: FocusEvent) => {
    isFocus.value = true;
    emit('focus', e);
    formItem?.fieldHandlers.onFocus?.();
  };

  const onBlur = () => {
    isFocus.value = false;
    emit('blur');
    formItem?.fieldHandlers.onBlur?.();
  };

  const onClear = (e?: Event) => {
    e?.stopPropagation();
    emit('clear', e);
  };

  const onPressEnter = () => {
    emit('pressEnter');
  };

  const notifyChange = () => {
    formItem?.fieldHandlers.onChange?.();
  };

  return { effectiveColor, inputId, isFocus, onFocus, onBlur, onClear, onPressEnter, notifyChange };
}
