export enum PopupPosition {
  TOP = 'top', // top
  BOTTOM = 'bottom', // bottom
  LEFT = 'left', // left
  RIGHT = 'right', // right
  LT = 'lt', //left-top
  TL = 'tl', //top-left
  LB = 'lb', //left-bottom,
  BL = 'bl', //bottom-left,
  RT = 'rt', //right-top,
  TR = 'tr', //top-right,
  RB = 'rb', //right-bottom,
  BR = 'br', //bottom-right,
}


export type FullPosition = 'top' | 'tl' | 'tr' | 'bottom' | 'bl' | 'br' | 'left' | 'lt' | 'lb' | 'right' | 'rt' | 'rb';

export enum PopupTrigger {
  NULL = 'null',
  HOVER = 'hover',
  CLICK = 'click',
  FOUCS = 'foucs',
  CONTEXT_MENU = 'contextmenu'
}