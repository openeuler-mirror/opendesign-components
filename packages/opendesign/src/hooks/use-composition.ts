import { Ref, onMounted, onUnmounted, ref } from 'vue';
import { trigger } from '../_utils/event';

export function useComposition({ el }: { el?: Ref<HTMLElement | null> } = {}) {
  const isComposing = ref(false);

  // 开始中文输入
  const onCompositionStart = () => {
    isComposing.value = true;
  };
  // 结束中文输入
  const onCompositionEnd = (e: Event) => {
    if (!isComposing.value) {
      return;
    }

    isComposing.value = false;
    trigger(e.target as HTMLElement, 'input');
  };

  onMounted(() => {
    if (!el?.value) {
      return;
    }
    el.value.addEventListener('compositionstart', onCompositionStart);
    el.value.addEventListener('compositionend', onCompositionEnd);
  });

  onUnmounted(() => {
    if (!el?.value) {
      return;
    }
    el.value.removeEventListener('compositionstart', onCompositionStart);
    el.value.removeEventListener('compositionend', onCompositionEnd);
  });

  return {
    isComposing,
    onCompositionStart,
    onCompositionEnd,
  };
}
