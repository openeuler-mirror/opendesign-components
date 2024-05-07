import { TextareaResizeT } from './types';

export function getResizeValue(resize: TextareaResizeT) {
  if (resize === 'h') {
    return 'horizontal';
  } else if (resize === 'v') {
    return 'vertical';
  }
  return resize;
}
