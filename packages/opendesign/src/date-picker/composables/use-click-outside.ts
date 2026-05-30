import { MaybeRefOrGetter, toValue } from 'vue';
import { useEventListener } from '@vueuse/core';

export function useClickOutside(opts: {
  targets: MaybeRefOrGetter<MaybeRefOrGetter<HTMLElement | null | undefined>[]>;
  onOutside: () => void;
  disabled?: MaybeRefOrGetter<boolean>;
}) {
  const { targets, onOutside, disabled } = opts;
  useEventListener('mousedown', (e: MouseEvent) => {
    if (toValue(disabled)) return;
    const path = e.composedPath();
    if (
      toValue(targets).some((el) => {
        const node = toValue(el);
        return node && path.includes(node);
      })
    )
      return;
    onOutside();
  });
}
