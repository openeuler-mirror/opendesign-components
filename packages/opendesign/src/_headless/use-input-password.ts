import { isTouchDevice } from '../_utils/is';
import { ref, Ref, watchEffect } from 'vue';

export interface InputPasswordOptionT {
  type: Ref<'text' | 'password'>;
  disabled: Ref<boolean>;
  showPasswordEvent: 'click' | 'pointerdown';
}

/**
 * 密码输入框
 */
export function useInputPassword(options: InputPasswordOptionT) {
  const showPassword = ref(true);

  watchEffect(() => {
    showPassword.value = options.type.value !== 'password';
  });

  const toggle = (show?: boolean) => {
    if (show === undefined) {
      showPassword.value = !showPassword.value;
    } else {
      showPassword.value = show;
    }
  };

  const onEyeClick = () => {
    if (options.disabled.value) {
      return;
    }
    if (options.showPasswordEvent === 'click') {
      toggle();
    }
  };

  const onEyeMouseUp = () => {
    if (showPassword.value) {
      toggle(false);

      if (isTouchDevice) {
        window.removeEventListener('touchend', onEyeMouseUp);
        window.removeEventListener('touchcancel', onEyeMouseUp);
      } else {
        window.removeEventListener('mouseup', onEyeMouseUp);
      }
    }
  };
  const onEyeMouseDown = () => {
    if (options.disabled.value) {
      return;
    }
    if (options.showPasswordEvent === 'pointerdown') {
      toggle(true);
      if (isTouchDevice) {
        window.addEventListener('touchend', onEyeMouseUp);
        window.addEventListener('touchcancel', onEyeMouseUp);
      } else {
        window.addEventListener('mouseup', onEyeMouseUp);
      }
    }
  };

  return {
    showPassword,
    onEyeMouseDown,
    onEyeMouseUp,
    onEyeClick,
  };
}
